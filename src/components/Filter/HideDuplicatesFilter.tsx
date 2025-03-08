import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { hideDuplicatesSet, selectHideDuplicates } from '../../store/ui/filters';
import IconForConcept from '../IconForConcept';

const HideDuplicatesFilter = (attributes: React.HTMLAttributes<HTMLDivElement>) => {
    const dispatch = useAppDispatch();
    const hideDuplicates = useAppSelector(selectHideDuplicates);
    const { t } = useTranslation("filters");
    const updatedAttributes = {
        ...attributes,
        className: `btn-group ${attributes.className || ''}`,
        role: `group ${attributes.role || ''}`,
        'aria-label': `${t("hide_duplicates")} ${attributes['aria-label'] || ''}`
    };
    return (
        <div {...updatedAttributes}>
            <input
                type="radio"
                className="btn-check"
                id={`filter_hide_duplicates_true`}
                value="true"
                checked={hideDuplicates === true}
                onChange={(e) => {
                    if (e.target.checked) dispatch(hideDuplicatesSet(true));
                }}
            />
            <label
                className="btn btn-outline-light d-flex align-items-center gap-1"
                htmlFor={`filter_hide_duplicates_true`}
                title={t("filter_true")}
            >
                <IconForConcept concept="single_card" />
                {t("hide_duplicates")}
            </label>
            <input
                type="radio"
                className="btn-check"
                id={`filter_hide_duplicates_false`}
                value="false"
                checked={hideDuplicates === false}
                onChange={(e) => {
                    if (e.target.checked) dispatch(hideDuplicatesSet(false));
                }}
            />
            <label
                className="btn btn-outline-light d-flex align-items-center gap-1"
                htmlFor={`filter_hide_duplicates_false`}
                title={t("filter_false")}
            >
                <IconForConcept concept="multiple_cards" />
                {t("show_duplicates")}
            </label>
        </div>
    )
}

export default HideDuplicatesFilter