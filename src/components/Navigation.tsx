import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

//import { BsFunnel, BsCloudArrowDown, BsPersonBadge } from 'react-icons/bs';
import { useDispatch, useSelector } from "react-redux";
import { selectNavigationOptionKey, NavigationOptionsKey, navigationOptionKeySet } from '../store/ui/other';
import LoadingSpinner from './LoadingSpinner';
import PackStatusCountBadge from './DownloadManager/Packs/PackStatusCountBadge';
import CardPaginationNumberBadge from './Card/CardPaginationNumberBadge';
import IconForConcept from './IconForConcept';
import { selectCurrentDeck } from '../store/entities/decks';
import { AppDispatch } from '../store/configureStore';
import { selectIsAnyPackDownloading } from '../store/entities/packs';


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
  const dispatch = useDispatch<AppDispatch>();
  const selectedNavigationOptionKey: NavigationOptionsKey = useSelector(selectNavigationOptionKey);
  const isAnyPackDownloading: boolean = useSelector(selectIsAnyPackDownloading);
  const currentDeck = useSelector(selectCurrentDeck);

  const getAdditionalElement = (key: NavigationOptionsKey): ReactNode => {
    let additionalElement: ReactNode;
    switch (key) {
      case "download_manager":
        additionalElement = <PackStatusCountBadge />;
        break;
      case "card_list":
        additionalElement = !currentDeck ? <CardPaginationNumberBadge /> : <></>;
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
                &nbsp;
                {getAdditionalElement(navigationOptionKey)}
            </>}
          </button>
        })}
      </div>
    </nav>

  )
}

export default Navigation;