import { useTranslation } from 'react-i18next';
import { BsArrowsCollapse, BsArrowsExpand, BsExclamationTriangle } from "react-icons/bs";
import LoadingSpinner from '../../LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { MCCard, cardPackRemoved, cardPackAdded, cardsSorted } from "../../../store/entities/cards";
import { 
  PackStatus, 
  PackStatusDict,
  packStatusPackCardsDownloaded, 
  packStatusPackDownloadStatusSet,
  selectPackStatusDict,
} from '../../../store/ui/packsStatus';
import { loadPacks, Pack, selectAllPacks, selectArePacksLoading, selectPacksError } from '../../../store/entities/packs';
import { selectShowPackList, showPackListToggled } from '../../../store/ui/other';
import PackListItem from '../Packs/PackListItem';
import LanguageSelect from '../LanguageSelect';
import PacksData from '../Packs/PacksData';
import RemoveAllButton from '../Packs/RemoveAllButton';
import DownloadAllButton from '../Packs/DownloadAllButton';
import { useEffect } from 'react';
import PackStatusCountBadge from './PackStatusCountBadge';

const PacksSection = () => {
    const { t, i18n } = useTranslation('global');
    const dispatch = useDispatch();

    const packs: Pack[] = useSelector(selectAllPacks);
    const arePacksLoading = useSelector(selectArePacksLoading);
    const packsError = useSelector(selectPacksError);

    const packStatusDict: PackStatusDict = useSelector(selectPackStatusDict);
    const showPackList = useSelector(selectShowPackList);



    useEffect(() => {
        dispatch(loadPacks());
    }, [i18n.language]);
     
    const downloadPackCards = async (packCode: string) => {
        // @ToDo: Change to redux api.ts middleware
        cardPackRemoved(packCode);
        dispatch(cardPackRemoved(packCode));
        dispatch(packStatusPackDownloadStatusSet({packCode: packCode, downloadStatus: "downloading"}));

        const response = await fetch(t('base_path') + '/api/public/cards/' + packCode + '.json');

        if (!response.ok) {
        console.error(`Error fetching pack data (${packCode}`, response.status);
        return;
        }
        const data = await response.json() as MCCard[];
        dispatch(cardPackAdded({ packCode: packCode, newCards: data }));
        dispatch(packStatusPackCardsDownloaded({packCode: packCode, numberOfCards: data.length}));
        dispatch(cardsSorted("code"));
    }
  return (
    <section id="pack-section">
        <PacksData />
        {packsError && <div className="alert alert-danger text-center" role="alert">
          <BsExclamationTriangle />
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
            <BsExclamationTriangle />
            &nbsp;
            {t('language-redownload')}
          </div>
        </div>
        <div className='d-flex justify-content-center px-3 mb-3'>
          <DownloadAllButton downloadPackCards={downloadPackCards}/>
          <RemoveAllButton />
        </div>
        <div id="packListAccordion" className='px-3 mb-3'>
          <button
            type='button'
            className="btn btn-secondary"
            onClick={() => dispatch(showPackListToggled())}>
            {showPackList ? <BsArrowsCollapse /> : <BsArrowsExpand />}
            &nbsp;
            {t("pack_list")}
            {Object.entries(packStatusDict).some(
              ([_, packStatus]: [string, PackStatus]) => packStatus.download_status === "downloading") && <>
              <LoadingSpinner small className='mx-2'/>
            </>}
            <PackStatusCountBadge />
          </button>
          {showPackList && <>
            {arePacksLoading ?
              <LoadingSpinner /> :
              <div className='d-flex justify-content-center'>
                <div className="btn-group-vertical mt-3" role="group" aria-label="Basic checkbox toggle button group">
                  {packs?.map((pack) => <PackListItem key={pack.code} pack={pack} downloadPackCards={downloadPackCards} />)}
                </div>
              </div>
            }
          </>}
        </div>
    </section>
  )
}

export default PacksSection