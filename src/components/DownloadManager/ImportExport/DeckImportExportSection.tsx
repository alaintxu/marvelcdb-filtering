import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as stylex from '@stylexjs/stylex';
import IconForConcept from '../../IconForConcept';
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore';
import { importDeck, selectAllDeckIds } from '../../../store/entities/decks';
import { ui } from '../../../styles/ui';

const DeckImportExportSection = () => {
    const { t } = useTranslation('global');
    const dispatch = useAppDispatch();
    const deckIds = useAppSelector(selectAllDeckIds);
    const [importError, setImportError] = useState<string | null>(null);
    const [exportError, setExportError] = useState<string | null>(null);

    const exportDeckIdsToJSONFile = () => {
        try {
            const file = new Blob([JSON.stringify(deckIds, null, 2)], { type: "application/json" });
            const element = document.createElement("a");
            element.href = URL.createObjectURL(file);
            element.download = "decks.json";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            setExportError(null);
        } catch (error) {
            console.error("Error exporting deck IDs", error);
            setExportError((error as Error).message);
        }
    }

    const importDeckIdsFromJSONFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const loadedIds: unknown = JSON.parse(await file.text());
            if (!Array.isArray(loadedIds) || !loadedIds.every((id) => Number.isInteger(id) && id > 0)) {
                throw new Error("Invalid file: expected a JSON array of deck IDs");
            }
            // Decks already bookmarked are skipped so they are not downloaded again
            const bookmarkedIds = new Set(deckIds);
            const newIds = [...new Set<number>(loadedIds)].filter((id) => !bookmarkedIds.has(id));
            for (const deckId of newIds) {
                dispatch(importDeck(deckId));
            }
            setImportError(null);
        } catch (error) {
            console.error("Error importing deck IDs", error);
            setImportError((error as Error).message);
        }
    }

    return (
        <section {...stylex.props(ui.flex, ui.flexColumn, ui.gap3)}>
            <h3 {...stylex.props(ui.sectionTitle, ui.fs4, ui.flex, ui.itemsCenter)}>
                <IconForConcept concept="deck" xstyle={ui.me2} />
                {t('import_export_decks')}
            </h3>
            <div {...stylex.props(ui.px3)}>
                <label htmlFor="importDeckIdsFileInput" {...stylex.props(ui.formLabel)}>
                    <IconForConcept concept="import" xstyle={ui.me1} />
                    &nbsp;
                    {t('import')}
                </label>
                <input {...stylex.props(ui.formControl, ui.formControlDark)} type="file" id="importDeckIdsFileInput" onChange={importDeckIdsFromJSONFile} />
            </div>
            <div {...stylex.props(ui.px3)}>
                <button type="button" {...stylex.props(ui.button, ui.buttonSecondary)} onClick={exportDeckIdsToJSONFile}>
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

export default DeckImportExportSection
