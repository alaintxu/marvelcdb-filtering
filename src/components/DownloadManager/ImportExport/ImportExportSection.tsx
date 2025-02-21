import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFiletypeJson } from "react-icons/bs";
import { FaFileImport, FaFileExport } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { cardsAdded, MCCard, selectAllCards } from "../../../store/entities/cards";

const ImportExportSection = () => {
    const { t } = useTranslation('global');
    const dispatch = useDispatch();
    const cards: MCCard[] = useSelector(selectAllCards);


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
  return (
    <section className='d-flex flex-column mt-1 gap-1'>
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
    </section>
  )
}

export default ImportExportSection