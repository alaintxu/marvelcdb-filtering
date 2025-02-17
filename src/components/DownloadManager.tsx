import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Modal, ModalButton } from './Modal';
import { useTranslation } from 'react-i18next';
import { BsArrowsCollapse, BsArrowsExpand, BsDownload, BsExclamationTriangle, BsFiletypeJson, BsStack, BsTranslate, BsTrash } from "react-icons/bs";
import { getLanguage, I18N_LANGS } from "../i18n";
//import { Pack } from '../hooks/useFetchPacks';
import { MCCard } from '../hooks/useCardsQuery';
// import { PackStatus } from '../hooks/usePackStatusList';
import { FaFileImport, FaFileExport, FaArrowRotateLeft } from "react-icons/fa6";
import usePacksQuery, { PackStatus } from '../hooks/usePacksQuery';
import useCardsQuery from '../hooks/useCardsQuery';
import LoadingSpinner from './LoadingSpinner';
import { useDispatch } from 'react-redux';
import { numberOfPacksChanged } from '../store/packs';
import { packCardsAdded, setCards } from '../store/cards';
//import { useQueries, useQuery } from '@tanstack/react-query';

/*
type Props = {
  cards?: MCCard[],
  setCards?: React.Dispatch<React.SetStateAction<MCCard[]>>,
  packs?: Pack[],
  packsError?: string,
  packsAreLoading?: boolean,
  packStatusList?: PackStatus[],
  setPackStatusList: React.Dispatch<React.SetStateAction<PackStatus[]>>,
}
*/


