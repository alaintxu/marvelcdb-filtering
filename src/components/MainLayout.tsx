import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Instructions from "./Instructions";
import CardFiltersView, { UniqueFilterOptions } from "./Filter/CardFiltersSection";
import Navigation from "./Navigation";
import CardsView from "./Card/CardsView";
import DownloadManager from "./DownloadManager/DownloadManager";
import { useQuery } from "@tanstack/react-query";
import DeckView from "./Deck/DeckView";
import { useDispatch, useSelector } from "react-redux";
import { LOCAL_STORAGE_CARDS_KEY, MCCard, selectAllCards } from "../store/entities/cards";
import { cardCodeAllUnclicked, navigationOptionKeySet, selectNavigationOptionKey, selectIsAnyCardClicked } from "../store/ui/other";
import { removeOldLocalStorageItems, saveToLocalStorage, saveToLocalStorageCompressed } from "../LocalStorageHelpers";
import { LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY, selectPaginationElementsPerPage } from "../store/ui/pagination";
import { LOCAL_STORAGE_DECKS_KEY, MarvelDeck, MarvelDecksDict, selectAllDecks, selectCurrentDeck } from "../store/entities/decks";
import { hasClassInAncestors } from "./Card";
import { AppDispatch } from "../store/configureStore";
import { LOCAL_STORAGE_PACKS_KEY, PackSliceState, selectPackState } from "../store/entities/packs";

const MainLayout = () => {
  const { i18n } = useTranslation('global');
  const dispatch = useDispatch<AppDispatch>();
  //const deckId = new URLSearchParams(window.location.search).get("deckId");
  //const { deck, isDeckLoading, isDeckFetching } = useDeckQuery(deckId || "43333");  // @ToDo: remove hardcoded deckId to ""

  // Redux values
  const selectedNavigationOptionKey = useSelector(selectNavigationOptionKey);
  const currentDeck: MarvelDeck | null = useSelector(selectCurrentDeck);
  const cards: MCCard[] = useSelector(selectAllCards);
  const decks: MarvelDecksDict = useSelector(selectAllDecks);
  const elementsPerPage: number = useSelector(selectPaginationElementsPerPage);
  const packsState: PackSliceState = useSelector(selectPackState);
  const isAnyCardClicked: boolean = useSelector(selectIsAnyCardClicked);
  //const packStatusDict: PackStatusDict = useSelector(selectPackStatusDict);

  // Filters
  // @ToDo: move to Redux
  const { data: uniqueFilterOptions } = useQuery<UniqueFilterOptions[], Error>({ queryKey: ["uniqueFilterOptions", i18n.language] });

  // Manage local storage
  useEffect(() => { removeOldLocalStorageItems(); }, []); // [] means this effect will run once after the first render
  //useEffect(() => { if (packStatusDict) saveToLocalStorage(LOCAL_STORAGE_PACK_STATUS_KEY, packStatusDict);        }, [packStatusDict]);
  useEffect(() => { if (packsState)     saveToLocalStorage(LOCAL_STORAGE_PACKS_KEY, packsState);                  }, [packsState]);
  useEffect(() => {                     saveToLocalStorage(LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY, elementsPerPage); }, [elementsPerPage]);
  useEffect(() => { if (decks)          saveToLocalStorage(LOCAL_STORAGE_DECKS_KEY,  decks);                      }, [decks]);
  useEffect(() => { if (cards)          saveToLocalStorageCompressed(LOCAL_STORAGE_CARDS_KEY, cards);             }, [cards]);

  // Listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Unselect card if clicked outside
      if (!hasClassInAncestors(event.target as HTMLElement /*, "mc-card"*/)) {
        if(isAnyCardClicked){
          console.log('unclick all cards');
          dispatch(cardCodeAllUnclicked());
        }
      }

      // Hide asides when clicked outside
      if (
        !hasClassInAncestors(event.target as HTMLElement, "download-manager-container")
        &&
        !hasClassInAncestors(event.target as HTMLElement, "filter-container")
        &&
        !hasClassInAncestors(event.target as HTMLElement, "main-navigation-item")  // se encarga nav
      ) {
        if (selectedNavigationOptionKey !== "card_list"){
          console.log('clicked outside');
          dispatch(navigationOptionKeySet("card_list"));
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, selectedNavigationOptionKey, isAnyCardClicked]);


  // Other
  const mainClassNames = [
    "p-0",
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
        <DownloadManager id="download-manager" className='download-manager-container p-3 bg-dark shadow' />
        {currentDeck ? <DeckView deck={currentDeck} /> : (
          cards.length > 0 ? <CardsView /> : <Instructions />
        )}
        {/*isDeckLoading || isDeckFetching ? <div className="d-flex justify-content-center mt-4">
            <LoadingSpinner />
          </div> : <>
          {deck ? <DeckView deck={deck} /> : <>
            <CardsView /> : <Instructions />
          </>}
        </>*/}
        <CardFiltersView
          id="filters" 
          className="bg-dark shadow d-flex flex-column p-3 filter-container"
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
