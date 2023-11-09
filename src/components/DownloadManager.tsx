import { useState } from 'react';
import usePacks from '../hooks/usePacks';
import { useLocalStorage } from 'usehooks-ts';
import { MCCard } from './Card';
import { Modal, ModalButton } from './Modal';

type PackStatus = {
  code: string,
  lastDownload: Date,
  numberOfCards: number
}

const DownloadManager = () => {
  const { packs, error } = usePacks();
  const [cards, setCards] = useLocalStorage<MCCard[]>("cards", []);
  const [packStatusList, setPackStatusList] = useLocalStorage<PackStatus[]>("packStatusList", []);
  const [loadingPacks, setLoadingPacks] = useState<string[]>([]);

  if (error) return (<p>{error}</p>);

  const getPackCards = async (packCode: string) => {
    console.debug("getCards", packCode);
    setLoadingPacks((prevState) => [...prevState, packCode]);

    const response = await fetch('https://es.marvelcdb.com/api/public/cards/' + packCode + '.json');
    const data = await response.json();

    console.debug("retrieved data", data);

    setCards((previousCards) => [...previousCards.filter((card) => card.pack_code !== packCode), ...data]);

    setLoadingPacks((prevState) => prevState.filter((code) => code !== packCode));

    updatePackStatus({
      code: packCode,
      lastDownload: new Date(),
      numberOfCards: data.length,
    })

  }

  const updatePackStatus = (newPackStatus: PackStatus) => {
    console.debug("updatePackStatus", newPackStatus);
    removePackStatus(newPackStatus.code);
    setPackStatusList((prevState) => [
      ...prevState,
      newPackStatus
    ]);
  }

  const removePack = (packCode: string) => {
    removePackStatus(packCode);
    setCards(cards.filter((card) => card.pack_code !== packCode));
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
    <section>
      <h2>
        Packs descargados:
        {" "}
        <span className={`badge bg-${getPackStatusColor()}`}>{packStatusList.length}</span>
        /
        <span className='badge bg-light text-dark'>{packs.length}</span>
      </h2>
      <h3>
        Cartas descargadas
        {" "}
        <span className='badge bg-info'>{cards.length}</span>
      </h3>
      <div>
        <ModalButton className='btn btn-danger me-1' modal_id='modal-select-all'>
          Descargar todos
        </ModalButton>
        <Modal title="Descargar todos los packs" modal_id='modal-select-all' onAccept={async () => {
          removeAllCards();
          for (const pack of packs) await getPackCards(pack.code);
          console.log("packStatusList", packStatusList);
        }}>
          <p>¿Estas seguro de que quieres <b>descargar todos los packs</b>?</p>
          <p>Esto descargara <b>todas las cartas</b> de la web de <a href='https;//es.marvelcdb.com'>MarvelCDB</a> a tu navegador.</p>
          <p>Ejecuta esta acción <b>lo menos podible</b> para no saturar la web.</p>
        </Modal>

        <ModalButton className='btn btn-danger me-1' modal_id='modal-remove-all'>
          Borrar todos
        </ModalButton>
        <Modal
          title="Borrar todos los packs"
          modal_id='modal-remove-all'
          onAccept={removeAllCards}>
          <p>¿Estas seguro de que quieres <b>borrar todos los packs</b>?</p>
          <p>Esto borrará <b>todas las cartas</b> de tu navegador.</p>
        </Modal>
      </div>
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
              {pack.name}
              {loadingPacks.includes(pack.code) && <span className='ms-3'>loading...</span>}
              {packStatus && <span className='ms-3'>
                <span className='badge bg-light text-dark' title='Fecha de descarga'>{new Date(packStatus.lastDownload).toLocaleString('es-ES')}</span>
                <span className='badge bg-dark mx-1' title='Número de cartas'>{packStatus.numberOfCards}</span>
                <button className='btn btn-danger' onClick={async () => await getPackCards(pack.code)}>Re-descargar</button>
              </span>}
            </label>
          </>;
        })}
      </div>
    </section>
  )
}

export default DownloadManager