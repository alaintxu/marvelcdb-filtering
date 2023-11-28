import CardList from "./components/CardList";
import DownloadManager from "./components/DownloadManager";
import './App.css';
import { useEffect, useState } from "react";
import Navigation, { NavigationOptionsKey } from "./components/Navigation";
import { Filters } from "./components/Filter";
import { ReactBSPagination } from "@draperez/react-components";
import { useTranslation } from "react-i18next";
import useCards, { MCCard } from "./hooks/useCards";
import useFilters, { filterStatusChanged } from "./hooks/useFilters";
import useFetchPacks from "./hooks/useFetchPacks";
import usePackStatusList from "./hooks/usePackStatusList";
import usePaginationStatus, { changePage } from "./hooks/usePaginationStatus";

const App = () => {
  const { i18n } = useTranslation('global');
  const [selectedNavigationItem, setSelectedNavigationItem] = useState<NavigationOptionsKey>("card_list");


  // Packs
  const { data, error, isLoading } = useFetchPacks([i18n.language]);
  const { packStatusList, setPackStatusList } = usePackStatusList();

  // Cards and filters
  const { cards, setCards } = useCards();
  const { filters, setFilters, filteredCards } = useFilters(cards);

  // Pagination
  const { paginationStatus, setPaginationStatus, paginatedCards } = usePaginationStatus(filteredCards);

  //Navigation
  useEffect(() => {
    if (cards.length == 0) setSelectedNavigationItem("download_manager");
  }, [cards]);

  const navKeyAdditionalTextMap = new Map<NavigationOptionsKey, string>();
  
  if (filters.length)
    navKeyAdditionalTextMap.set(
      "filters", 
      //String(filters.length)
      String(filters.reduce(
        (previousValue, currentFilter) => previousValue+currentFilter.filterStatus.selected.length,
        0
      ))
    );
  navKeyAdditionalTextMap.set(
    "card_list",
    `${paginationStatus.visibleFirstCardIndex + 1}-${Math.min(...[paginationStatus.visibleLastCardIndex, filteredCards.length])}/${filteredCards.length}`
  );
  navKeyAdditionalTextMap.set(
    "download_manager",
    `${packStatusList.length}/${data.length}`
  )
  
  // Other
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
        <DownloadManager 
          cards={cards} 
          setCards={setCards} 
          packs={data} 
          packsAreLoading={isLoading} 
          packsError={error}
          packStatusList={packStatusList}
          setPackStatusList={setPackStatusList}/>
        <CardList cards={paginatedCards} />
        <Filters
          cards={cards}
          filters={filters}
          cardsPerPage={paginationStatus.cardsPerPage}
          cardsPerPageChanged={(newCardsPerPage) => setPaginationStatus({...paginationStatus, cardsPerPage: newCardsPerPage})}
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
      <div id="pagination-container" className="bg-dark d-flex flex-column justify-content-center align-items-center">
        <ReactBSPagination
          totalPages={paginationStatus.totalPages}
          currentPage={paginationStatus.currentPage}
          buttonSize='sm'
          onPageClick={(pageNumber: number) => setPaginationStatus((prev) => changePage(prev, pageNumber))} />
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
