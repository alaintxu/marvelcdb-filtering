import { ChangeEvent, useEffect } from 'react';
import { Modal, ModalButton } from '../Modal';
import { useTranslation } from 'react-i18next';
import { BsArrowsCollapse, BsArrowsExpand, BsDownload, BsExclamationTriangle, BsFiletypeJson, BsTranslate, BsTrash } from "react-icons/bs";
import { getLanguage, I18N_LANGS } from "../../i18n";
import { FaFileImport, FaFileExport, FaArrowRotateLeft } from "react-icons/fa6";
import usePacksQuery from '../../hooks/usePacksQuery';
import LoadingSpinner from '../LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { cardsAdded, MCCard, cardPackRemoved, cardsSet, cardPackAdded, selectAllCards } from "../../store/cards";
import { 
  PackStatus, 
  PackStatusDict, 
  packStatusDictSet, 
  packStatusNewPacksAdded, 
  packStatusPackDownloadStatusSet,
  selectIsAnyPackDownloading,
  selectNumberOfPackStatusByDownloadStatus
} from '../../store/packsStatus';
import { Pack, packsDownloading, packsSet, selectAllPacks } from '../../store/packs';
import { showPackListToggled } from '../../store/showPackList';
import PackListItem from './PackListItem';

const DownloadManager = () => {
  const { t, i18n } = useTranslation('global');
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
  const isAnyPackDownloading = useSelector((state: RootState) => selectIsAnyPackDownloading(state));
  const showPackList = useSelector((state: RootState) => state.ui.showPackList);
  const packStatusColor = useSelector((state: RootState) => {
    const packNumber = state.entities.packs.length;
    const packStatusRatio = numberOfDownloadedPacks / packNumber;
    if( isAnyPackDownloading ) return "dark";
    if (packStatusRatio === 1) return "success";
    if (packStatusRatio < 0.25) return "danger";
    return "warning";
  });


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

  const resetApp = () => {
    localStorage.clear();
    window.location.reload();
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
        {/*packsError &&
          <div className="alert alert-danger" role="alert">
            {packsError}
          </div>
        */}
        <div id="pack-data"
          className='d-flex flex-column align-items-center justify-content-center gap-1 mb-4'
        >
          <span>
            <b>{t('downloaded_packs')}</b>
            &nbsp;
            {/*<span className={`badge bg-${getPackStatusColor()}`}>{packStatusList.length}</span>*/}
            <span className={`badge bg-${packStatusColor}`}>{Object.values(packStatusDict).length}</span>
            /
            <span className='badge bg-light text-dark'>{packs?.length || "?"}</span>
          </span>
          <span>
            <span className='badge bg-info'>{cards?.length || "?"}</span>
            &nbsp;
            <b>{t('downloaded_cards')}</b>
          </span>
        </div>
        <hr />
        <h3 className='fs-4 mb-4'>
          <img style={{ filter: "invert(1)", height: "1em", display: "inline", verticalAlign: "center" }} alt='MarvelCDB logo' src='https://marvelcdb.com/icon-192.png' />
          &nbsp;
          {t(`import_marvelcdb`)}
        </h3>
        <div className='px-3'>
          <div className="input-group mb-1">
            <label className="input-group-text" htmlFor="langSelect">
              <BsTranslate />
              &nbsp;
              {t('language')}
            </label>
            <select
              className="form-select"
              key="lang-select"
              id="langSelect"
              onChange={(event) => i18n.changeLanguage(event.target.value)}
              value={getLanguage(i18n)}
            >
              {I18N_LANGS.map((lang) => <option
                key={`lang-select-option-${lang}`}
                title={`lang-select-option-${lang}`}
                value={lang}
              >
                {t('lang.' + lang)}
              </option>
              )}
            </select>
          </div>

          <div className="alert alert-warning text-center" role="alert">
            <BsExclamationTriangle />
            &nbsp;
            {t('language-redownload')}
          </div>
        </div>
        <div className='d-flex justify-content-center px-3 mb-3'>
          <ModalButton className='btn btn-danger me-1' modal_id='modal-select-all'>
            <BsDownload />
            &nbsp;
            {t('download_all')}
          </ModalButton>

          <ModalButton className='btn btn-danger' modal_id='modal-remove-all'>
            <BsTrash />
            &nbsp;
            {t('remove_all')}
          </ModalButton>
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
            <span className={`badge bg-${packStatusColor} ms-1`}>{numberOfDownloadedPacks}/{packs?.length || "?"}</span>
          </button>
          {showPackList && <>
            {/* new */}
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
            <ModalButton className='btn btn-danger' modal_id='modal-reset-app'>
              <FaArrowRotateLeft />
              &nbsp;
              {t('reset_app')}
            </ModalButton>
          </div>
        </div>
        <hr />
      </section >

      < Modal
        title={t(`modal.delete_all_packs.title`)}
        modal_id='modal-remove-all'
        onAccept={() => { 
          dispatch(cardsSet([]));
          dispatch(packStatusDictSet({}));
        }} >
        <div dangerouslySetInnerHTML={{ __html: t('modal.delete_all_packs.content') }} />
      </Modal >
      <Modal
        title={t(`modal.download_all_packs.title`)}
        modal_id='modal-select-all'
        onAccept={async () => {
          dispatch(cardsSet([]));
          dispatch(packStatusDictSet({}));
          if (!packs) return

          const batchSize = 10;
          for (let i = 0; i < packs.length; i += batchSize) {
            const batch = packs.slice(i, i + batchSize);
            await Promise.all(batch.map(async (pack) => downloadPackCards(pack.code)));
          }
          //await Promise.all(packs.map(async (pack) => downloadPackCards(pack.code)));
        }}>
        <div dangerouslySetInnerHTML={{ __html: t('modal.download_all_packs.content') }} />
      </Modal>
      <Modal
        title={t(`modal.reset_app.title`)}
        modal_id='modal-reset-app'
        onAccept={() => {
          resetApp();
        }}>
        <div dangerouslySetInnerHTML={{ __html: t('modal.reset_app.content') }} />
      </Modal>
    </>
  )
}

export default DownloadManager