import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { MCCard, selectAllCards } from "../store/entities/cards";
import { cardCodeAllUnclicked, navigationOptionKeySet, selectNavigationOptionKey, selectIsAnyCardClicked } from "../store/ui/other";
import { removeOldLocalStorageItems, saveToLocalStorage } from "../LocalStorageHelpers";
import { LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY, selectPaginationElementsPerPage } from "../store/ui/pagination";
import { LOCAL_STORAGE_DECKS_KEY, MarvelDeck, MarvelDecksDict, selectAllDecks, selectCurrentDeck } from "../store/entities/decks";
import { hasClassInAncestors } from "./Card";
import { loadPacks } from "../store/entities/packs";
import { loadFactions } from "../store/entities/factions";
import { loadCardTypes } from "../store/entities/cardTypes";
import { loadCardSets } from "../store/entities/cardSets";
import { LOCAL_STORAGE_SELECTED_PACK_CODES_KEY, downloadSelectedPackCards, selectSelectedPackCodes } from "../store/ui/selectedPacks";
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
  const { i18n } = useTranslation();

  // Redux values
  const selectedNavigationOptionKey = useAppSelector(selectNavigationOptionKey);
  const currentDeck: MarvelDeck | undefined = useAppSelector(selectCurrentDeck);
  const cards: MCCard[] = useAppSelector(selectAllCards);
  const decks: MarvelDecksDict = useAppSelector(selectAllDecks);
  const elementsPerPage: number = useAppSelector(selectPaginationElementsPerPage);
  const selectedPackCodes = useAppSelector(selectSelectedPackCodes);
  const isAnyCardClicked: boolean = useAppSelector(selectIsAnyCardClicked);
  const isAnyPackSelected: boolean = selectedPackCodes.length > 0;
  
  


  // Manage local storage
  useEffect(() => {
    dispatch<any>(loadPacks());
    dispatch<any>(loadFactions());
    dispatch<any>(loadCardTypes());
    dispatch<any>(loadCardSets());
  }, [dispatch, i18n.language]);

  useEffect(() => { removeOldLocalStorageItems(); }, []); // [] means this effect will run once after the first render
  useEffect(() => { saveToLocalStorage(LOCAL_STORAGE_SELECTED_PACK_CODES_KEY, selectedPackCodes);                 }, [selectedPackCodes]);
  useEffect(() => {                     saveToLocalStorage(LOCAL_STORAGE_ELEMENTS_PER_PAGE_KEY, elementsPerPage); }, [elementsPerPage]);
  useEffect(() => { if (decks)          saveToLocalStorage(LOCAL_STORAGE_DECKS_KEY,  decks);                      }, [decks]);
  //useEffect(() => { if (cards)          saveToLocalStorageCompressed(LOCAL_STORAGE_CARDS_KEY, cards);                       }, [cards]);

  // Auto-fetch cards for selected packs with no cards in store.
  useEffect(() => {
    dispatch<any>(downloadSelectedPackCards());
  }, [cards.length, dispatch, selectedPackCodes]);

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
