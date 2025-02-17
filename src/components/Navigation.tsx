import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { BsFunnel, BsCloudArrowDown, BsPersonBadge } from 'react-icons/bs';
import { MCCard } from '../hooks/useCardsQuery';
import { useQuery } from '@tanstack/react-query';
import { getLanguage } from '../i18n';
import { PaginationStatus } from '../hooks/usePaginationStatusQuery';
import { useSelector } from "react-redux";

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
  const { t, i18n } = useTranslation('global');
  const { data: downloaded_packs } = useQuery<number, Error>({ queryKey: ["downloaded_packs", getLanguage(i18n)] });
  const { data: cards } = useQuery<MCCard[], Error>({ queryKey: ["cards", getLanguage(i18n)] });
  const { data: paginationStatus } = useQuery<PaginationStatus, Error>({queryKey: ["cards", getLanguage(i18n), "pagination_status"]});

  const numberOfPacks = useSelector((state: any) => state.numberOfPacks);

  const getAdditionalText = (key: NavigationOptionsKey): string => {
    let additionalText: string = "";
    switch (key) {
      case "download_manager":
        additionalText = downloaded_packs&&numberOfPacks ? `${downloaded_packs}/${numberOfPacks}` : t('loading');
        break;
      case "card_list":
        additionalText = paginationStatus&&cards ? `${paginationStatus.visibleFirstElementIndex+1}-${paginationStatus.visibleLastElementIndex}/${cards.length}` : t('loading');
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