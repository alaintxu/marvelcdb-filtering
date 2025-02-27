import { useEffect } from "react";
import Instructions from "./Instructions";
import CardFiltersView from "./Filter/CardFiltersSection";
import Navigation from "./Navigation";
import CardsView from "./Card/CardsView";
import DownloadManager from "./DownloadManager/DownloadManager";
import DeckView from "./Deck/DeckView";

import { LOCAL_STORAGE_CARDS_KEY, MCCard, selectAllCards } from "../store/entities/cards";
import { cardCodeAllUnclicked, navigationOptionKeySet, selectNavigationOptionKey, selectIsAnyCardClicked } from "../store/ui/other";
import { removeOldLocalStorageItems, saveToLocalStorage, saveToLocalStorageCompressed } from "../LocalStorageHelpers";
import { LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY, selectPaginationElementsPerPage } from "../store/ui/pagination";
import { LOCAL_STORAGE_DECKS_KEY, MarvelDeck, MarvelDecksDict, selectAllDecks, selectCurrentDeck } from "../store/entities/decks";
import { hasClassInAncestors } from "./Card";
import { LOCAL_STORAGE_PACKS_KEY, PackSliceState, selectPackState } from "../store/entities/packs";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";


const isSelectXButton = (element: HTMLElement) => {
  if(element.classList?.toString().includes("-indicatorContainer")){
    return true;
  }
  if(!element.parentNode){
    return false;
  }
  return isSelectXButton(element.parentNode as HTMLElement);
}
const MainLayout = () => {
  const dispatch = useAppDispatch();
  //const deckId = new URLSearchParams(window.location.search).get("deckId");
  //const { deck, isDeckLoading, isDeckFetching } = useDeckQuery(deckId || "43333");  // @ToDo: remove hardcoded deckId to ""

  // Redux values
  const selectedNavigationOptionKey = useAppSelector(selectNavigationOptionKey);
  const currentDeck: MarvelDeck | undefined = useAppSelector(selectCurrentDeck);
  const cards: MCCard[] = useAppSelector(selectAllCards);
  const decks: MarvelDecksDict = useAppSelector(selectAllDecks);
  const elementsPerPage: number = useAppSelector(selectPaginationElementsPerPage);
  const packsState: PackSliceState = useAppSelector(selectPackState);
  const isAnyCardClicked: boolean = useAppSelector(selectIsAnyCardClicked);
  //const packStatusDict: PackStatusDict = useAppSelector(selectPackStatusDict);

  // Filters
  // @ToDo: move to Redux

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
      // Handle exception for multiselect filters X buttons
      const clickedElement: HTMLElement = event.target as HTMLElement;
      if(isSelectXButton(clickedElement)){
        return true;
      }

      // Unselect card if clicked outside
      if (!hasClassInAncestors(clickedElement /*, "mc-card"*/)) {
        if(isAnyCardClicked){
          dispatch(cardCodeAllUnclicked());
        }
      }

      // Hide asides when clicked outside
      if (
        !hasClassInAncestors(clickedElement, "download-manager-container")
        &&
        !hasClassInAncestors(clickedElement, "filter-container")
        &&
        !hasClassInAncestors(clickedElement, "main-navigation-item")  // se encarga nav
      ) {
        if (selectedNavigationOptionKey !== "card_list"){
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
          />
      </main>
      <Navigation />
    </>
  )
}

export default MainLayout;
