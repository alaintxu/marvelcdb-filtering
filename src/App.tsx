import CardList from "./components/CardList";
import DownloadManager from "./components/DownloadManager";
import './App.css';
import { useEffect, useState } from "react";
import Navigation, { NavigationOptionsKey } from "./components/Navigation";
import { Filters } from "./components/Filter";
import { ReactBSPagination } from "@draperez/react-components";
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useTranslation } from "react-i18next";
import useCards, { MCCard } from "./hooks/useCards";
import useFilters, { CardFilter, evaluateCardFiltering, filterStatusChanged } from "./hooks/useFilters";

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

  const { cards, setCards, cardsPerPage, setCardsPerPage } = useCards();

  // Status
  const [showAllCardData, setShowAllCardData] = useState(false);

  // Filters
  const { filters, setFilters } = useFilters();

  const evaluateCardTextFiltering = (textFilter: CardFilter, card: MCCard): boolean => {
    /*
    ** Evaluate if the given card contains the texts defined in the given
    ** textFilter
    */

    // Fields positivelly evaluated (name, text, flavor )
    const fieldsContainingText = textFilterFields.filter((field) => {
      // The actual value of the field
      const fieldValue = String(card[field as keyof MCCard]).toLowerCase();

      // The texts selected in the filters
      const selectedTexts = textFilter.filterStatus.selected;

      // The selected text found in the fieldValue
      const evaluatedTexts = selectedTexts.filter((selectedText) => fieldValue.includes(selectedText.value.toLowerCase()))

      if (textFilter.filterStatus.isAnd)
        // All selected texts must appear
        return selectedTexts.length == evaluatedTexts.length;
      else
        // At least 1 selected text must appear
        return evaluatedTexts.length > 0;

    });

    // Any field has positive evaluation?
    return fieldsContainingText.length > 0;
  }

  const filteredCards = cards.filter((card) => {
    const noTextFilters = filters.filter((filter) => filter.field !== 'text');

    const evaluatedFilters = noTextFilters.filter(
      (filter) => evaluateCardFiltering(filter, card)
    );

    if (evaluatedFilters.length != noTextFilters.length) return false;


    const textFilter: CardFilter | undefined = filters.filter((filter) => filter.field == 'text')?.[0];
    if (!textFilter) return true;
    return evaluateCardTextFiltering(textFilter, card)
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
    if (cards.length == 0) setSelectedNavigationItem("download_manager");
  }, [cards]);

  const mainClassNames = [
    "container-fluid",
    "bg-dark",
    "text-light",
    selectedNavigationItem === "download_manager" ? "main-section--download-manager" : "",
    selectedNavigationItem == "card_list" ? "main-section--only-card-list" : "",
    selectedNavigationItem == "filters" ? "main-section--filters" : "",
  ]

  const navKeyAdditionalTextMap = new Map<NavigationOptionsKey, string>();
  if (filters.length) navKeyAdditionalTextMap.set("filters", String(filters.length));
  navKeyAdditionalTextMap.set(
    "card_list",
    `${visibleFirstCardIndex + 1}-${Math.min(...[visibleLastCardIndex, filteredCards.length])}/${filteredCards.length}`
  );
  // @ToDo: add number of pack downloaded.

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
          {/* @ToDo: botón para girar todas las cartas */}
          <h1>
            {t('card_list')}
          </h1>
          <CardList cards={paginatedCards} showAllCardData={showAllCardData} />
        </section>
        <Filters
          cards={cards}
          filters={filters}
          cardsPerPage={cardsPerPage}
          cardsPerPageChanged={(newCardsPerPage) => setCardsPerPage(newCardsPerPage)}
          onMultiselectFilterChanged={(name, newFilterStatus) => filterStatusChanged(
            filters,
            setFilters,
            name as keyof MCCard, 
            newFilterStatus
          )}
          onFilterReset={() => {
            setFilters([]);
          }} />
      </main>
      <div className="bg-dark pt-3 shadow d-flex flex-column justify-content-center align-items-center">
        <ReactBSPagination
          totalPages={totalPages}
          currentPage={currentPage}
          buttonSize='sm'
          onPageClick={(pageNumber: number) => setCurrentPage(pageNumber)} />
      </div>
      <Navigation
        selected={selectedNavigationItem}
        active={cards.length > 0}
        additionalText={navKeyAdditionalTextMap}
        onClick={(item) => setSelectedNavigationItem(
          (previousItem) => previousItem == item ? 'card_list' : item
        )} />
    </>
  )
}

export default App;
