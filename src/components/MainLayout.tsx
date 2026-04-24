import { lazy, Suspense, useEffect } from "react";

import { MCCard, selectAllCards } from "../store/entities/cards";
import { cardCodeAllUnclicked, navigationOptionKeySet, selectNavigationOptionKey, selectIsAnyCardClicked } from "../store/ui/other";
import { removeOldLocalStorageItems, saveToLocalStorage } from "../LocalStorageHelpers";
import { LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY, selectPaginationElementsPerPage } from "../store/ui/pagination";
import { LOCAL_STORAGE_DECKS_KEY, MarvelDeck, MarvelDecksDict, selectAllDecks, selectCurrentDeck } from "../store/entities/decks";
import { hasClassInAncestors } from "./Card";
import { LOCAL_STORAGE_PACKS_KEY, PackSliceState, selectPackState, loadPackCards, selectAllPacks } from "../store/entities/packs";
import { useAppDispatch, useAppSelector } from "../hooks/useStore";
import LoadingSpinner from "./LoadingSpinner";


const CardsView = lazy(() => import('./Card/CardsView'));
const DeckView = lazy(() => import('./Deck/DeckView'));
const Instructions = lazy(() => import('./Instructions'));
const Navigation = lazy(() => import('./Navigation/Navigation'));
const CardFiltersView = lazy(() => import('./Filter/CardFiltersSection'));
const DownloadManager = lazy(() => import('./DownloadManager/DownloadManager'));

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

  // Redux values
  const selectedNavigationOptionKey = useAppSelector(selectNavigationOptionKey);
  const currentDeck: MarvelDeck | undefined = useAppSelector(selectCurrentDeck);
  const cards: MCCard[] = useAppSelector(selectAllCards);
  const decks: MarvelDecksDict = useAppSelector(selectAllDecks);
  const elementsPerPage: number = useAppSelector(selectPaginationElementsPerPage);
  const packsState: PackSliceState = useAppSelector(selectPackState);
  const allPacks = useAppSelector(selectAllPacks);
  const isAnyCardClicked: boolean = useAppSelector(selectIsAnyCardClicked);
  const isAnyPackSelected: boolean = allPacks.some(pack => pack.download_status === "downloaded");


  // Manage local storage
  useEffect(() => { removeOldLocalStorageItems(); }, []); // [] means this effect will run once after the first render
  //useEffect(() => { if (packStatusDict) saveToLocalStorage(LOCAL_STORAGE_PACK_STATUS_KEY, packStatusDict);        }, [packStatusDict]);
  useEffect(() => { if (packsState)     saveToLocalStorage(LOCAL_STORAGE_PACKS_KEY, packsState);                  }, [packsState]);
  useEffect(() => {                     saveToLocalStorage(LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY, elementsPerPage); }, [elementsPerPage]);
  useEffect(() => { if (decks)          saveToLocalStorage(LOCAL_STORAGE_DECKS_KEY,  decks);                      }, [decks]);
  //useEffect(() => { if (cards)          saveToLocalStorageCompressed(LOCAL_STORAGE_CARDS_KEY, cards);                       }, [cards]);

  // Auto-fetch cards for packs marked as "downloaded" but with no cards in store
  // This handles return visits when packs are persisted but cards are not
  useEffect(() => {
    if (packsState.loading || cards.length > 0) return; // Wait for packs to load and don't re-fetch if cards already exist
    
    const downloadedPacks = allPacks.filter(pack => pack.download_status === "downloaded");
    if (downloadedPacks.length > 0) {
      downloadedPacks.forEach(pack => {
        dispatch<any>(loadPackCards(pack.code, pack.pack_type_code));
      });
    }
  }, [packsState.loading, allPacks, cards.length, dispatch]);

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
      <Suspense fallback={
        <div style={{aspectRatio: 1/1, display: "flex", justifyContent: "center", alignItems: "center"}}>
          <LoadingSpinner />
        </div>
        }>
      <main id="main-section" className={mainClassNames.join(" ")}>
          <DownloadManager id="download-manager" className='download-manager-container p-3 bg-dark shadow' />
        {currentDeck ? (
            <DeckView deck={currentDeck} />
        ) : (
          isAnyPackSelected? (
             <CardsView />
          ) : (
            <Instructions />
        ))}
          <CardFiltersView
            id="filters" 
            className="bg-dark shadow d-flex flex-column p-3 filter-container"
            selectedFilters={{}/*selectedFilters*/} 
            setSelectedFilters={() => console.warn("not implemented")/*setSelectedFilters*/}
            />
      </main>
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Navigation />
      </Suspense>
    </>
  )
}

export default MainLayout;
