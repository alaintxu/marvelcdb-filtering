import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconForConcept from '../../IconForConcept';
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore';
import { cardsReceived, MCCard, selectAllCards } from '../../../store/entities/cards';

const ImportExportSection = () => {
    const { t } = useTranslation('global');
    const dispatch = useAppDispatch();
    const cards = useAppSelector(selectAllCards);
    const [importError, setImportError] = useState<string | null>(null);
    const [exportError, setExportError] = useState<string | null>(null);


  const exportToJSONFile = () => {
    try {
      const cards_str = JSON.stringify(cards, null, 2);
      const file = new Blob([cards_str], { type: "application/json" });
      const element = document.createElement("a");
      element.href = URL.createObjectURL(file);
      element.download = "cards.json";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setExportError(null);
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
          const loadedCards: MCCard[] = JSON.parse(raw_data);
          if (!Array.isArray(loadedCards)) {
            throw new Error("Invalid file: expected a JSON array of cards");
          }
          dispatch(cardsReceived(loadedCards));
          setImportError(null);
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
          <IconForConcept concept="jsonFile" className='inline me-2' />
          {t(`import_export`)}
        </h3>
        <div className="mb-3 px-3">
        <label htmlFor="importFileInput" className="form-label">
            <IconForConcept concept="import" className='inline mb-1 me-1'/>
            &nbsp;
            {t(`import`)}
        </label>
        <input className="form-control bg-secondary text-light" type="file" id="importFileInput" onChange={importFromJSONFile} />
        </div>
        <div className="mb-3 px-3">
        <button type="button" className='btn btn-secondary' onClick={exportToJSONFile}>
            <IconForConcept concept="export" />
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