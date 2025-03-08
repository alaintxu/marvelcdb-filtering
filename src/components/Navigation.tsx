import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { selectNavigationOptionKey, NavigationOptionsKey, navigationOptionKeySet } from '../store/ui/other';
import LoadingSpinner from './LoadingSpinner';
import PackStatusCountBadge from './DownloadManager/Packs/PackStatusCountBadge';
import CardPaginationNumberBadge from './Card/CardPaginationNumberBadge';
import IconForConcept from './IconForConcept';
import { selectCurrentDeck } from '../store/entities/decks';
import { selectIsAnyPackDownloading } from '../store/entities/packs';
import NumberOfFiltersBadge from './Filter/NumberOfFiltersBadge';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import CardStatusCountBadge from './DownloadManager/Packs/CardStatusCountBadge';


type IconDict = {
  [optionKey: string]: ReactNode
}

const navigaitonIcons: IconDict = {
  download_manager: <IconForConcept concept="downloadManager" />,
  card_list: <IconForConcept concept="cardList" />,
  filters: <IconForConcept concept="filter" />,
};

const Navigation = () => {
  const { t } = useTranslation('global');
  const dispatch = useAppDispatch();
  const selectedNavigationOptionKey: NavigationOptionsKey = useAppSelector(selectNavigationOptionKey);
  const isAnyPackDownloading: boolean = useAppSelector(selectIsAnyPackDownloading);
  const currentDeck = useAppSelector(selectCurrentDeck);

  const getAdditionalElement = (key: NavigationOptionsKey): ReactNode => {
    let additionalElement: ReactNode;
    switch (key) {
      case "download_manager":
        additionalElement = <><PackStatusCountBadge /><CardStatusCountBadge /></>;
        break;
      case "card_list":
        additionalElement = !currentDeck ? <><CardPaginationNumberBadge /></> : <></>;
        break;
      case "filters":
        additionalElement = <NumberOfFiltersBadge />;
        break;
    }
    return additionalElement;
  }
  

  return (
    <nav id="main-navigation">
      <div className="btn-group d-flex" role="group" aria-label="Navigation">
        {(Object.keys(navigaitonIcons) as NavigationOptionsKey[]).map((navigationOptionKey: NavigationOptionsKey) => {
          const additionalText = getAdditionalElement(navigationOptionKey);
          const isActive: boolean = navigationOptionKey === selectedNavigationOptionKey || navigationOptionKey === "card_list";
          return <button
            key={`navigation-${navigationOptionKey}`}
            type="button"
            className={`
              main-navigation-item
              btn 
              btn-${isActive ? '' : 'outline-'}light 
              ${isActive ? 'active' : ''}
            `}
            onClick={() => {
              if (navigationOptionKey !== selectedNavigationOptionKey)
                dispatch(navigationOptionKeySet(navigationOptionKey));
              else
                dispatch(navigationOptionKeySet("card_list"));

            }}>
            {navigaitonIcons[navigationOptionKey]} {t(navigationOptionKey)}
            {navigationOptionKey === "download_manager" && isAnyPackDownloading && <>
              &nbsp;
              <LoadingSpinner small />
            </>}
            {additionalText && <>
                <br/>
                {getAdditionalElement(navigationOptionKey)}
            </>}
          </button>
        })}
      </div>
    </nav>

  )
}

export default Navigation;