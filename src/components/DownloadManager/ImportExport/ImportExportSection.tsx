import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as stylex from '@stylexjs/stylex';
import IconForConcept from '../../IconForConcept';
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore';
import { cardsReceived, MCCard, selectAllCards } from '../../../store/entities/cards';
import { packCardsHydrated } from '../../../store/entities/packs';
import { selectedPackCodesSet, selectSelectedPackCodes } from '../../../store/ui/selectedPacks';
import { ui } from '../../../styles/ui';

const ImportExportSection = () => {
    const { t } = useTranslation('global');
    const dispatch = useAppDispatch();
    const cards = useAppSelector(selectAllCards);
    const selectedPackCodes = useAppSelector(selectSelectedPackCodes);
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

  const importFromJSONFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const loadedCards: MCCard[] = JSON.parse(await file.text());
      if (!Array.isArray(loadedCards)) {
        throw new Error("Invalid file: expected a JSON array of cards");
      }
      // Mark imported packs as loaded and select them so their cards are displayed
      const packCodes = [...new Set(loadedCards.map((card) => card.pack_code))];
      dispatch(cardsReceived(loadedCards));
      for (const packCode of packCodes) {
        dispatch(packCardsHydrated({ packCode, download_date: Date.now() }));
      }
      dispatch(selectedPackCodesSet([...new Set([...selectedPackCodes, ...packCodes])]));
      setImportError(null);
    } catch (error) {
      console.error("Error importing JSON file", error);
      setImportError((error as Error).message);
    }
  }
  return (
    <section {...stylex.props(ui.flex, ui.flexColumn, ui.mt1, ui.gap1)}>
        <h3 {...stylex.props(ui.sectionTitle, ui.fs4, ui.mb4, ui.flex, ui.itemsCenter)}>
          <IconForConcept concept="jsonFile" xstyle={ui.me2} />
          {t(`import_export`)}
        </h3>
        <div {...stylex.props(ui.mb3, ui.px3)}>
        <label htmlFor="importFileInput" {...stylex.props(ui.formLabel)}>
            <IconForConcept concept="import" xstyle={ui.me1}/>
            &nbsp;
            {t(`import`)}
        </label>
        <input {...stylex.props(ui.formControl, ui.formControlDark)} type="file" id="importFileInput" onChange={importFromJSONFile} />
        </div>
        <hr {...stylex.props(ui.separator)}/>
        <div {...stylex.props(ui.px3)}>
        <button type="button" {...stylex.props(ui.button, ui.buttonSecondary)} onClick={exportToJSONFile}>
            <IconForConcept concept="export" />
            &nbsp;
            {t('export')}
        </button>
        </div>
        {importError && <div {...stylex.props(ui.alert, ui.alertDanger)} data-alert="true" data-variant="danger">ImportError: {importError}</div>}
        {exportError && <div {...stylex.props(ui.alert, ui.alertDanger)} data-alert="true" data-variant="danger">ExportError: {exportError}</div>}
    </section>
  )
}

export default ImportExportSection
