import { Pack } from '../../../store/entities/packs'
import LoadingSpinner from '../../LoadingSpinner'
import IconForConcept from '../../IconForConcept'
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore'
import { selectIsPackCodeSelected, togglePackCodeSelection } from '../../../store/ui/selectedPacks'
import { selectPackDownloadDateByCode, selectPackStatusByCode } from '../../../store/entities/packs'

type Props = {
    pack: Pack
}

const packStatusVariant = (isSelected: boolean, packStatus: "idle" | "downloading" | "downloaded" | "error") => {
    switch (packStatus) {
        case "downloading":
            return "btn-secondary";
        case "error":
            return "btn-danger";
        case "downloaded":
            return isSelected ? "btn-primary" : "btn-outline-secondary";
    }
    return isSelected ? "btn-primary" : "btn-outline-primary";
}


const PackListItem = ({pack}: Props) => {
    const dispatch = useAppDispatch();
    const isSelected = useAppSelector(selectIsPackCodeSelected(pack.code));
    const packStatus = useAppSelector(selectPackStatusByCode(pack.code));
    const packDownloadDate = useAppSelector(selectPackDownloadDateByCode(pack.code));
    const id:string = "download-manager-pack-list-item" + pack.code;

    return <span
            className={`btn ${packStatusVariant(isSelected, packStatus)} d-flex justify-content-between align-items-center`}
            onClick={async (event) => {
                event.preventDefault();
                await dispatch<any>(togglePackCodeSelection(pack.code));
            }}>
            <span style={{ textAlign: "left" }}>
                <IconForConcept concept="packFill" className='me-2' />
                {pack.name}
            </span>
            <span className='ms-3 d-flex align-items-center' key={`${id}-pack-status`}>
                {packStatus === "downloading" && <LoadingSpinner small className='me-2'/>}
                {isSelected && <>
                <span   className='badge bg-success me-2'
                        title={packDownloadDate ? new Date(packDownloadDate).toLocaleString() : ""}>
                    {pack.size}
                    <IconForConcept concept="downloadDone" />
                </span>
                </>}
                <span className='btn btn-danger'>
                {isSelected ? <IconForConcept concept="download" /> : <IconForConcept concept="downloadRemove" />}
                </span>
            </span>
        </span>;
}

export default PackListItem