import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

//import { BsFunnel, BsCloudArrowDown, BsPersonBadge } from 'react-icons/bs';
import { useDispatch, useSelector } from "react-redux";
import { selectIsAnyPackDownloading } from '../store/ui/packsStatus';
import { selectSelectedNavigationOptionKey, NavigationOptionsKey, selectedNavigationOptionKeySet } from '../store/ui/selectedNavigationOptionKey';
import LoadingSpinner from './LoadingSpinner';
import PackStatusCountBadge from './DownloadManager/Packs/PackStatusCountBadge';
import CardPaginationNumberBadge from './Card/CardPaginationNumberBadge';
import IconForConcept from './IconForConcept';


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
  const dispatch = useDispatch();
  const selectedNavigationOptionKey: NavigationOptionsKey = useSelector(selectSelectedNavigationOptionKey);
  const isAnyPackDownloading: boolean = useSelector(selectIsAnyPackDownloading);

  const getAdditionalElement = (key: NavigationOptionsKey): ReactNode => {
    let additionalElement: ReactNode;
    switch (key) {
      case "download_manager":
        additionalElement = <PackStatusCountBadge />;
        break;
      case "card_list":
        additionalElement = <CardPaginationNumberBadge />;
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
              btn 
              btn-${isActive ? '' : 'outline-'}light 
              ${isActive ? 'active' : ''}
            `}
            onClick={() => {
              if (navigationOptionKey !== selectedNavigationOptionKey)
                dispatch(selectedNavigationOptionKeySet(navigationOptionKey));
              else
                dispatch(selectedNavigationOptionKeySet("card_list"));

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