import { useTranslation } from 'react-i18next';
import { BsArrowsCollapse, BsArrowsExpand, BsExclamationTriangle } from "react-icons/bs";
import LoadingSpinner from '../../LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/configureStore';
import { MCCard, cardPackRemoved, cardPackAdded, cardsSorted } from "../../../store/entities/cards";
import { 
  PackStatus, 
  PackStatusDict,
  packStatusPackCardsDownloaded, 
  packStatusPackDownloadStatusSet,
  selectNumberOfPackStatusByDownloadStatus,
  selectPackStatusBootstrapVariant
} from '../../../store/ui/packsStatus';
import { Pack, packsDownloading, packsSet, selectAllPacks } from '../../../store/entities/packs';
import { showPackListToggled } from '../../../store/ui/showPackList';
import PackListItem from '../Packs/PackListItem';
import LanguageSelect from '../LanguageSelect';
import PacksData from '../Packs/PacksData';
import RemoveAllButton from '../Packs/RemoveAllButton';
import DownloadAllButton from '../Packs/DownloadAllButton';
import { useEffect } from 'react';

const PacksSection = () => {
    const { t } = useTranslation('global');
    const arePacksLoading = false;
    const arePacksFetching = false;
    const dispatch = useDispatch();
    const packs: Pack[] = useSelector(selectAllPacks);
    const packStatusDict: PackStatusDict = useSelector((state: RootState) => state.ui.packStatusDict);
    const numberOfDownloadedPacks: number = useSelector(selectNumberOfPackStatusByDownloadStatus("downloaded"));
    const showPackList = useSelector((state: RootState) => state.ui.showPackList);
    const packStatusVariant = useSelector(selectPackStatusBootstrapVariant);



    useEffect(() => {
        dispatch({
        type: 'apiCallBegan',
        payload: {
            url: `${t('base_path')}/api/public/packs/`,
            onSuccess: packsSet.type,
            onError: 'apiRequestFailed',
            onStart: packsDownloading.type,
        }
        })
    }, []);
     
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
            <span className={`badge bg-${packStatusVariant} ms-1`}>{numberOfDownloadedPacks}/{packs?.length || "?"}</span>
          </button>
          {showPackList && <>
            {arePacksLoading || arePacksFetching ?
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