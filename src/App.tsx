import CardList from "./components/CardList";
import DownloadManager from "./components/DownloadManager";
import './App.css';
import { useEffect, useState } from "react";
import Navigation, { NavigationOptionsKey } from "./components/Navigation";
import { Filters } from "./components/Filter";
import { MCCard } from "./components/Card";
import { CardFilter } from "./components/Filter/Filters";


function App() {
  const [selectedNavigationItem, setSelectedNavigationItem] = useState<NavigationOptionsKey>("card_list");

 
  const [cards, setCards] = useState<MCCard[]>(JSON.parse(localStorage.getItem('cards') || "[]"));
  const [cardsPerPage, setCardsPerPage] = useState<number>(parseInt(localStorage.getItem('cards_per_page') || "12"));

  const [filters, setFilters] = useState<CardFilter[]>([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
    if(cards.length == 0) setSelectedNavigationItem("download_manager");
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("cards_per_page", String(cardsPerPage));
  }, [cardsPerPage]);

  const filterFieldChanged = (field: keyof MCCard, values: string[]) => {
    const tmpFilter = [...filters.filter((f) => f.field !== field)]
  
    if (values.length == 0) return setFilters(tmpFilter);
  
    setFilters([
      ...tmpFilter,
      { field: field, values: [...values] }
    ])
  }
  
  return (
    <>
      <main className="container-fluid bg-dark text-light">
        {selectedNavigationItem == "download_manager" && 
          <DownloadManager cards={cards} setCards={setCards} />}
        {selectedNavigationItem == "card_list" && 
          <CardList cards={cards} filters={filters} filterText={filterText} cardsPerPage={cardsPerPage}/>
        }
        {selectedNavigationItem == "filters" && 
          <Filters
            cards={cards}
            filters={filters}
            filterText={filterText}
            cardsPerPage={cardsPerPage}
            cardsPerPageChanged={(newCardsPerPage) => setCardsPerPage(newCardsPerPage)}
            onTextFilterChanged={(text) => setFilterText(text)}
            onMultiselectFilterChanged={(name, options) => filterFieldChanged(name as keyof MCCard, options)}
            onFilterReset={() => {
              setFilterText("");
              setFilters([]);
            }} />}
      </main>
      <Navigation selected={selectedNavigationItem} active={cards.length > 0} onClick={(item) => setSelectedNavigationItem(item)} />
    </>
  )
}

export default App;
