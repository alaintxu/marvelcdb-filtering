/**
 * StyleX handles for the Marvel brand tokens declared in `tokens.css`.
 *
 * The values live in CSS custom properties so the plain CSS in App.css and the
 * boot styles in index.html read the same palette. Defining them as StyleX vars
 * keeps them importable from every component module.
 */
import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
    brand: 'var(--mc-brand)',
    brandStrong: 'var(--mc-brand-strong)',
    brandDeep: 'var(--mc-brand-deep)',
    brandSoft: 'var(--mc-brand-soft)',
    ink: 'var(--mc-ink)',
    inkElevated: 'var(--mc-ink-elevated)',
    paper: 'var(--mc-paper)',
    paperMuted: 'var(--mc-paper-muted)',
    text: 'var(--mc-text)',
    textInverse: 'var(--mc-text-inverse)',
    textMuted: 'var(--mc-text-muted)',
    border: 'var(--mc-border)',
    borderStrong: 'var(--mc-border-strong)',
    success: 'var(--mc-success)',
    warning: 'var(--mc-warning)',
    danger: 'var(--mc-danger)',
    info: 'var(--mc-info)',
    successSoft: 'var(--mc-success-soft)',
    warningSoft: 'var(--mc-warning-soft)',
    dangerSoft: 'var(--mc-danger-soft)',
    infoSoft: 'var(--mc-info-soft)',
});

export const fonts = stylex.defineVars({
    display: 'var(--mc-font-display)',
    body: 'var(--mc-font-body)',
    mono: 'var(--mc-font-mono)',
});

export const radii = stylex.defineVars({
    sm: 'var(--mc-radius-sm)',
    md: 'var(--mc-radius-md)',
    lg: 'var(--mc-radius-lg)',
    pill: 'var(--mc-radius-pill)',
});

export const shadows = stylex.defineVars({
    sm: 'var(--mc-shadow-sm)',
    md: 'var(--mc-shadow-md)',
    panel: 'var(--mc-shadow-panel)',
});
