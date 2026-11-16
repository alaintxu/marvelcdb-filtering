import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { useTranslation } from 'react-i18next';
import { ui } from '../styles/ui';

type Props = {
  small?: boolean,
  onLight?: boolean,
  xstyle?: StyleXStyles,
}

const LoadingSpinner = ({ small = false, onLight = false, xstyle }: Props) => {
  const { t } = useTranslation('global');
  return (
    <span {...stylex.props(ui.spinner, small && ui.spinnerSmall, onLight && ui.spinnerOnLight, xstyle)} role="status">
      <span {...stylex.props(ui.visuallyHidden)}>{t('loading')}</span>
    </span>
  )
}

export default LoadingSpinner