const DownloadManager = () => {
  const { t, i18n } = useTranslation('global');
  const { 
    packs,
    packsError,
    arePacksLoading, 
    arePacksFetching 
  } = usePacksQuery();
  

  const { 
    cards,
    packStatusDict,
    downloadedPacks,
    addPackCardsMutation, 
    removePackCardsMutation, 
    removeAllCardsMutation,
    addMultiplePackCardsMutation,
    addCardsMutation
  } = useCardsQuery();


  const dispatch = useDispatch();

  // const numberOfDownloadedPacks = useSelector(
    
  //   /*
  //   import { createSelector } from '@reduxjs/toolkit';
  //   ...
  //   createSelector(
  //     (state: any) => state.entities.packStatusList,
  //     (packStatusList) => packStatusList.list.filter(
  //       (packStatus: any) => packStatus.downloaded
  //     ).length
  //   )*/
  //   getNumberOfDownloadedPacks
  // );

  useEffect(() => {
    dispatch(numberOfPacksChanged(packs?.length || 0));
  }, [packs]);

  useEffect(() => {
    dispatch(setCards(cards || []));
  }, [cards]);

  const packsInCardsQuery: Set<string> = useMemo(() => {
    const packCodesSet = new Set<string>();
    if(cards) 
      cards.forEach((card) => packCodesSet.add(card.pack_code));
    return packCodesSet;
  }, [cards]);


  //const [loadingPacks, setLoadingPacks] = useState<string[]>([]);
  const [showPackList, setShowPackList] = useState<boolean>(!cards || cards.length === 0);

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
        addCardsMutation(loadedCards);
        //setCards((prev) => [...prev, ...loadedCards]);

        // ToDo: update pack status list from cards
        //const newPackStatusList: PackStatus[] = getPackStatusListFromCars(loadedCards);
        //setPackStatusList([...newPackStatusList])
      }
    }
  }

  /*const getPackStatusListFromCars = (cards: MCCard[]): PackStatus[] => {
    const newPackStatusList: PackStatus[] = [...packStatusList.map(
      (packStatus) => { return { ...packStatus } }
    )];

    for (const card of cards) {
      const packStatus: PackStatus | undefined = newPackStatusList.find(
        (packStatus) => packStatus.code == card.pack_code
      );
      if (packStatus) {
        packStatus.numberOfCards += 1;
      } else {
        newPackStatusList.push({
          code: card.pack_code,
          lastDownload: new Date(),
          numberOfCards: 1,
        });
      }
    }
    return newPackStatusList;
  }*/


  /*const downloadPackCards = async (packCode: string) => {
    setLoadingPacks((prevLoadingPacks) => [...prevLoadingPacks, packCode]);  // Set pack loading
    setPackStatusList((prevPackStatusList) => [...prevPackStatusList.filter((packStatus) => packStatus.code !== packCode)]);  // Remove pack status
    setCards((previousCards) => [...previousCards.filter((card) => card.pack_code !== packCode)]);  // Remove cards

    const response = await fetch(t('base_path') + '/api/public/cards/' + packCode + '.json');
    const data = await response.json();

    setCards((previousCards) => {
      // Remove duplicated cards
      //const duplicateFilteredData = (data as MCCard[]).filter((card) => !card.duplicate_of_code);
      // sort by date
      //const unorderedCards = [...previousCards, ...duplicateFilteredData];
      const unorderedCards = [...previousCards, ...(data as MCCard[])];
      const orderedCards = unorderedCards.sort((aCard, bCard) => aCard.code.localeCompare(bCard.code));
      return orderedCards;
    });
    setPackStatusList((prevPackStatusList) => [...prevPackStatusList, {
      code: packCode,
      lastDownload: new Date(),
      numberOfCards: data.length,
    }])
    setLoadingPacks((prevLoadingPacks) => prevLoadingPacks.filter((code) => code !== packCode));
  }

  const removePack = (packCode: string) => {
    removePackCardsMutation(packCode);
    removePackStatus(packCode);
    setCards((prevCards) => prevCards.filter((card) => card.pack_code !== packCode));
  }

  const removePackStatus = (packCode: string) => {
    setPackStatusList((prevState) => prevState.filter((packStatus) => packStatus.code !== packCode));

  }*/

  // const removeAllCards = () => {
  //   setCards([]);
  //   setPackStatusList([]);
  // }

  /*const getPackStatusColor = () => {
    const packStatusRatio = packStatusList.length / packs.length;
    if (packStatusRatio === 1) return "success";
    if (packStatusRatio < 0.25) return "danger";
    return "warning";
  }*/

  const getPackStatusColor = () => {
    const packNumber = packs?.length || 0;
    const packStatusRatio = downloadedPacks||0 / packNumber;
    if( arePacksLoading || arePacksFetching ) return "warning";
    if (packStatusRatio === 1) return "success";
    if (packStatusRatio < 0.25) return "danger";
    return "warning";
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
            <span className={`badge bg-${getPackStatusColor()}`}>{packsInCardsQuery.size}</span>
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
            className="btn btn-secondary"
            onClick={() => setShowPackList((prev) => !prev)}>
            {showPackList ? <BsArrowsCollapse /> : <BsArrowsExpand />}
            &nbsp;
            {t("pack_list")}
            <span className={`badge bg-${getPackStatusColor()} ms-1`}>{packsInCardsQuery.size}/{packs?.length || "?"}</span>
          </button>
          {showPackList && <>
            {/* new */}
            {arePacksLoading || arePacksFetching ?
              <LoadingSpinner /> :
              <div className='d-flex justify-content-center'>
                <div className="btn-group-vertical mt-3" role="group" aria-label="Basic checkbox toggle button group">
                  {packs?.map((pack, index) => {;
                    const id = "download-manager-pack-" + index;
                    return <React.Fragment key={id}>
                      <input
                        type="checkbox"
                        className="btn-check"
                        id={id}
                        checked={packsInCardsQuery.has(pack.code)}
                        onChange={async (event) => {
                          if (event.currentTarget.checked) await addPackCardsMutation(pack.code);
                          else await removePackCardsMutation(pack.code);
                        }}/>
                      <label
                        className="btn btn-outline-primary d-flex justify-content-between align-items-center"
                        htmlFor={id}>
                        <span style={{ textAlign: "left" }}>
                          <BsStack />
                          &nbsp;
                          {pack.name}
                        </span>
                        <span className='ms-3 d-flex align-items-center' key={`${id}-pack-status`}>
                        {/*packStatus &&
                          <span
                            className='badge bg-dark mx-1'
                            title={t('title.number_of_cards')}>
                            {packStatus.numberOfCards}
                          </span>*/}
                          <button className='btn btn-danger' onClick={async () => {
                            await removePackCardsMutation(pack.code);
                            await addPackCardsMutation(pack.code)
                          }}>
                            <BsDownload title={t('title.redownload')} />
                          </button>
                        </span>
                      </label>
                    </React.Fragment>;
                  })}
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
            <button className='btn btn-secondary' onClick={exportCardsToJSONFile}>
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
          //removeAllCards(); 
          removeAllCardsMutation();
        }} >
        <div dangerouslySetInnerHTML={{ __html: t('modal.delete_all_packs.content') }} />
      </Modal >
      <Modal
        title={t(`modal.download_all_packs.title`)}
        modal_id='modal-select-all'
        onAccept={async () => {
          //removeAllCards();
          removeAllCardsMutation();
          if (packs) addMultiplePackCardsMutation(packs.map((pack) => pack.code));
          // for (const pack of packs){
          //   downloadPackCards(pack.code);
          // }

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