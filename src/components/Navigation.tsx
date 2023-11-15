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
  onClick: (newSelected: NavigationOptionsKey) => void
}

const Navigation = ({ selected, active, onClick }: Props) => {
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
          const isCurrent: boolean = navigationOption.key == selected;
          return <button
            key={navigationOption.key}
            type="button"
            className={`btn btn-${isCurrent ? '' : 'outline-'}secondary ${isCurrent ? 'active' : ''}`}
            disabled={!active}
            onClick={() => {
              if (onClick) onClick(navigationOption.key)
            }}>
            {navigationOption.icon} {t(navigationOption.key)}
          </button>
        })}
      </div>
    </nav>

  )
}

export default Navigation;