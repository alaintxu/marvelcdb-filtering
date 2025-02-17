import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Instructions from "./Instructions";
import CardFiltersView, { UniqueFilterOptions } from "./Filter/CardFiltersView";
import Navigation, { NavigationOptionsKey } from "./Navigation";
import CardsView from "./Card/CardsView";
import DownloadManager from "./DownloadManager";
import { useQuery } from "@tanstack/react-query";
import { getLanguage } from "../i18n";
import useDeckQuery from "../hooks/useDeckQuery";
import DeckView from "./Deck/DeckView";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import { MCCard } from "../store/cards";

const MainLayout = () => {
  const { i18n } = useTranslation('global');
  const [selectedNavigationItem, setSelectedNavigationItem] = useState<NavigationOptionsKey>("card_list");

  const deckId = new URLSearchParams(window.location.search).get("deckId");
  const { deck } = useDeckQuery(deckId || "");


  // Packs
  //const { data, error, isLoading } = useFetchPacks([i18n.language]);
  //const { packStatusList, setPackStatusList } = usePackStatusList();

  // Cards and filters
  const cards: MCCard[] = useSelector((state: RootState) => state.cards || []);
  //const { data: packs } = useQuery<Pack[], Error>({ queryKey: ["packs", getLanguage(i18n)] });
  const { data: uniqueFilterOptions } = useQuery<UniqueFilterOptions[], Error>({ queryKey: ["uniqueFilterOptions", getLanguage(i18n)] });
  //const { cards, setCards, uniqueFilterOptions } = useCards();
  //const { /*filters, setFilters,*/ selectedFilters, setSelectedFilters, filteredCards } = useFilters(cards || []);

  // Pagination
  // const { paginationStatus, setPaginationStatus, paginatedCards } = usePaginationStatus(filteredCards);
  const numberOfPacks:number = useSelector((state: RootState) => state.packs.numberOfPacks);
  const pagination = useSelector((state: RootState) => state.pagination);
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
    `${"Not implemented yet"/*packStatusList.length*/}/${numberOfPacks}`
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
