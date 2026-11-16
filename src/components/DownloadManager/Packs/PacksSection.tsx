import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../LoadingSpinner';
import { Pack, selectAllPacks, selectArePacksLoading, selectIsAnyPackDownloading, selectPacksError } from '../../../store/entities/packs';
import { selectShowPackList, showPackListToggled } from '../../../store/ui/other';
import PackListItem from '../Packs/PackListItem';
import LanguageSelect from '../LanguageSelect';
import PacksData from '../Packs/PacksData';
import RemoveAllButton from '../Packs/RemoveAllButton';
import DownloadAllButton from '../Packs/DownloadAllButton';
import { ButtonGroup } from '@astryxdesign/core/ButtonGroup';
import PackStatusCountBadge from './PackStatusCountBadge';
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore';
import IconForConcept from '../../IconForConcept';
import * as stylex from '@stylexjs/stylex';
import { ui } from '../../../styles/ui';

const PacksSection = () => {
  const { t } = useTranslation('global');
    const dispatch = useAppDispatch();

    const packs: Pack[] = useAppSelector(selectAllPacks);
    const arePacksLoading = useAppSelector(selectArePacksLoading);
    const packsError = useAppSelector(selectPacksError);

    const showPackList = useAppSelector(selectShowPackList);
    const isAnyPackDownloading = useAppSelector(selectIsAnyPackDownloading);

  return (
    <section id="pack-section" {...stylex.props(ui.flex, ui.flexColumn, ui.gap3)}>
        <PacksData />
        {packsError && <div {...stylex.props(ui.alert, ui.alertDanger, ui.textCenter)} data-alert="true" role="alert">
          <IconForConcept concept="warning" />
          &nbsp;
          {packsError}
        </div>}
        <h3 {...stylex.props(ui.sectionTitle, ui.fs4, ui.flex, ui.itemsCenter)}>
          <img width={192} height={192} style={{ filter: "invert(1)", height: "1em", width: "auto", display: "inline", verticalAlign: "center" }} alt='MarvelCDB logo' src='https://marvelcdb.com/icon-192.png' />
          &nbsp;
          {t(`import_marvelcdb`)}
        </h3>
        <div {...stylex.props(ui.px3)}>
          <LanguageSelect />

          <div {...stylex.props(ui.alert, ui.alertWarning, ui.textCenter)} data-alert="true" role="alert">
            <IconForConcept concept="warning" />
            &nbsp;
            {t('language-redownload')}
          </div>
        </div>
        <div {...stylex.props(ui.flex, ui.justifyCenter, ui.px3)}>
          <ButtonGroup label={t('import_marvelcdb')}>
            <DownloadAllButton />
            <RemoveAllButton />
          </ButtonGroup>
        </div>
        <div id="packListAccordion" {...stylex.props(ui.px3)}>
          <button
            type='button'
            {...stylex.props(ui.button, ui.buttonSecondary)}
            onClick={() => dispatch(showPackListToggled())}>
            {showPackList ? <IconForConcept concept="collapse" /> : <IconForConcept concept="expand" />}
            &nbsp;
            {t("pack_list")}
            {isAnyPackDownloading && (
              <LoadingSpinner small xstyle={ui.mx2}/>
            )}
            <PackStatusCountBadge />
          </button>
          {showPackList && <>
            {arePacksLoading ?
              <LoadingSpinner /> :
              <div {...stylex.props(ui.flex, ui.justifyCenter)}>
                <div {...stylex.props(ui.buttonGroupVertical, ui.mt3)} role="group" aria-label={t('pack_selection')}>
                  {packs?.map((pack) => <PackListItem key={pack.code} pack={pack} />)}
                </div>
              </div>
            }
          </>}
        </div>
    </section>
  )
}

export default PacksSection