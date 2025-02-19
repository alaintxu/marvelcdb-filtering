import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { BsFunnel, BsCloudArrowDown, BsPersonBadge } from 'react-icons/bs';
import { useSelector } from "react-redux";
import { PackStatus } from '../store/packsStatus';
import { RootState } from '../store/configureStore';

export type NavigationOptionsKey = "download_manager" | "filters" | "card_list";

type Option = {
  key: NavigationOptionsKey,
  icon: ReactNode,
  additionalText?: string
}

type Props = {
  selected: NavigationOptionsKey,
  active: boolean,
  onClick: (newSelected: NavigationOptionsKey) => void
}

const navigationOptions: Option[] = [
  {
    key: "download_manager",
    icon: <BsCloudArrowDown />,
  },
  {
    key: "card_list",
    icon: <BsPersonBadge />,
  },
  {
    key: "filters",
    icon: <BsFunnel />,
  },
]

const Navigation = ({ selected, active, onClick }: Props) => {
  const { t } = useTranslation('global');

  const paginationStatus = useSelector((state: RootState) => state.ui.pagination);
  const numberOfCards: number = useSelector((state: RootState) => state.entities.cards.length);
  const numberOfPacks: number = useSelector((state: RootState) => state.entities.packs.length);
  const downloadedPacks: number = useSelector((state: RootState) => {
    return Object.values(state.ui.packStatusDict).filter(
      (packStatus: PackStatus) => packStatus.download_status === "downloaded"
    ).length;
  });

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
        {navigationOptions.map((navigationOption) => {
          const additionalText = getAdditionalText(navigationOption.key);
          const isActive: boolean = navigationOption.key == 'card_list' || navigationOption.key == selected;
          return <button
            key={`navigation-${navigationOption.key}`}
            type="button"
            className={`
              btn 
              btn-${isActive ? '' : 'outline-'}light 
              ${isActive ? 'active' : ''}
            `}
            disabled={!active}
            onClick={() => {
              if (onClick) onClick(navigationOption.key)
            }}>
            {navigationOption.icon} {t(navigationOption.key)}
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