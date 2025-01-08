import CardList from "./components/CardList";
import DownloadManager from "./components/DownloadManager";
import './App.css';
import { useEffect, useState } from "react";
import Navigation, { NavigationOptionsKey } from "./components/Navigation";
import { ReactBSPagination } from "@draperez/react-components";
import { useTranslation } from "react-i18next";
import useCards from "./hooks/useCards";
import useFilters from "./hooks/useFilters";
import useFetchPacks from "./hooks/useFetchPacks";
import usePackStatusList from "./hooks/usePackStatusList";
import usePaginationStatus, { changePage } from "./hooks/usePaginationStatus";
import Instructions from "./components/Instructions";
import NewFilters from "./components/Filter/NewFilters";

const App = () => {
  const { i18n } = useTranslation('global');
  const [selectedNavigationItem, setSelectedNavigationItem] = useState<NavigationOptionsKey>("card_list");


  // Packs
  const { data, error, isLoading } = useFetchPacks([i18n.language]);
  const { packStatusList, setPackStatusList } = usePackStatusList();

  // Cards and filters
  const { cards, setCards, uniqueFilterOptions } = useCards();
  const { /*filters, setFilters,*/ selectedFilters, setSelectedFilters, filteredCards } = useFilters(cards);

  // Pagination
  const { paginationStatus, setPaginationStatus, paginatedCards } = usePaginationStatus(filteredCards);

  //Navigation
  useEffect(() => {
    if (cards.length == 0) setSelectedNavigationItem("download_manager");
  }, [cards]);


  const navKeyAdditionalTextMap = new Map<NavigationOptionsKey, string>();

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
          setPackStatusList={setPackStatusList} />
        {cards.length > 0 ? <CardList cards={paginatedCards} /> : <Instructions />}
        {/*<Filters
          cards={cards}
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          cardsPerPage={paginationStatus.cardsPerPage}
          cardsPerPageChanged={(newCardsPerPage) => {
            const newTotalPages = Math.ceil(filteredCards.length / newCardsPerPage);
            const newCurrentPage = Math.floor(paginationStatus.visibleFirstCardIndex / newCardsPerPage) + 1;
            const newVisibleLastCardIndex = paginationStatus.visibleFirstCardIndex + newCardsPerPage;
            setPaginationStatus(
              {
                ...paginationStatus,
                totalPages: newTotalPages,
                cardsPerPage: newCardsPerPage,
                currentPage: newCurrentPage,
                visibleLastCardIndex: newVisibleLastCardIndex
              })
          }}
          onMultiselectFilterChanged={(name, newFilterStatus) => filterStatusChanged(
            filters,
            setFilters,
            name as keyof MCCard,
            newFilterStatus
          )}
          onFilterReset={() => {
            setFilters([]);
          }} />*/}
        <NewFilters
          selectedFilters={selectedFilters} 
          setSelectedFilters={setSelectedFilters}
          cardsPerPage={paginationStatus.cardsPerPage}
          cardsPerPageChanged={(newCardsPerPage: number) => {
            const newTotalPages = Math.ceil(filteredCards.length / newCardsPerPage);
            const newCurrentPage = Math.floor(paginationStatus.visibleFirstCardIndex / newCardsPerPage) + 1;
            const newVisibleLastCardIndex = paginationStatus.visibleFirstCardIndex + newCardsPerPage;
            setPaginationStatus(
              {
                ...paginationStatus,
                totalPages: newTotalPages,
                cardsPerPage: newCardsPerPage,
                currentPage: newCurrentPage,
                visibleLastCardIndex: newVisibleLastCardIndex
              })
          }}
          uniqueFilterOptions={uniqueFilterOptions}
          />
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
