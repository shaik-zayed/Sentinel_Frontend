import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { metalClass, MetallicLayers } from './metallic.tsx';

function cx(...classes: Array<string | false | undefined>): string {
    return classes.filter(Boolean).join(' ');
}

const SIZE_CLASSES = {
    primary: 'inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium',
    sm: 'inline-flex items-center justify-center px-4 py-2 rounded-md text-xs font-medium',
    nav: 'inline-flex items-center justify-center px-4 py-1.5 rounded-md text-sm font-medium',
} as const;

type CopperSize = keyof typeof SIZE_CLASSES;

export interface CopperButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: CopperSize;
    children: ReactNode;
}
export const CopperButton = forwardRef<HTMLButtonElement, CopperButtonProps>(
    ({ size = 'primary', className, children, ...props }, ref) => (
        <button ref={ref} className={cx(metalClass(), SIZE_CLASSES[size], className)} {...props}>
            <MetallicLayers>{children}</MetallicLayers>
        </button>
    )
);
CopperButton.displayName = 'CopperButton';

export interface CopperLinkProps extends LinkProps {
    size?: CopperSize;
    children: ReactNode;
}
export const CopperLink = forwardRef<HTMLAnchorElement, CopperLinkProps>(
    ({ size = 'primary', className, children, ...props }, ref) => (
        <Link ref={ref} className={cx(metalClass(), SIZE_CLASSES[size], className)} {...props}>
            <MetallicLayers>{children}</MetallicLayers>
        </Link>
    )
);
CopperLink.displayName = 'CopperLink';