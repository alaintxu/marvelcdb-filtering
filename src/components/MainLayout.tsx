import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Instructions from "./Instructions";
import CardFiltersView, { UniqueFilterOptions } from "./Filter/CardFiltersView";
import Navigation from "./Navigation";
import CardsView from "./Card/CardsView";
import DownloadManager from "./DownloadManager/DownloadManager";
import { useQuery } from "@tanstack/react-query";
import useDeckQuery from "../hooks/useDeckQuery";
import DeckView from "./Deck/DeckView";
import { useSelector } from "react-redux";
import { MCCard, selectAllCards } from "../store/entities/cards";
import { selectSelectedNavigationOptionKey } from "../store/ui/selectedNavigationOptionKey";
import { removeOldLocalStorageItems, saveToLocalStorage, saveToLocalStorageCompressed } from "../LocalStorageHelpers";
import { PackStatusDict, selectPackStatusDict } from "../store/ui/packsStatus";
import { selectPaginationElementsPerPage } from "../store/ui/pagination";
import LoadingSpinner from "./LoadingSpinner";

const MainLayout = () => {
  const { i18n } = useTranslation('global');
  const deckId = new URLSearchParams(window.location.search).get("deckId");
  const selectedNavigationOptionKey = useSelector(selectSelectedNavigationOptionKey);
  const { deck, isDeckLoading, isDeckFetching } = useDeckQuery(deckId || "43333");  // @ToDo: remove hardcoded deckId to ""

  // Redux values
  const cards: MCCard[] = useSelector(selectAllCards);
  const elementsPerPage: number = useSelector(selectPaginationElementsPerPage);
  const packStatusDict: PackStatusDict = useSelector(selectPackStatusDict);

  // Filters
  // @ToDo: move to Redux
  const { data: uniqueFilterOptions } = useQuery<UniqueFilterOptions[], Error>({ queryKey: ["uniqueFilterOptions", i18n.language] });

  // Local storage
  useEffect(() => {
    removeOldLocalStorageItems();
  }, []); // [] means this effect will run once after the first render

  useEffect(() => {
    if (cards) {
      saveToLocalStorageCompressed("cards_compressed", cards);
    }
    //if (!cards || cards.length == 0) dispatch(selectedNavigationOptionKeySet("download_manager"));

  }, [cards]);

  useEffect(() => {
    if (packStatusDict) {
      saveToLocalStorage("pack_status_v2", packStatusDict);
    }
  }, [packStatusDict]);

  useEffect(() => {
    saveToLocalStorage("elements_per_page", elementsPerPage);
  }, [elementsPerPage]);



  // Other
  const mainClassNames = [
    "container-fluid",
    "bg-dark",
    "text-light",
    selectedNavigationOptionKey === "download_manager" ? "main-section--download-manager" : "",
    selectedNavigationOptionKey == "card_list" ? "main-section--only-card-list" : "",
    selectedNavigationOptionKey == "filters" ? "main-section--filters" : "",
  ]

  return (
    <>
      <main id="main-section" className={mainClassNames.join(" ")}>
        <DownloadManager
        />
        {isDeckLoading || isDeckFetching ? <div className="d-flex justify-content-center mt-4">
            <LoadingSpinner />
          </div> : <>
          {deck ? <DeckView deck={deck} /> : <>
            <CardsView /> : <Instructions />
          </>}
        </>}
        <CardFiltersView
          selectedFilters={{}/*selectedFilters*/} 
          setSelectedFilters={() => console.warn("not implemented")/*setSelectedFilters*/}
          uniqueFilterOptions={uniqueFilterOptions || []}
          />
      </main>
      <Navigation />
    </>
  )
}

export default MainLayout;
