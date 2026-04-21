//modules
import type { ReactNode } from 'react';
import type { StatusResponse, UnknownNest } from '@stackpress/lib/types';
//stackpress-view
import type { 
  ServerConfigProps, 
  ServerPageProps 
} from 'stackpress-view/types';

//NOTE: These need to be client/browser safe exports.

//--------------------------------------------------------------------//
// Config Types

//ie. ctx.config<AdminConfig>('admin');
export type AdminConfig = {
  //name of the admin section. shown on the top left of the page
  name?: string,
  //base route for the admin section
  base?: string,
  //static admin menu items
  menu?: {
    name: string,
    icon?: string,
    path: string,
    match: string
  }[]
};

//--------------------------------------------------------------------//
// View Types

export type AdminConfigProps = ServerConfigProps & {
  admin: AdminConfig
};

export type AdminPageProps = ServerPageProps<AdminConfigProps>;

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

//--------------------------------------------------------------------//
// Import Types

//these are types from papaparse
export type CSVParseError = {
  code: string,
  message: string,
  row: number,
  type: string,
  errors?: Record<string, any>
};

export type CSVParseResults = { 
  data: Record<string, any>[],
  errors: CSVParseError[]
};

//these are types returned from the batch send endpoint
export type BatchSendResults<
  M extends UnknownNest = UnknownNest
> = Partial<StatusResponse<Partial<M>>>[];

export type BatchSendResponse<
  M extends UnknownNest = UnknownNest
> = StatusResponse<BatchSendResults<M>>;

//--------------------------------------------------------------------//
// Search Types

export type Scalar = string | number | boolean | null;

export type SearchQuery = {
  columns?: string[],
  q?: string,
  eq?: Record<string, Scalar>,
  ne?: Record<string, Scalar>,
  ge?: Record<string, Scalar>,
  le?: Record<string, Scalar>,
  has?: Record<string, Scalar>,
  like?: Record<string, Scalar>,
  hasnt?: Record<string, Scalar>
  sort?: Record<string, string>,
  skip?: number,
  take?: number
  total?: boolean
};