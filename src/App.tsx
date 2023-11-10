import CardList from "./components/CardList";
import DownloadManager from "./components/DownloadManager";
import './App.css';
import { useState } from "react";
import Navigation, { NavigationOptionsKey } from "./components/Navigation";
import { Filters } from "./components/Filter";
import { useLocalStorage } from "usehooks-ts";
import { MCCard } from "./components/Card";
import { CardFilter } from "./components/Filter/Filters";


function App() {
  const [selectedNavigationItem, setSelectedNavigationItem] = useState<NavigationOptionsKey>("card_list");

  const [cards] = useLocalStorage<MCCard[]>("cards", []);
  const [filters, setFilters] = useState<CardFilter[]>([]);
  const [filterText, setFilterText] = useState("");

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
        {selectedNavigationItem == "download_manager" && <DownloadManager />}
        {selectedNavigationItem == "card_list" && 
          <CardList cards={cards} filters={filters} filterText={filterText}/>
        }
        {selectedNavigationItem == "filters" && 
          <Filters
            cards={cards}
            filters={filters}
            filterText={filterText}
            onTextFilterChanged={(text) => setFilterText(text)}
            onMultiselectFilterChanged={(name, options) => filterFieldChanged(name as keyof MCCard, options)}
            onFilterReset={() => {
              setFilterText("");
              setFilters([]);
            }} />}
      </main>
      <Navigation selected={selectedNavigationItem} onClick={(item) => setSelectedNavigationItem(item)} />
    </>
  )
}

export default App;
