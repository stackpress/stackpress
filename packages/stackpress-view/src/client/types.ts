//modules
import type { ReactNode } from 'react';
import type { UnknownNest, CookieOptions } from '@stackpress/lib/types';
import type { NotifierOptions } from 'frui/Notifier';
//stackpress-language
import type { LanguageConfig } from 'stackpress-language/types';
//stackpress-view
import type { ServerProps } from '../server/types.js';

//NOTE: These need to be client/browser safe exports.

//--------------------------------------------------------------------//
// Layout Types

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
    icon: string,
    path: string,
    match: string
  }[]
};

export type LayoutRightProps = {
  open: boolean,
  head?: boolean,
  children: ReactNode
};

export type LayoutProviderProps = ServerProps<ServerConfigProps> & {
  cookie?: CookieOptions, 
  children: ReactNode
};

export type LayoutBlankAppProps = {
  cookie?: CookieOptions, 
  head?: boolean,
  children: ReactNode
};

export type LayoutBlankProps = LayoutProviderProps & {
  head?: boolean
};

export type LayoutPanelAppProps = { 
  cookie?: CookieOptions, 
  menu?: {
    name: string;
    icon: string;
    path: string;
    match: string;
  }[],
  left?: ReactNode,
  right?: ReactNode,
  children: ReactNode
};

export type LayoutPanelProps = LayoutProviderProps & LayoutPanelAppProps;

//--------------------------------------------------------------------//
// Config Types

//ie. ctx.config<BrandConfig>('brand')
export type BrandConfig = {
  name?: string,
  logo?: string,
  icon?: string,
  favicon?: string
};

//ie. ctx.config<ViewConfig>('view')
export type ViewConfig = {
  //url flag (ie. ?json) used to disable template 
  //rendering and show the raw json data instead
  //defaults to `json`
  noview?: string,
  //used by vite and in development mode
  //to determine the root of the project
  //defaults to `/`
  base?: string,
  props?: Record<string, unknown>,
  //notifier (frui) settings
  notify?: NotifierOptions
};

//--------------------------------------------------------------------//
// Server Types

export type ServerConfigProps<
  C extends UnknownNest = UnknownNest
> = C & {
  brand: BrandConfig,
  language: LanguageConfig,
  view: ViewConfig
};

export type ServerPageProps<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = UnknownNest
> = ServerProps<C, I, O> & { styles?: string[] };

export type ServerConfigPageProps<
  C extends UnknownNest = UnknownNest,
  I extends UnknownNest = UnknownNest,
  O = UnknownNest
> = ServerPageProps<ServerConfigProps<C>, I, O>;

//--------------------------------------------------------------------//
// Other Types

export type { ToastOptions as NotifyConfig } from 'frui/Notifier';

export type {
  Trace,
  UnknownNest,
  NestedObject,
  SuccessResponse, 
  ErrorResponse, 
  ResponseStatus, 
  StatusResponse 
} from '@stackpress/lib/types';

export type { LanguageConfig } from 'stackpress-language/types';

export type {
  ServerUrlProps,
  ServerSessionRoute,
  ServerSessionPermission,
  ServerSessionProps,
  ServerRequestProps,
  ServerResponseProps,
  ServerProps,
  ServerContextProps,
  ServerProviderProps
} from '../server/types.js';

export type {
  ThemeContextProps,
  ThemeProviderProps
} from '../theme/types.js';

