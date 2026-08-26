import type { ReactNode } from 'react';
import styles from './metallic.module.css';

type Metal = 'copper' | 'gold';

/** The 3 background layers + content wrapper. Render as the ONLY children of a `.metal` element. */
export function MetallicLayers({ metal = 'copper', children }: { metal?: Metal; children: ReactNode }) {
    return (
        <>
            <span className={metal === 'gold' ? styles.facetsGold : styles.facetsCopper} aria-hidden="true" />
            <span className={styles.glossy} aria-hidden="true" />
            <span className={styles.grain} aria-hidden="true" />
            <span className={styles.content}>{children}</span>
        </>
    );
}

/** Classnames for the element itself. `compact` = icon badges/logo marks under ~48px, otherwise buttons. */
export function metalClass(metal: Metal = 'copper', compact = false): string {
    return [styles.metal, metal === 'gold' && styles.metalGold, compact && styles.compact]
        .filter(Boolean)
        .join(' ');
}

/**
 * Just the 3 background layers, no content wrapper — for cases where your
 * real content is a SIBLING element rather than a child (e.g. a toggle
 * switch, where the knob needs to move independently of the track).
 * The layers are position:absolute so they don't affect sibling layout;
 * give your sibling `relative z-[3]` so it renders above them.
 */
export function MetallicBackdrop({ metal = 'copper' }: { metal?: Metal }) {
    return (
        <>
            <span className={metal === 'gold' ? styles.facetsGold : styles.facetsCopper} aria-hidden="true" />
            <span className={styles.glossy} aria-hidden="true" />
            <span className={styles.grain} aria-hidden="true" />
        </>
    );
}