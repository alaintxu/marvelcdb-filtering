import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import * as stylex from '@stylexjs/stylex';
import { colors, fonts, shadows } from '../../styles/tokens.stylex';

import { selectNavigationOptionKey, NavigationOptionsKey, navigationOptionKeySet } from '../../store/ui/other';
import LoadingSpinner from '../LoadingSpinner';
import PackStatusCountBadge from '../DownloadManager/Packs/PackStatusCountBadge';
import CardPaginationNumberBadge from '../Card/CardPaginationNumberBadge';
import IconForConcept from '../IconForConcept';
import { selectCurrentDeck } from '../../store/entities/decks';
import { selectIsAnyPackDownloading } from '../../store/entities/packs';
import NumberOfFiltersBadge from '../Filter/NumberOfFiltersBadge';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import CardStatusCountBadge from '../DownloadManager/Packs/CardStatusCountBadge';


const styles = stylex.create({
  nav: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: colors.ink,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 4,
    borderBlockEndColor: colors.brand,
    boxShadow: shadows.sm,
  },
  navGroup: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    gap: '0.25rem',
  },
  navItem: {
    position: 'relative',
    flex: 1,
    margin: 0,
    padding: '0.5rem',
    borderStyle: 'none',
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: colors.textInverse,
    cursor: 'pointer',
    fontFamily: fonts.display,
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    transitionProperty: 'background-color, color',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease-in-out',
    ':disabled': { cursor: 'not-allowed', opacity: 0.6 },
    '@media (min-width: 480px)': {
      paddingBlock: '0.5rem',
      paddingInline: '1rem',
      fontSize: '0.8rem',
      transform: 'skewX(-20deg)',
    },
    '@media (min-width: 768px)': {
      paddingBlock: '1rem',
      paddingInline: '2rem',
      fontSize: '1rem',
      letterSpacing: '1px',
    },
  },
  navItemActive: { backgroundColor: colors.brand, color: colors.textInverse },
  navItemInactive: { ':hover': { backgroundColor: colors.inkElevated } },
  navItemContent: {
    display: 'inline-block',
    '@media (min-width: 480px)': { transform: 'skewX(20deg)' },
  },
});

type IconDict = {
  [optionKey: string]: ReactNode
}

const navigaitonIcons: IconDict = {
  download_manager: <IconForConcept concept="downloadManager" />,
  card_list: <IconForConcept concept="cardList" />,
  filters: <IconForConcept concept="filter" />,
};

// Panels that the navigation toggles open; the values are the panel element ids.
const navigaitonPanels: Partial<Record<NavigationOptionsKey, string>> = {
  download_manager: "download-manager",
  filters: "filters",
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
    <nav id="main-navigation" data-panel="navigation" {...stylex.props(styles.nav)}>
      <div {...stylex.props(styles.navGroup)} role="group" aria-label={t('navigation')}>
        {(Object.keys(navigaitonIcons) as NavigationOptionsKey[]).map((navigationOptionKey: NavigationOptionsKey) => {
          const additionalText = getAdditionalElement(navigationOptionKey);
          const isActive: boolean = navigationOptionKey === selectedNavigationOptionKey || navigationOptionKey === "card_list";
          const panelId = navigaitonPanels[navigationOptionKey];
          return <button
            key={`navigation-${navigationOptionKey}`}
            type="button"
            aria-controls={panelId}
            aria-expanded={panelId ? navigationOptionKey === selectedNavigationOptionKey : undefined}
            {...stylex.props(styles.navItem, isActive ? styles.navItemActive : styles.navItemInactive)}
            onClick={() => {
              if (navigationOptionKey !== selectedNavigationOptionKey)
                dispatch(navigationOptionKeySet(navigationOptionKey));
              else
                dispatch(navigationOptionKeySet("card_list"));

            }}>
            <span {...stylex.props(styles.navItemContent)}>
              {navigaitonIcons[navigationOptionKey]} {t(navigationOptionKey)}
              {navigationOptionKey === "download_manager" && isAnyPackDownloading && <>
                &nbsp;
                <LoadingSpinner small />
              </>}
              {additionalText && <>
                  <br/>
                  {getAdditionalElement(navigationOptionKey)}
              </>}
            </span>
          </button>
        })}
      </div>
    </nav>

  )
}

export default Navigation;
