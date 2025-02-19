import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Instructions from "./Instructions";
import CardFiltersView, { UniqueFilterOptions } from "./Filter/CardFiltersView";
import Navigation, { NavigationOptionsKey } from "./Navigation";
import CardsView from "./Card/CardsView";
import DownloadManager from "./DownloadManager/DownloadManager";
import { useQuery } from "@tanstack/react-query";
import useDeckQuery from "../hooks/useDeckQuery";
import DeckView from "./Deck/DeckView";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import { MCCard } from "../store/entities/cards";
import { Pack } from "../store/entities/packs";
import { PackStatusDict } from "../store/ui/packsStatus";

const MainLayout = () => {
  const { i18n } = useTranslation('global');
  const [selectedNavigationItem, setSelectedNavigationItem] = useState<NavigationOptionsKey>("card_list");

  const deckId = new URLSearchParams(window.location.search).get("deckId");
  const { deck } = useDeckQuery(deckId || "");


  // Packs
  const packDict:Pack[] = useSelector((state: RootState) => state.entities.packs);
  const packStatusDict: PackStatusDict = useSelector((state: RootState) => state.ui.packStatusDict);

  // Cards
  const cards: MCCard[] = useSelector((state: RootState) => state.entities.cards || []);
  //const { cards, setCards, uniqueFilterOptions } = useCards();
  //const { /*filters, setFilters,*/ selectedFilters, setSelectedFilters, filteredCards } = useFilters(cards || []);

  // Pagination
  const pagination = useSelector((state: RootState) => state.ui.pagination);

  // Filters
  const { data: uniqueFilterOptions } = useQuery<UniqueFilterOptions[], Error>({ queryKey: ["uniqueFilterOptions", i18n.language] });
  const filteredCards: MCCard[] = cards; //cards ? [...cards] : []; // @ToDo: Apply filters

  //Navigation
  useEffect(() => {
    if (!cards || cards.length == 0) setSelectedNavigationItem("download_manager");
  }, [cards]);


  const navKeyAdditionalTextMap = new Map<NavigationOptionsKey, string>();

  navKeyAdditionalTextMap.set(
    "card_list",
    `${pagination.visibleFirstElementIndex + 1}-${Math.min(...[pagination.visibleLastElementIndex, filteredCards.length])}/${filteredCards.length}`
  );
  navKeyAdditionalTextMap.set(
    "download_manager",
    `${Object.keys(packStatusDict).length}/${Object.keys(packDict).length}`
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
        />
        { 
          deck ? <DeckView deck={deck} /> : null 
        }
        { !deck && (cards ?? []).length > 0 ? <CardsView /> : <Instructions />}
        <CardFiltersView
          selectedFilters={{}/*selectedFilters*/} 
          setSelectedFilters={() => console.warn("not implemented")/*setSelectedFilters*/}
          uniqueFilterOptions={uniqueFilterOptions || []}
          />
      </main>
      <Navigation
        selected={selectedNavigationItem}
        active={(cards?.length ?? 0) > 0}
        onClick={(item: NavigationOptionsKey) => setSelectedNavigationItem(
          (previousItem: NavigationOptionsKey) => previousItem == item ? 'card_list' : item
        )} />
    </>
  )
}

export default MainLayout;
