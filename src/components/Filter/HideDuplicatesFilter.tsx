import { useTranslation } from 'react-i18next';
import * as stylex from '@stylexjs/stylex';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { hideDuplicatesSet, selectHideDuplicates } from '../../store/ui/filters';
import IconForConcept from '../IconForConcept';
import { ui } from '../../styles/ui';

const HideDuplicatesFilter = () => {
    const dispatch = useAppDispatch();
    const hideDuplicates = useAppSelector(selectHideDuplicates);
    const { t } = useTranslation("filters");
    return (
        <div {...stylex.props(ui.buttonGroup)} role="group" aria-label={t("hide_duplicates")}>
            <input
                type="radio"
                {...stylex.props(ui.radioInput)}
                id="filter_hide_duplicates_true"
                value="true"
                checked={hideDuplicates === true}
                onChange={(e) => {
                    if (e.target.checked) dispatch(hideDuplicatesSet(true));
                }}
            />
            <label
                {...stylex.props(ui.optionButton, hideDuplicates === true && ui.optionButtonSelected)}
                htmlFor="filter_hide_duplicates_true"
                title={t("filter_true")}
            >
                <IconForConcept concept="single_card" />
                {t("hide_duplicates")}
            </label>
            <input
                type="radio"
                {...stylex.props(ui.radioInput)}
                id="filter_hide_duplicates_false"
                value="false"
                checked={hideDuplicates === false}
                onChange={(e) => {
                    if (e.target.checked) dispatch(hideDuplicatesSet(false));
                }}
            />
            <label
                {...stylex.props(ui.optionButton, hideDuplicates === false && ui.optionButtonSelected)}
                htmlFor="filter_hide_duplicates_false"
                title={t("filter_false")}
            >
                <IconForConcept concept="multiple_cards" />
                {t("show_duplicates")}
            </label>
        </div>
    )
}

export default HideDuplicatesFilter
