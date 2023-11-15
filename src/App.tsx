import CardList from "./components/CardList";
import DownloadManager from "./components/DownloadManager";
import './App.css';
import { useEffect, useState } from "react";
import Navigation, { NavigationOptionsKey } from "./components/Navigation";
import { Filters } from "./components/Filter";
import { MCCard } from "./components/Card";
import { CardFilter } from "./components/Filter/Filters";
import { FilterStatus } from "./components/Filter/MultiselectFilter";
import { ReactBSPagination } from "@draperez/react-components";
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useTranslation } from "react-i18next";

// Defines the fields where text will be search on text filter
const textFilterFields = [
  'name',
  'real_name',
  'text',
  'real_text',
  'back_text',
  'flavor',
  'traits',
  'real_traits'
];


function App() {
  const { t } = useTranslation('global');
  const [selectedNavigationItem, setSelectedNavigationItem] = useState<NavigationOptionsKey>("card_list");


  const [cards, setCards] = useState<MCCard[]>(JSON.parse(localStorage.getItem('cards') || "[]"));
  const [cardsPerPage, setCardsPerPage] = useState<number>(parseInt(localStorage.getItem('cards_per_page') || "12"));

  const [filters, setFilters] = useState<CardFilter[]>([]);
  const [filterText, setFilterText] = useState("");

  // Status
  const [showAllCardData, setShowAllCardData] = useState(false);

  // Filters
  const evaluateCarFiltering = (filter: CardFilter, card: MCCard): boolean => {
    const filterValues = filter.filterStatus.selected.map((option) => option.value);
    const cardValues = card[filter.field] as string[];


    const filteredCardValues = filterValues.filter((filterValue) => cardValues.includes(filterValue));
    if (filter.filterStatus.isAnd)
      return filteredCardValues.length == filterValues.length;
    else
      return filteredCardValues.length > 0;
  }

  const filteredCards = cards.filter((card) => {
    for (const filter of filters)
      if (!evaluateCarFiltering(filter, card))
        return false


    for (const field of textFilterFields)
      if (String(card[field as keyof MCCard]).toLowerCase().includes(filterText))
        return true;

    return false;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const visibleFirstCardIndex = (currentPage - 1) * cardsPerPage;
  const visibleLastCardIndex = visibleFirstCardIndex + cardsPerPage;
  const paginatedCards = filteredCards.slice(
    visibleFirstCardIndex,
    visibleLastCardIndex
  )
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);


  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
    if (cards.length == 0) setSelectedNavigationItem("download_manager");
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("cards_per_page", String(cardsPerPage));
  }, [cardsPerPage]);

  const filterStatusChanged = (field: keyof MCCard, newStatus: FilterStatus) => {
    const tmpFilter = [...filters.filter((f) => f.field !== field)]

    if (newStatus.selected.length == 0) return setFilters(tmpFilter);

    setFilters([
      ...tmpFilter,
      {
        field: field,
        filterStatus: {
          selected: [...newStatus.selected],
          isAnd: newStatus.isAnd
        }
      }
    ])
  }

  const mainClassNames = [
    "container-fluid",
    "bg-dark",
    "text-light",
    selectedNavigationItem === "download_manager" ? "main-section--download-manager" : "",
    selectedNavigationItem == "card_list" ? "main-section--only-card-list" : "",
    selectedNavigationItem == "filters" ? "main-section--filters" : "",
  ]

  return (
    <>
      <main id="main-section" className={mainClassNames.join(" ")}>
        <DownloadManager cards={cards} setCards={setCards} />
        <section id="card-list" className='p-3'>

          <button
            id="show-all-button"
            className={`btn btn-${showAllCardData ? 'primary' : 'secondary'}`}
            onClick={() => setShowAllCardData((prev) => !prev)}>
            {showAllCardData ? <>
              <BsFillEyeSlashFill title="Esconder datos" />
            </> : <>
              <BsFillEyeFill title="Mostrar datos" />
            </>}
          </button>
          <h1>
            {t('card_list')} &nbsp;
            <span className='badge text-dark bg-light'>
              {visibleFirstCardIndex + 1}-{Math.min(...[visibleLastCardIndex, filteredCards.length])}/{filteredCards.length}
            </span>
          </h1>
          <CardList cards={paginatedCards} showAllCardData={showAllCardData} />
        </section>
        <Filters
          cards={cards}
          filters={filters}
          filterText={filterText}
          cardsPerPage={cardsPerPage}
          cardsPerPageChanged={(newCardsPerPage) => setCardsPerPage(newCardsPerPage)}
          onTextFilterChanged={(text) => setFilterText(text)}
          onMultiselectFilterChanged={(name, newFilterStatus) => filterStatusChanged(name as keyof MCCard, newFilterStatus)}
          onFilterReset={() => {
            setFilterText("");
            setFilters([]);
          }} />
      </main>
      <div className="bg-dark pt-3 shadow">
      <ReactBSPagination
        totalPages={totalPages}
        currentPage={currentPage}
        buttonSize='sm'
        onPageClick={(pageNumber: number) => setCurrentPage(pageNumber)} />
      </div>
      <Navigation selected={selectedNavigationItem} active={cards.length > 0} onClick={(item) => setSelectedNavigationItem(item)} />
    </>
  )
}

export default App;
