import LoadingSpinner from '../../LoadingSpinner';
import { Pack, selectAllPacks, selectArePacksLoading, selectNumberOfDownloadedPacks, selectPacksError, selectPackStatusBootstrapVariant } from '../../../store/entities/packs';
import IconForConcept from '../../IconForConcept';
import { useAppSelector } from '../../../hooks/useStore';

const PackStatusCountBadge = () => {
    const packs: Pack[] = useAppSelector(selectAllPacks);
    const areLoading = useAppSelector(selectArePacksLoading);
    const packsError = useAppSelector(selectPacksError);
    const numberOfDownloadedPacks: number = useAppSelector(selectNumberOfDownloadedPacks)
    const packStatusVariant = useAppSelector(selectPackStatusBootstrapVariant);
  return (
    
    <span className={`badge bg-${packsError? "danger" : packStatusVariant} ms-1 d-inline-flex align-items-center gap-2`}>
        {areLoading && <LoadingSpinner small />}
        <span>{numberOfDownloadedPacks} / {packs.length}</span>
        {packsError && <IconForConcept concept="error" />}
        <IconForConcept concept="pack" /> 
    </span>
  )
}

export default PackStatusCountBadge