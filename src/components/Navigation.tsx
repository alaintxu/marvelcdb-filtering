import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { BsFunnel, BsCloudArrowDown, BsPersonBadge } from 'react-icons/bs';
import { useDispatch, useSelector } from "react-redux";
import { selectNumberOfPackStatusByDownloadStatus } from '../store/ui/packsStatus';
import { RootState } from '../store/configureStore';
import { selectSelectedNavigationOptionKey, NavigationOptionsKey, selectedNavigationOptionKeySet } from '../store/ui/selectedNavigationOptionKey';


type IconDict = {
  [optionKey: string]: ReactNode
}

const navigaitonIcons: IconDict = {
  download_manager: <BsCloudArrowDown />,
  card_list: <BsPersonBadge />,
  filters: <BsFunnel />,
};

const Navigation = () => {
  const { t } = useTranslation('global');
  const dispatch = useDispatch();
  const selectedNavigationOptionKey: NavigationOptionsKey = useSelector(selectSelectedNavigationOptionKey);
  const paginationStatus = useSelector((state: RootState) => state.ui.pagination);
  const numberOfCards: number = useSelector((state: RootState) => state.entities.cards.length);
  const numberOfPacks: number = useSelector((state: RootState) => state.entities.packs.length);
  const downloadedPacks: number = useSelector(selectNumberOfPackStatusByDownloadStatus("downloaded"));

  const getAdditionalText = (key: NavigationOptionsKey): string => {
    let additionalText: string = "";
    switch (key) {
      case "download_manager":
        additionalText = `${downloadedPacks}/${numberOfPacks}`;
        break;
      case "card_list":
        additionalText = `${paginationStatus.visibleFirstElementIndex+1}-${paginationStatus.visibleLastElementIndex}/${numberOfCards}`;
        break;
    }
    return additionalText;
  }

  return (
    <nav id="main-navigation">
      <div className="btn-group d-flex" role="group" aria-label="Navigation">
        {(Object.keys(navigaitonIcons) as NavigationOptionsKey[]).map((navigationOptionKey: NavigationOptionsKey) => {
          const additionalText = getAdditionalText(navigationOptionKey);
          const isActive: boolean = navigationOptionKey === selectedNavigationOptionKey;
          return <button
            key={`navigation-${navigationOptionKey}`}
            type="button"
            className={`
              btn 
              btn-${isActive ? '' : 'outline-'}light 
              ${isActive ? 'active' : ''}
            `}
            onClick={() => {
              dispatch(selectedNavigationOptionKeySet(navigationOptionKey));
            }}>
            {navigaitonIcons[navigationOptionKey]} {t(navigationOptionKey)}
            {additionalText && <>
              &nbsp;
                <span className='badge bg-secondary'>
                  {additionalText}
                </span>
            </>}
          </button>
        })}
      </div>
    </nav>

  )
}

export default Navigation;