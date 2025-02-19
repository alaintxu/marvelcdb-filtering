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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import { MCCard } from "../store/entities/cards";
import { selectedNavigationOptionKeySet, selectSelectedNavigationOptionKey } from "../store/ui/selectedNavigationOptionKey";

const MainLayout = () => {
  const { i18n } = useTranslation('global');
  const dispatch = useDispatch();
  const deckId = new URLSearchParams(window.location.search).get("deckId");
  const selectedNavigationOptionKey = useSelector(selectSelectedNavigationOptionKey);
  const { deck } = useDeckQuery(deckId || "");

  // Cards
  const cards: MCCard[] = useSelector((state: RootState) => state.entities.cards || []);

  // Filters
  const { data: uniqueFilterOptions } = useQuery<UniqueFilterOptions[], Error>({ queryKey: ["uniqueFilterOptions", i18n.language] });

  //Navigation
  useEffect(() => {
    if (!cards || cards.length == 0) dispatch(selectedNavigationOptionKeySet("download_manager"));
  }, [cards]);


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
        {deck && <DeckView deck={deck} />}
        { !deck && (cards ?? []).length > 0 ? <CardsView /> : <Instructions />}
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
