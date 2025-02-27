import { loadPackCards, Pack, unloadPackCards } from '../../../store/entities/packs'
import LoadingSpinner from '../../LoadingSpinner'
import IconForConcept from '../../IconForConcept'
import { useAppDispatch } from '../../../hooks/useStore'

type Props = {
    pack: Pack
}

const packStatusVariant = (packStatus: "error" | "unselected" | "selected" | "downloading" | "downloaded" | undefined) => {
    switch (packStatus) {
        case "selected":
            return "btn-outline-secondary";
        case "downloading":
            return "btn-secondary";
        case "downloaded":
            return "btn-primary";
        case "error":
            return "btn-danger";
    }
    return "btn-outline-primary";
}


const PackListItem = ({pack}: Props) => {
    const dispatch = useAppDispatch();
    const id:string = "download-manager-pack-list-item" + pack.code;

    return <span
            className={`btn ${packStatusVariant(pack.download_status)} d-flex justify-content-between align-items-center`}
            onClick={async (event) => {
                event.preventDefault();
                if (pack.download_status === "downloaded"){
                    dispatch(unloadPackCards(pack.code));
                } else {
                    await dispatch<any>(loadPackCards(pack.code));
                }
            }}>
            <span style={{ textAlign: "left" }}>
                <IconForConcept concept="packFill" className='me-2' />
                {pack.name}
            </span>
            <span className='ms-3 d-flex align-items-center' key={`${id}-pack-status`}>
                {pack.download_status === "downloading" && <LoadingSpinner small className='me-2'/>}
                {pack.download_status === "downloaded" && <>
                <span   className='badge bg-success me-2'
                        title={pack.download_date ? new Date(pack.download_date).toLocaleString() : ""}>
                    {pack.total}
                    <IconForConcept concept="downloadDone" />
                </span>
                </>}
                <span className='btn btn-danger'>
                {pack.download_status === "downloaded" ? <IconForConcept concept="download" /> : <IconForConcept concept="downloadRemove" />}
                </span>
            </span>
        </span>;
}

export default PackListItem