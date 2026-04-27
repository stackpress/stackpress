//modules
import type { ReactNode } from 'react';
import type { UnknownNest, CookieOptions } from '@stackpress/lib/types';
//stackpress-view
import type { ServerProps } from '../server/types.js';
import type { ServerConfigProps } from '../types.js';

export type LayoutHeadProps = {
  left?: boolean,
  right?: boolean,
  open?: {
    left?: boolean,
    right?: boolean
  },
  theme: string,
  base?: string,
  logo?: string,
  brand?: string,
  toggleLeft?: () => void,
  toggleRight?: () => void,
  toggleTheme?: () => void
};

export type LayoutLeftProps = {
  base?: string,
  brand?: string,
  head?: boolean,
  logo?: string,
  open?: boolean,
  toggle: () => void,
  children: ReactNode
};

export type LayoutMainProps = {
  head?: boolean,
  left?: boolean,
  right?: boolean,
  open?: {
    left?: boolean,
    right?: boolean
  },
  children: ReactNode
};

export type LayoutMenuProps = {
  path?: string,
  menu: {
    name: string,
    icon?: string,
    path: string,
    match: string
  }[]
};

export type LayoutRightProps = {
  open: boolean,
  head?: boolean,
  children: ReactNode
};

export type LayoutProviderProps<
  C extends UnknownNest = UnknownNest
> = ServerProps<ServerConfigProps<C>> & {
  cookie?: CookieOptions, 
  children: ReactNode
};

export type LayoutBlankAppProps = {
  cookie?: CookieOptions, 
  head?: boolean,
  children: ReactNode
};

export type LayoutBlankProps<
  C extends UnknownNest = UnknownNest
> = LayoutProviderProps<C> & {
  head?: boolean
};

export type LayoutPanelAppProps = { 
  cookie?: CookieOptions, 
  menu?: {
    name: string;
    icon?: string;
    path: string;
    match: string;
  }[],
  left?: ReactNode,
  right?: ReactNode,
  children: ReactNode
};

export type LayoutPanelProps<
  C extends UnknownNest = UnknownNest
> = LayoutProviderProps<C> & LayoutPanelAppProps;