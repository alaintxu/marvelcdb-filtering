import { ReactNode } from 'react';

import { BsFunnel, BsCloudArrowDown, BsPersonBadge } from 'react-icons/bs';

export type NavigationOptionsKey = "download_manager" | "filters" | "card_list";

type Option = {
  key: NavigationOptionsKey,
  name: string,
  icon: ReactNode
}

const navigationOptions: Option[] = [
  {
    key: "download_manager",
    name: "Gestor de descargas",
    icon: <BsCloudArrowDown />,
  },
  {
    key: "card_list",
    name: "Lista de cartas",
    icon: <BsPersonBadge />,
  },
  {
    key: "filters",
    name: "Filtros",
    icon: <BsFunnel />,
  },
]

type Props = {
  selected: NavigationOptionsKey,
  active: boolean,
  onClick: (newSelected: NavigationOptionsKey) => void
}

const groupStyle = {
  width: '100%',
  backgroundColor: "black"
}

const Navigation = ({ selected, active, onClick }: Props) => {

  return (
    <nav style={groupStyle}>
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
            {navigationOption.icon} {navigationOption.name}
          </button>
        })}
      </div>
    </nav>

  )
}

export default Navigation;