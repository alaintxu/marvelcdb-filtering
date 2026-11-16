import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import { Pack } from '../../../store/entities/packs'
import LoadingSpinner from '../../LoadingSpinner'
import IconForConcept from '../../IconForConcept'
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore'
import { selectIsPackCodeSelected, togglePackCodeSelection } from '../../../store/ui/selectedPacks'
import { selectPackDownloadDateByCode, selectPackStatusByCode } from '../../../store/entities/packs'
import { ui } from '../../../styles/ui'

type Props = {
    pack: Pack
}

const packStatusVariant = (isSelected: boolean, packStatus: "idle" | "downloading" | "downloaded" | "error"): StyleXStyles => {
    switch (packStatus) {
        case "downloading":
            return ui.buttonSecondary;
        case "error":
            return ui.buttonDanger;
        case "downloaded":
            return isSelected ? ui.buttonSelected : ui.buttonOutline;
    }
    return isSelected ? ui.buttonSelected : ui.buttonOutlineBrand;
}

const styles = stylex.create({
    downloadToggle: {
        paddingBlock: '0.125rem',
        paddingInline: '0.375rem',
    },
});

const PackListItem = ({pack}: Props) => {
    const dispatch = useAppDispatch();
    const isSelected = useAppSelector(selectIsPackCodeSelected(pack.code));
    const packStatus = useAppSelector(selectPackStatusByCode(pack.code));
    const packDownloadDate = useAppSelector(selectPackDownloadDateByCode(pack.code));
    const id:string = "download-manager-pack-list-item" + pack.code;

    return <span
            {...stylex.props(ui.button, packStatusVariant(isSelected, packStatus), ui.flex, ui.justifyBetween, ui.itemsCenter, ui.wFull)}
            onClick={async (event) => {
                event.preventDefault();
                await dispatch<any>(togglePackCodeSelection(pack.code));
            }}>
            <span {...stylex.props(ui.textStart)}>
                <IconForConcept concept="packFill" xstyle={ui.me2} />
                {pack.name}
            </span>
            <span {...stylex.props(ui.ms3, ui.flex, ui.itemsCenter)} key={`${id}-pack-status`}>
                {packStatus === "downloading" && <LoadingSpinner small xstyle={ui.me2}/>}
                {isSelected && <>
                <span   {...stylex.props(ui.badge, ui.badgeSuccess, ui.me2)}
                        title={packDownloadDate ? new Date(packDownloadDate).toLocaleString() : ""}>
                    {pack.size}
                    <IconForConcept concept="downloadDone" />
                </span>
                </>}
                <span {...stylex.props(ui.button, ui.buttonDanger, styles.downloadToggle)}>
                {isSelected ? <IconForConcept concept="download" /> : <IconForConcept concept="downloadRemove" />}
                </span>
            </span>
        </span>;
}

export default PackListItem
