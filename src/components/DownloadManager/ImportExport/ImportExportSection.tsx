import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFileImport, FaFileExport } from "react-icons/fa6";
import IconForConcept from '../../IconForConcept';

const ImportExportSection = () => {
    const { t } = useTranslation('global');
    const [importError, setImportError] = useState<string | null>(null);
    const [exportError, setExportError] = useState<string | null>(null);


  const exportToJSONFile = () => {
    // const element = document.createElement("a");
    // const cards_str = JSON.stringify(cards, null, 2);
    // const file = new Blob([cards_str], { type: "application/json" });
    // element.href = URL.createObjectURL(file);
    // element.download = "cards.json";
    // document.body.appendChild(element);
    // element.click();
    // document.body.removeChild(element);
    try{
      const data: { [key: string]: any } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        const item = JSON.parse(localStorage.getItem(key) || "");
        if (!item) continue;
        data[key] = item;
      }
      return JSON.stringify(data);
    } catch (error: any) {
      console.error("Error exporting JSON file", error);
      setExportError((error as Error).message);
    }
  }

  const importFromJSONFile = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const fileReader = new FileReader();
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = e => {
          const raw_data = (e.target as FileReader).result as string;
          const data: { [key: string]: any } = JSON.parse(raw_data);
          for (const key in data) {
            localStorage.setItem(key, JSON.stringify(data[key] || ""));
          }
          window.location.reload();
          //const loadedCards: MCCard[] = JSON.parse(result) as MCCard[];
          //dispatch(cardsAdded({ newCards: loadedCards }));
          // @ToDo: import local storage and reload page?
        }
      }
    } catch (error) {
      console.error("Error importing JSON file", error);
      setImportError((error as Error).message);
    }
  }
  return (
    <section className='d-flex flex-column mt-1 gap-1'>
        <h3 className='fs-4 mb-4'>
          <IconForConcept concept="jsonFile" className='me-2' />
          {t(`import_export`)}
        </h3>
        <div className="mb-3 px-3">
        <label htmlFor="importFileInput" className="form-label">
            <FaFileImport />
            &nbsp;
            {t(`import`)}
        </label>
        <input className="form-control bg-secondary text-light" type="file" id="importFileInput" onChange={importFromJSONFile} />
        </div>
        <div className="mb-3 px-3">
        <button type="button" className='btn btn-secondary' onClick={exportToJSONFile}>
            <FaFileExport />
            &nbsp;
            {t('export')}
        </button>
        </div>
        {importError && <div className="alert alert-danger">ImportError: {importError}</div>}
        {exportError && <div className="alert alert-danger">ExportError: {exportError}</div>}
    </section>
  )
}

export default ImportExportSection