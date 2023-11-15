import { useEffect, useState } from 'react';
import usePacks from '../hooks/usePacks';
import { MCCard } from './Card';
import { Modal, ModalButton } from './Modal';
import { useTranslation } from 'react-i18next';
import { BsDownload } from "react-icons/bs";

type Props = {
  cards: MCCard[],
  setCards: React.Dispatch<React.SetStateAction<MCCard[]>>
}

type PackStatus = {
  code: string,
  lastDownload: Date,
  numberOfCards: number
}

const langs = ['en', 'es', 'fr', 'de', 'it', 'ko'];

const DownloadManager = ({ cards, setCards }: Props) => {
  const { t, i18n } = useTranslation('global');
  const { packs, error } = usePacks();
  const [packStatusList, setPackStatusList] = useState<PackStatus[]>(JSON.parse(localStorage.getItem('pack_status') || "[]"));
  const [loadingPacks, setLoadingPacks] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("pack_status", JSON.stringify(packStatusList));
  }, [packStatusList]);

  if (error) return (<p>{error}</p>);

  const getPackCards = async (packCode: string) => {
    console.debug("getCards", packCode);
    setLoadingPacks((prevLoadingPacks) => [...prevLoadingPacks, packCode]);  // Set pack loading
    setPackStatusList((prevPackStatusList) => [...prevPackStatusList.filter((packStatus) => packStatus.code !== packCode)]);  // Remove pack status
    setCards((previousCards) => [...previousCards.filter((card) => card.pack_code !== packCode)]);  // Remove cards

    const response = await fetch(t('base_path') + '/api/public/cards/' + packCode + '.json');
    const data = await response.json();

    console.debug("retrieved data", data);

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
    console.debug("removePackStatus", packCode);
    setPackStatusList((prevState) => prevState.filter((packStatus) => packStatus.code !== packCode));

  }

  const removeAllCards = () => {
    console.debug("removeAllCards");
    setCards([]);
    setPackStatusList([]);
  }

  const getPackStatusColor = () => {
    const packStatusRatio = packStatusList.length / packs.length;
    if (packStatusRatio === 1) return "success";
    if (packStatusRatio < 0.25) return "danger";
    return "warning";
  }

  return (
    <>
      <section id="download-manager" className='p-3 bg-dark shadow'>
        <h2 style={{ textAlign: 'center' }}>
          <div>{t('downloaded_packs')}</div>
          <div>
            <span className={`badge bg-${getPackStatusColor()}`}>{packStatusList.length}</span>
            /
            <span className='badge bg-light text-dark'>{packs.length}</span>
          </div>
        </h2>
        <h2 style={{ textAlign: 'center' }}>
          <div>{t('downloaded_cards')}</div>
          <div>
            <span className='badge bg-info'>{cards.length}</span>
          </div>
        </h2>
        <div className='d-flex justify-content-center'>
          <div className="input-group mb-3" style={{ width: '400px', maxWidth: "90%" }}>
            <label className="input-group-text" htmlFor="langSelect">{t('language')}</label>
            <select
              className="form-select"
              id="langSelect"
              onChange={(event) => i18n.changeLanguage(event.target.value)}>
              {langs.map((lang) => <>
                <option value={lang} selected={i18n.language == lang}>{t('lang.' + lang)}</option>
              </>)}
            </select>
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <ModalButton className='btn btn-danger me-1' modal_id='modal-select-all'>
            {t('download_all')}
          </ModalButton>

          <ModalButton className='btn btn-danger me-1' modal_id='modal-remove-all'>
            {t('remove_all')}
          </ModalButton>
        </div>
        <div className='d-flex justify-content-center py-4'>
          <div className="btn-group-vertical mt-3" role="group" aria-label="Basic checkbox toggle button group">
            {packs.map(pack => {
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
                  }} />
                <label className="btn btn-outline-primary d-flex justify-content-between align-items-center" htmlFor={id}>
                  <span style={{ textAlign: "left" }}>{pack.name}</span>

                  {loadingPacks.includes(pack.code) ?
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">{t('loading')}</span>
                    </div> :
                    <>
                      {packStatus && <span className='ms-3 d-flex align-items-center'>
                        <span
                          className='badge bg-light text-dark d-flex flex-column'
                          title='Fecha de descarga'>
                          <span>{new Date(packStatus.lastDownload).toLocaleDateString('es-ES')}</span>
                          <span>{new Date(packStatus.lastDownload).toLocaleTimeString('es-ES')}</span>
                        </span>
                        <span
                          className='badge bg-dark mx-1'
                          title='Número de cartas'>
                          {packStatus.numberOfCards}
                        </span>
                        <button className='btn btn-danger' onClick={async () => await getPackCards(pack.code)}>
                          <BsDownload title={t('re-download')} />
                        </button>
                      </span>}
                    </>
                  }
                </label>
              </>;
            })}
          </div>
        </div>
      </section>

      {/* @ToDo: modal text from i18n */}
      <Modal
        title="Borrar todos los packs"
        modal_id='modal-remove-all'
        onAccept={removeAllCards}>
        <p>¿Estas seguro de que quieres <b>borrar todos los packs</b>?</p>
        <p>Esto borrará <b>todas las cartas</b> de tu navegador.</p>
      </Modal>
      <Modal title="Descargar todos los packs" modal_id='modal-select-all' onAccept={async () => {
        removeAllCards();
        for (const pack of packs) getPackCards(pack.code);
        console.log("packStatusList", packStatusList);
      }}>
        <p>¿Estas seguro de que quieres <b>descargar todos los packs</b>?</p>
        <p>Esto descargara <b>todas las cartas</b> de la web de <a href='https;//es.marvelcdb.com'>MarvelCDB</a> a tu navegador.</p>
        <p>Ejecuta esta acción <b>lo menos podible</b> para no saturar la web.</p>
      </Modal>
    </>
  )
}

export default DownloadManager