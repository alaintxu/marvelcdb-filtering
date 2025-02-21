import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Instructions from "./Instructions";
import CardFiltersView, { UniqueFilterOptions } from "./Filter/CardFiltersView";
import Navigation from "./Navigation";
import CardsView from "./Card/CardsView";
import DownloadManager from "./DownloadManager/DownloadManager";
import { useQuery } from "@tanstack/react-query";
import DeckView from "./Deck/DeckView";
import { useSelector } from "react-redux";
import { LOCAL_STORAGE_CARDS_KEY, MCCard, selectAllCards } from "../store/entities/cards";
import { selectSelectedNavigationOptionKey } from "../store/ui/selectedNavigationOptionKey";
import { removeOldLocalStorageItems, saveToLocalStorage, saveToLocalStorageCompressed } from "../LocalStorageHelpers";
import { LOCAL_STORAGE_PACK_STATUS_KEY, PackStatusDict, selectPackStatusDict } from "../store/ui/packsStatus";
import { LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY, selectPaginationElementsPerPage } from "../store/ui/pagination";
import { LOCAL_STORAGE_DECKS_KEY, MarvelDeck, MarvelDecksDict, selectAllDecks, selectCurrentDeck, selectIsCurrentInList } from "../store/entities/decks";

const MainLayout = () => {
  const { i18n } = useTranslation('global');
  //const deckId = new URLSearchParams(window.location.search).get("deckId");
  //const { deck, isDeckLoading, isDeckFetching } = useDeckQuery(deckId || "43333");  // @ToDo: remove hardcoded deckId to ""

  // Redux values
  const selectedNavigationOptionKey = useSelector(selectSelectedNavigationOptionKey);
  const currentDeck: MarvelDeck | null = useSelector(selectCurrentDeck);
  const cards: MCCard[] = useSelector(selectAllCards);
  const decks: MarvelDecksDict = useSelector(selectAllDecks);
  const elementsPerPage: number = useSelector(selectPaginationElementsPerPage);
  const packStatusDict: PackStatusDict = useSelector(selectPackStatusDict);

  // Filters
  // @ToDo: move to Redux
  const { data: uniqueFilterOptions } = useQuery<UniqueFilterOptions[], Error>({ queryKey: ["uniqueFilterOptions", i18n.language] });

  // Manage local storage
  useEffect(() => { removeOldLocalStorageItems(); }, []); // [] means this effect will run once after the first render
  useEffect(() => { if (packStatusDict) saveToLocalStorage(LOCAL_STORAGE_PACK_STATUS_KEY, packStatusDict);        }, [packStatusDict]);
  useEffect(() => {                     saveToLocalStorage(LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY, elementsPerPage); }, [elementsPerPage]);
  useEffect(() => { if (decks)          saveToLocalStorage(LOCAL_STORAGE_DECKS_KEY,  decks);                      }, [decks]);
  useEffect(() => { if (cards)          saveToLocalStorageCompressed(LOCAL_STORAGE_CARDS_KEY, cards);             }, [cards]);



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
        {currentDeck ? <DeckView deck={currentDeck} /> : (
          cards.length < 1 ? <Instructions /> : <CardsView />
        )}
        {/*isDeckLoading || isDeckFetching ? <div className="d-flex justify-content-center mt-4">
            <LoadingSpinner />
          </div> : <>
          {deck ? <DeckView deck={deck} /> : <>
            <CardsView /> : <Instructions />
          </>}
        </>*/}
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
