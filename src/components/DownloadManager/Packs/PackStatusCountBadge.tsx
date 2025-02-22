import { useSelector } from 'react-redux';
import { selectNumberOfPackStatusByDownloadStatus, selectPackStatusBootstrapVariant } from '../../../store/ui/packsStatus';
import LoadingSpinner from '../../LoadingSpinner';
import { Pack, selectAllPacks, selectArePacksLoading, selectPacksError } from '../../../store/entities/packs';
import { BsExclamationCircle } from 'react-icons/bs';
import IconForConcept from '../../IconForConcept';

const PackStatusCountBadge = () => {
    const packs: Pack[] = useSelector(selectAllPacks);
    const areLoading = useSelector(selectArePacksLoading);
    const packsError = useSelector(selectPacksError);
    const numberOfDownloadedPacks: number = useSelector(selectNumberOfPackStatusByDownloadStatus("downloaded"));
    const packStatusVariant = useSelector(selectPackStatusBootstrapVariant);
  return (
    
    <span className={`badge bg-${packsError? "danger" : packStatusVariant} ms-1 d-inline-flex align-items-center gap-2`}>
        {areLoading && <LoadingSpinner small />}
        <span>{numberOfDownloadedPacks} / {packs.length}</span>
        {packsError && <BsExclamationCircle />}
        <IconForConcept concept="pack" /> 
    </span>
  )
}

export default PackStatusCountBadge