import { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BsArrowsCollapse, BsArrowsExpand, BsExclamationTriangle, BsFiletypeJson } from "react-icons/bs";
import { FaFileImport, FaFileExport } from "react-icons/fa6";
import usePacksQuery from '../../hooks/usePacksQuery';
import LoadingSpinner from '../LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { cardsAdded, MCCard, cardPackRemoved, cardPackAdded, selectAllCards } from "../../store/entities/cards";
import { 
  PackStatus, 
  PackStatusDict,
  packStatusNewPacksAdded, 
  packStatusPackDownloadStatusSet,
  selectNumberOfPackStatusByDownloadStatus,
  selectPackStatusBootstrapVariant
} from '../../store/ui/packsStatus';
import { Pack, packsDownloading, packsSet, selectAllPacks } from '../../store/entities/packs';
import { showPackListToggled } from '../../store/ui/showPackList';
import PackListItem from './PackListItem';
import LanguageSelect from './LanguageSelect';
import PacksData from './PacksData';
import RemoveAllButton from './RemoveAllButton';
import DownloadAllButton from './DownloadAllButton';
import ResetAppButton from './ResetAppButton';

const DownloadManager = () => {
  const { t } = useTranslation('global');
  const { 
    packs: downloadedPacks,
    packsError,
    arePacksLoading, 
    arePacksFetching 
  } = usePacksQuery();

  const dispatch = useDispatch();
  const cards: MCCard[] = useSelector(selectAllCards);
  const packs: Pack[] = useSelector(selectAllPacks);
  const packStatusDict: PackStatusDict = useSelector((state: RootState) => state.ui.packStatusDict);
  const numberOfDownloadedPacks: number = useSelector(selectNumberOfPackStatusByDownloadStatus("downloaded"));
  const showPackList = useSelector((state: RootState) => state.ui.showPackList);
  const packStatusVariant = useSelector(selectPackStatusBootstrapVariant);


  useEffect(() => {
    // @ToDo: Is React query needed?
    if(downloadedPacks){
      dispatch(packsSet(downloadedPacks));
      dispatch(packStatusNewPacksAdded(downloadedPacks));
    }
  }, [downloadedPacks]);

  useEffect(() => {
    // @ToDo: Is React query needed?
    if(arePacksFetching || arePacksLoading) dispatch(packsDownloading());
  }, [arePacksFetching, arePacksLoading]);

  const exportCardsToJSONFile = () => {
    const element = document.createElement("a");
    const cards_str = JSON.stringify(cards, null, 2);
    const file = new Blob([cards_str], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "cards.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const importCardsFromJSONFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = e => {
        const result = (e.target as FileReader).result as string;
        const loadedCards: MCCard[] = JSON.parse(result) as MCCard[];
        dispatch(cardsAdded({ newCards: loadedCards }));
      }
    }
  }

  
  const downloadPackCards = async (packCode: string) => {
      cardPackRemoved(packCode);
      dispatch(packStatusPackDownloadStatusSet({packCode: packCode, downloadStatus: "downloading"}));
      dispatch(cardPackRemoved(packCode));
  
      const response = await fetch(t('base_path') + '/api/public/cards/' + packCode + '.json');
  
      if (!response.ok) {
        console.error(`Error fetching pack data (${packCode}`, response.status);
        return;
      }
      const data = await response.json() as MCCard[];
      dispatch(cardPackAdded({ packCode: packCode, newCards: data }));
      dispatch(packStatusPackDownloadStatusSet({packCode: packCode, downloadStatus: "downloaded"}));
    }

  return (
    <>
      <section id="download-manager" className='p-3 bg-dark shadow'>
        {packsError && 
          <div className="alert alert-danger" role="alert">
            {packsError.message}
          </div>
        }
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

        <hr />
        <div className='d-flex flex-column mt-1 gap-1'>
          <h3 className='fs-4 mb-4'>
            <BsFiletypeJson />&nbsp;{t(`import_export`)}
          </h3>
          <div className="mb-3 px-3">
            <label htmlFor="importFileInput" className="form-label">
              <FaFileImport />
              &nbsp;
              {t(`import`)}
            </label>
            <input className="form-control bg-secondary text-light" type="file" id="importFileInput" onChange={importCardsFromJSONFile} />
          </div>
          <div className="mb-3 px-3">
            <button type="button" className='btn btn-secondary' onClick={exportCardsToJSONFile}>
              <FaFileExport />
              &nbsp;
              {t('export')}
            </button>
          </div>
          <div className="mb-3 px-3">
            <ResetAppButton />
          </div>
        </div>
        <hr />
      </section >
    </>
  )
}

export default DownloadManager