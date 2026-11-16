import type { StyleXStyles } from '@stylexjs/stylex';
import { ui } from './ui';

/** Deck aspect -> brand tone. MarvelCDB uses the same five buckets. */
export const aspectStyle = (aspect: string | undefined): StyleXStyles => {
    switch ((aspect ?? '').toLowerCase()) {
        case 'aggression':
            return ui.aspectAggression;
        case 'justice':
            return ui.aspectJustice;
        case 'leadership':
            return ui.aspectLeadership;
        case 'protection':
            return ui.aspectProtection;
        default:
            return ui.aspectPool;
    }
};
