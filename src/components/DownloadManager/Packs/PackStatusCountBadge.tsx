import * as stylex from '@stylexjs/stylex';
import LoadingSpinner from '../../LoadingSpinner';
import { Pack, selectAllPacks, selectArePacksLoading, selectPacksError } from '../../../store/entities/packs';
import IconForConcept from '../../IconForConcept';
import { useAppSelector } from '../../../hooks/useStore';
import { selectNumberOfSelectedPacks } from '../../../store/ui/selectedPacks';
import { badgeTone, ui } from '../../../styles/ui';

const PackStatusCountBadge = () => {
    const packs: Pack[] = useAppSelector(selectAllPacks);
    const areLoading = useAppSelector(selectArePacksLoading);
    const packsError = useAppSelector(selectPacksError);
    const numberOfSelectedPacks: number = useAppSelector(selectNumberOfSelectedPacks)
  return (
    <span {...stylex.props(ui.badge, badgeTone[packsError ? "danger" : "neutral"], ui.ms1, ui.inlineFlex, ui.itemsCenter, ui.gap2)}>
        {areLoading && <LoadingSpinner small />}
      <span>{numberOfSelectedPacks} / {packs.length}</span>
        {packsError && <IconForConcept concept="error" />}
        <IconForConcept concept="pack" />
    </span>
  )
}

export default PackStatusCountBadge
