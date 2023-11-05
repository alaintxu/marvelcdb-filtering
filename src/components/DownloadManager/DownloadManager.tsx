import { useState } from 'react';
import usePacks from '../../hooks/usePacks';
import styles from './DownloadManager.module.css';

type PackStatus = {
  code: string,
  lastDownload: Date,
  numberOfCards: number
}

const DownloadManager = () => {
  const { packs, error } = usePacks();
  const [packStatusList, setPackStatusList] = useState<PackStatus[]>([]);
  const [loadingPacks, setLoadingPacks] = useState<string[]>([]);

  if (error) return (<p>{error}</p>)

  const getCards = async (packCode: string) => {
    setLoadingPacks((prevState) => [...prevState, packCode]);

    const response = await fetch('https://es.marvelcdb.com/api/public/cards/' + packCode + '.json');
    const data = await response.json();

    // @ToDo: save cards in local storage.
    

    setLoadingPacks((prevState) => prevState.filter((code) => code !== packCode));

    updatePackStatus({
      code: packCode,
      lastDownload: new Date(),
      numberOfCards: data.length,
    })
    
  }

  const updatePackStatus = (newPackStatus: PackStatus) => {
    removePackStatus(newPackStatus.code);
    setPackStatusList((prevState) =>[
      ...prevState,
      newPackStatus
    ]);
  }

  const removePackStatus = (packCode: string) => {
    setPackStatusList((prevState) => prevState.filter((packStatus) => packStatus.code !== packCode));
  }

  const removeAllCards = () => {
    setPackStatusList([]);
    // @ToDo: Remove cards from local storage
  }

  return (
    <section className={styles.downloadManager}>
      <h2>Packs descargados</h2>
      <button onClick={async () => {
         for(const pack of packs) await getCards(pack.code);
         console.log("packStatusList", packStatusList); 
      }}>Seleccionar todos</button>
      <button onClick={removeAllCards}>Des-seleccionar todos</button>
      <ul className={styles.packList}>
        {packs.map(pack => {
          const packStatus = packStatusList.filter((packStatusItem: PackStatus) => packStatusItem.code === pack.code)[0];
          return <li key={pack.code}>
            <label>
              <input
                type='checkbox'
                checked={packStatus !== undefined}
                onChange={async (event) => {
                  if (event.currentTarget.checked) await getCards(pack.code)
                  else removePackStatus(pack.code)
                }} />
              {pack.name}
            </label>
            {packStatus && <span>
              &nbsp;
              {packStatus.lastDownload.toISOString()} ({packStatus.numberOfCards})
              &nbsp;
              <button onClick={async () => await getCards(pack.code)}>Re-descargar</button>
            </span>}

            {loadingPacks.includes(pack.code) && <span>loading...</span>}
          </li>
        })}
      </ul>
    </section>
  )
}

export default DownloadManager