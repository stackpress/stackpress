//modules
import type { UnknownNest } from '@stackpress/lib/types';
import type { NotifierOptions } from 'frui/Notifier';
//stackpress-view
import type { ServerProps } from '../server/types.js';

//NOTE: These need to be client/browser safe exports.

//ie. ctx.config<BrandConfig>('brand')
export type BrandConfig = {
  name?: string,
  logo?: string,
  icon?: string,
  favicon?: string
};

export type LanguageConfig = {
  //url flag (ie. ?locale) used to change the user's locale
  //this is also the name of the cookie used to store the locale
  //defaults to `locale`
  key?: string,
  //default locale
  //defaults to `en_US`
  locale?: string,
  //languages and translations
  languages?: Record<string, {
    label: string,
    translations: Record<string, string>
  }>
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

export type {
  ProviderProps
} from '../Provider.js';