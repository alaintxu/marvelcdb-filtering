import { useEffect, useState } from 'react';
import { MCCard } from './Card';
import { Modal, ModalButton } from './Modal';
import { useTranslation } from 'react-i18next';
import { BsDownload } from "react-icons/bs";
import { I18N_LANGS } from "../i18n";
import useFetchPacks from '../hooks/useFetchPacks';

type Props = {
  cards: MCCard[],
  setCards: React.Dispatch<React.SetStateAction<MCCard[]>>
}

type PackStatus = {
  code: string,
  lastDownload: Date,
  numberOfCards: number
}

const DownloadManager = ({ cards, setCards }: Props) => {
  const { t, i18n } = useTranslation('global');
  const { data, error, isLoading } = useFetchPacks([i18n.language]);
  const [packStatusList, setPackStatusList] = useState<PackStatus[]>(JSON.parse(localStorage.getItem('pack_status') || "[]"));
  const [loadingPacks, setLoadingPacks] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("pack_status", JSON.stringify(packStatusList));
  }, [packStatusList]);

  const getPackCards = async (packCode: string) => {
    setLoadingPacks((prevLoadingPacks) => [...prevLoadingPacks, packCode]);  // Set pack loading
    setPackStatusList((prevPackStatusList) => [...prevPackStatusList.filter((packStatus) => packStatus.code !== packCode)]);  // Remove pack status
    setCards((previousCards) => [...previousCards.filter((card) => card.pack_code !== packCode)]);  // Remove cards

    const response = await fetch(t('base_path') + '/api/public/cards/' + packCode + '.json');
    const data = await response.json();

    setCards((previousCards) => {
      // Remove duplicated cards
      const duplicateFilteredData = (data as MCCard[]).filter((card) => !card.duplicate_of_code);
      // sort by date
      const unorderedCards = [...previousCards, ...duplicateFilteredData];
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
    removePackStatus(packCode);
    setCards((prevCards) => prevCards.filter((card) => card.pack_code !== packCode));
  }

  const removePackStatus = (packCode: string) => {
    setPackStatusList((prevState) => prevState.filter((packStatus) => packStatus.code !== packCode));

  }

  const removeAllCards = () => {
    setCards([]);
    setPackStatusList([]);
  }

  const getPackStatusColor = () => {
    const packStatusRatio = packStatusList.length / data.length;
    if (packStatusRatio === 1) return "success";
    if (packStatusRatio < 0.25) return "danger";
    return "warning";
  }

  return (
    <>
      <section id="download-manager" className='p-3 bg-dark shadow'>
        {error &&
          <div className="alert alert-danger" role="alert">
            A simple danger alert—check it out!
          </div>
        }
        <h2 style={{ textAlign: 'center' }}>
          <div>{t('downloaded_packs')}</div>
          <div>
            <span className={`badge bg-${getPackStatusColor()}`}>{packStatusList.length}</span>
            /
            <span className='badge bg-light text-dark'>{data.length}</span>
          </div>
        </h2>
        <h2 style={{ textAlign: 'center' }}>
          <div>{t('downloaded_cards')}</div>
          <div>
            <span className='badge bg-info'>{cards.length}</span>
          </div>
        </h2>
        <div className='d-flex justify-content-center align-items-center flex-column mt-3'>
          <div className="input-group px-3">
            <label className="input-group-text" htmlFor="langSelect">{t('language')}</label>
            <select
              className="form-select"
              id="langSelect"
              onChange={(event) => i18n.changeLanguage(event.target.value)}
              value={I18N_LANGS.includes(i18n.language) ? i18n.language : I18N_LANGS[0]}>
              {I18N_LANGS.map((lang) => <>
                <option
                  value={lang}
                  key={`langSelect+${lang}`}
                >
                  {t('lang.' + lang)}
                </option>
              </>)}
            </select>
          </div>

          <div className="alert alert-warning text-center m-3 mt-1" role="alert">
            {t('language-redownload')}
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <ModalButton className='btn btn-danger me-1' modal_id='modal-select-all'>
            {t('download_all')}
          </ModalButton>

          <ModalButton className='btn btn-danger' modal_id='modal-remove-all'>
            {t('remove_all')}
          </ModalButton>
        </div>
        {!isLoading ?
          <div className='d-flex justify-content-center'>
            <div className="btn-group-vertical mt-3" role="group" aria-label="Basic checkbox toggle button group">
              {data.map(pack => {
                const id = "checkbox-" + pack.code;
                const packStatus = packStatusList.filter((packStatusItem: PackStatus) => packStatusItem.code === pack.code)[0];
                return <>
                  <input
                    type="checkbox"
                    className="btn-check"
                    id={id}
                    checked={packStatus !== undefined}
                    onChange={async (event) => {
                      if (event.currentTarget.checked) await getPackCards(pack.code)
                      else removePack(pack.code)
                    }}
                    key={`download-manager-input-${id}`} />
                  <label
                    className="btn btn-outline-primary d-flex justify-content-between align-items-center"
                    htmlFor={id}
                    key={`download-manager-label-${id}`}>
                    <span style={{ textAlign: "left" }}>{pack.name}</span>

                    {loadingPacks.includes(pack.code) ?
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">{t('loading')}</span>
                      </div> :
                      <>
                        {packStatus && <span className='ms-3 d-flex align-items-center'>
                          <span
                            className='badge bg-light text-dark d-flex flex-column'
                            title={t('title.download_date')}>
                            <span>{new Date(packStatus.lastDownload).toLocaleDateString('es-ES')}</span>
                            <span>{new Date(packStatus.lastDownload).toLocaleTimeString('es-ES')}</span>
                          </span>
                          <span
                            className='badge bg-dark mx-1'
                            title={t('title.number_of_cards')}>
                            {packStatus.numberOfCards}
                          </span>
                          <button className='btn btn-danger' onClick={async () => await getPackCards(pack.code)}>
                            <BsDownload title={t('title.redownload')} />
                          </button>
                        </span>}
                      </>
                    }
                  </label>
                </>;
              })}
            </div>
          </div> :
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        }
      </section>

      {/* @ToDo: modal text from i18n */}
      <Modal
        title={t(`modal.delete_all_packs.title`)}
        modal_id='modal-remove-all'
        onAccept={removeAllCards}>
        <div dangerouslySetInnerHTML={{ __html: t('modal.delete_all_packs.content') }} />
      </Modal>
      <Modal
        title={t(`modal.download_all_packs.title`)}
        modal_id='modal-select-all'
        onAccept={async () => {
          removeAllCards();
          for (const pack of data)
            getPackCards(pack.code);
        }}>
        <div dangerouslySetInnerHTML={{ __html: t('modal.download_all_packs.content') }} />
      </Modal>
    </>
  )
}

export default DownloadManager