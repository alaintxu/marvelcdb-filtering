import * as stylex from '@stylexjs/stylex';
import { ui } from '../../styles/ui';

type Props = {
  count: number,
}

const CardGridSkeleton = ({ count }: Props) => (
  <div className="mc-card-grid" aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} {...stylex.props(ui.skeletonCard)} />
    ))}
  </div>
);

export default CardGridSkeleton;
