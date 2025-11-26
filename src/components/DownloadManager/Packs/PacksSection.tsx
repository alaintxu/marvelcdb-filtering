import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../LoadingSpinner';
import { loadPacks, Pack, selectAllPacks, selectArePacksLoading, selectIsAnyPackDownloading, selectPacksError } from '../../../store/entities/packs';
import { selectShowPackList, showPackListToggled } from '../../../store/ui/other';
import PackListItem from '../Packs/PackListItem';
import LanguageSelect from '../LanguageSelect';
import PacksData from '../Packs/PacksData';
import RemoveAllButton from '../Packs/RemoveAllButton';
import DownloadAllButton from '../Packs/DownloadAllButton';
import { useEffect } from 'react';
import PackStatusCountBadge from './PackStatusCountBadge';
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore';
import IconForConcept from '../../IconForConcept';

const PacksSection = () => {
    const { t, i18n } = useTranslation('global');
    const dispatch = useAppDispatch();

    const packs: Pack[] = useAppSelector(selectAllPacks);
    const arePacksLoading = useAppSelector(selectArePacksLoading);
    const packsError = useAppSelector(selectPacksError);

    const showPackList = useAppSelector(selectShowPackList);
    const isAnyPackDownloading = useAppSelector(selectIsAnyPackDownloading);



    useEffect(() => {
      dispatch<any>(loadPacks());
    }, [i18n.language, dispatch]);
  return (
    <section id="pack-section">
        <PacksData />
        {packsError && <div className="alert alert-danger text-center" role="alert">
          <IconForConcept concept="warning" />
          &nbsp;
          {packsError}
        </div>}
        <hr />
        <h3 className='fs-4 mb-4'>
          <img style={{ filter: "invert(1)", height: "1em", display: "inline", verticalAlign: "center" }} alt='MarvelCDB logo' src='https://marvelcdb.com/icon-192.png' />
          &nbsp;
          {t(`import_marvelcdb`)}
        </h3>
        <div className='px-3'>
          <LanguageSelect />

          <div className="alert alert-warning text-center" role="alert">
            <IconForConcept concept="warning" />
            &nbsp;
            {t('language-redownload')}
          </div>
        </div>
        <div className='d-flex justify-content-center px-3 mb-3'>
          <DownloadAllButton />
          <RemoveAllButton />
        </div>
        <div id="packListAccordion" className='px-3 mb-3'>
          <button
            type='button'
            className="btn btn-secondary"
            onClick={() => dispatch(showPackListToggled())}>
            {showPackList ? <IconForConcept concept="collapse" /> : <IconForConcept concept="expand" />}
            &nbsp;
            {t("pack_list")}
            {isAnyPackDownloading && (
              <LoadingSpinner small className='mx-2'/>
            )}
            <PackStatusCountBadge />
          </button>
          {showPackList && <>
            {arePacksLoading ?
              <LoadingSpinner /> :
              <div className='d-flex justify-content-center'>
                <div className="btn-group-vertical mt-3" role="group" aria-label="Basic checkbox toggle button group">
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