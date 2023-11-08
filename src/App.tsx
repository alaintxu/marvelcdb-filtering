import CardList from "./components/CardList";
import DownloadManager from "./components/DownloadManager";
import './App.css';
import { useState } from "react";
import { BsCloudArrowDown, BsCloudSlash } from 'react-icons/bs';

function App() {
  const [showDM, setShowDM] = useState(false);
  return (
    <div className="container bg-dark text-light">
      <button
        className={`btn btn-${showDM ? 'primary' : 'secondary'} my-3`}
        onClick={() => setShowDM((prev) => !prev)}>
        {showDM ? <><BsCloudSlash/> Ocultar</> : <><BsCloudArrowDown/> Mostrar</>}
        gestor de descargas
      </button>
      {showDM ? <DownloadManager /> : <CardList />}
    </div>
  )
}

export default App;
