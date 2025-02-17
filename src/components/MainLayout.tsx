import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MCCard } from "../hooks/useCardsQuery";
import useFilters from "../hooks/useFilters";
import { Pack } from "../hooks/usePacksQuery";
import Instructions from "./Instructions";
import CardFiltersView, { UniqueFilterOptions } from "./Filter/CardFiltersView";
import Navigation, { NavigationOptionsKey } from "./Navigation";
import CardsView from "./Card/CardsView";
import DownloadManager from "./DownloadManager";
import { useQuery } from "@tanstack/react-query";
import usePaginationStatusQuery from "../hooks/usePaginationStatusQuery";
import { getLanguage } from "../i18n";
import useDeckQuery from "../hooks/useDeckQuery";
import DeckView from "./Deck/DeckView";
import { useSelector } from "react-redux";

const MainLayout = () => {
  const { i18n } = useTranslation('global');
  const [selectedNavigationItem, setSelectedNavigationItem] = useState<NavigationOptionsKey>("card_list");

  const deckId = new URLSearchParams(window.location.search).get("deckId");
  const { deck } = useDeckQuery(deckId || "");


  // Packs
  //const { data, error, isLoading } = useFetchPacks([i18n.language]);
  //const { packStatusList, setPackStatusList } = usePackStatusList();

  // Cards and filters
  const cards = useSelector((state: any) => state.cards.list);
  const { data: packs } = useQuery<Pack[], Error>({ queryKey: ["packs", getLanguage(i18n)] });
  const { data: uniqueFilterOptions } = useQuery<UniqueFilterOptions[], Error>({ queryKey: ["uniqueFilterOptions", getLanguage(i18n)] });
  //const { cards, setCards, uniqueFilterOptions } = useCards();
  const { /*filters, setFilters,*/ selectedFilters, setSelectedFilters, filteredCards } = useFilters(cards || []);

  // Pagination
  // const { paginationStatus, setPaginationStatus, paginatedCards } = usePaginationStatus(filteredCards);

  const { paginationStatus } = usePaginationStatusQuery<MCCard>(["cards", getLanguage(i18n)]);

  //Navigation
  useEffect(() => {
    if (!cards || cards.length == 0) setSelectedNavigationItem("download_manager");
  }, [cards]);


  const navKeyAdditionalTextMap = new Map<NavigationOptionsKey, string>();

  navKeyAdditionalTextMap.set(
    "card_list",
    `${paginationStatus?.visibleFirstElementIndex||0 + 1}-${Math.min(...[paginationStatus?.visibleLastElementIndex||0, filteredCards.length])}/${filteredCards.length}`
  );
  navKeyAdditionalTextMap.set(
    "download_manager",
    `${"Not implemented yet"/*packStatusList.length*/}/${packs?.length || "?"}`
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
          //cards={cards ? cards : []}
          //setCards={setCards}
          //packs={data}
          //packsAreLoading={isLoading}
          //packsError={error}
          //packStatusList={packStatusList}
          //setPackStatusList={setPackStatusList} 
        />
        { 
          deck ? <DeckView deck={deck} /> : null 
        }
        { !deck && (cards ?? []).length > 0 ? <CardsView /> : <Instructions />}
        <CardFiltersView
          selectedFilters={selectedFilters} 
          setSelectedFilters={setSelectedFilters}
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
