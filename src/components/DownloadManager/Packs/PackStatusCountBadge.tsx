import LoadingSpinner from '../../LoadingSpinner';
import { Pack, selectAllPacks, selectArePacksLoading, selectPacksError, selectPackStatusBootstrapVariant } from '../../../store/entities/packs';
import IconForConcept from '../../IconForConcept';
import { useAppSelector } from '../../../hooks/useStore';
import { selectNumberOfSelectedPacks } from '../../../store/ui/selectedPacks';

const PackStatusCountBadge = () => {
    const packs: Pack[] = useAppSelector(selectAllPacks);
    const areLoading = useAppSelector(selectArePacksLoading);
    const packsError = useAppSelector(selectPacksError);
    const numberOfSelectedPacks: number = useAppSelector(selectNumberOfSelectedPacks)
    const packStatusVariant = useAppSelector(selectPackStatusBootstrapVariant);
  return (
    
    <span className={`badge bg-${packsError? "danger" : packStatusVariant} ms-1 d-inline-flex align-items-center gap-2`}>
        {areLoading && <LoadingSpinner small />}
      <span>{numberOfSelectedPacks} / {packs.length}</span>
        {packsError && <IconForConcept concept="error" />}
        <IconForConcept concept="pack" /> 
    </span>
  )
}

export default PackStatusCountBadge