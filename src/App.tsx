import CardList from "./components/CardList";
import DownloadManager from "./components/DownloadManager";
import './App.css';
import { useEffect, useState } from "react";
import Navigation, { NavigationOptionsKey } from "./components/Navigation";
import { Filters } from "./components/Filter";
import { MCCard } from "./components/Card";
import { CardFilter } from "./components/Filter/Filters";
import { FilterStatus } from "./components/Filter/MultiselectFilter";


function App() {
  const [selectedNavigationItem, setSelectedNavigationItem] = useState<NavigationOptionsKey>("card_list");


  const [cards, setCards] = useState<MCCard[]>(JSON.parse(localStorage.getItem('cards') || "[]"));
  const [cardsPerPage, setCardsPerPage] = useState<number>(parseInt(localStorage.getItem('cards_per_page') || "12"));

  const [filters, setFilters] = useState<CardFilter[]>([]);
  const [filterText, setFilterText] = useState("");

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
        <CardList cards={cards} filters={filters} filterText={filterText} cardsPerPage={cardsPerPage} />
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
      <Navigation selected={selectedNavigationItem} active={cards.length > 0} onClick={(item) => setSelectedNavigationItem(item)} />
    </>
  )
}

export default App;
