import { useDispatch, useSelector } from 'react-redux'
import { PackStatus, packStatusPackDownloadStatusSet, packStatusPackRemoved, selectPackStatusById } from '../../../store/ui/packsStatus'
import { Pack } from '../../../store/entities/packs'
import { MdDownloadForOffline, MdFileDownloadDone, MdOutlineFileDownloadOff } from 'react-icons/md'
import LoadingSpinner from '../../LoadingSpinner'
import { BsStack } from 'react-icons/bs'
import { cardPackRemoved } from '../../../store/entities/cards'

type Props = {
    pack: Pack,
    downloadPackCards: (packCode: string) => Promise<void>
}

const packStatusVariant = (packStatus: PackStatus| undefined) => {
    switch (packStatus?.download_status) {
        case "selected":
            return "btn-outline-secondary";
        case "downloading":
            return "btn-secondary";
        case "downloaded":
            return "btn-primary";
    }
    return "btn-outline-primary";
}


const PackListItem = ({pack, downloadPackCards}: Props) => {
    const dispatch = useDispatch();
    const packStatus: PackStatus | undefined = useSelector(selectPackStatusById(pack.code))
    const id:string = "download-manager-pack-list-item" + pack.code;
    return <span
            className={`btn ${packStatusVariant(packStatus)} d-flex justify-content-between align-items-center`}
            onClick={async (event) => {
                event.preventDefault();
                if (packStatus?.download_status === "downloaded"){
                    dispatch(packStatusPackRemoved(pack.code));
                    dispatch(cardPackRemoved(pack.code));
                } else {
                    dispatch(packStatusPackDownloadStatusSet({packCode: pack.code, downloadStatus: "selected"}))
                    await downloadPackCards(pack.code); 
                }
            }}>
            <span style={{ textAlign: "left" }}>
                <BsStack />
                &nbsp;
                {pack.name}
            </span>
            <span className='ms-3 d-flex align-items-center' key={`${id}-pack-status`}>
                {packStatus?.download_status === "downloading" && <LoadingSpinner small className='me-2'/>}
                {packStatus?.download_status === "downloaded" && <>
                <span className='badge bg-success me-2' data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title={new Date(packStatus.download_date).toLocaleString()}>
                    {packStatus.number_of_cards}
                    <MdFileDownloadDone />
                </span>
                </>}
                <span className='btn btn-danger'>
                {packStatus?.download_status === "downloaded" ? <MdOutlineFileDownloadOff /> : <MdDownloadForOffline />}
                </span>
            </span>
        </span>;
}

export default PackListItem