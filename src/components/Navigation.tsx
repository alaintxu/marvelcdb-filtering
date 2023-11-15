import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { BsFunnel, BsCloudArrowDown, BsPersonBadge } from 'react-icons/bs';

export type NavigationOptionsKey = "download_manager" | "filters" | "card_list";

type Option = {
  key: NavigationOptionsKey,
  icon: ReactNode
}

type Props = {
  selected: NavigationOptionsKey,
  active: boolean,
  filterNumber?: number,
  onClick: (newSelected: NavigationOptionsKey) => void
}

const Navigation = ({ selected, active, onClick, filterNumber = 0 }: Props) => {
  const { t } = useTranslation('global');


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

  return (
    <nav id="main-navigation">
      <div className="btn-group d-flex" role="group" aria-label="Navigation">
        {navigationOptions.map((navigationOption) => {
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
            {navigationOption.key == "filters" && filterNumber>0 && <>
                &nbsp;
                <span className='badge bg-secondary'>
                  {filterNumber}
                </span>
            </>}
          </button>
        })}
      </div>
    </nav>

  )
}

export default Navigation;