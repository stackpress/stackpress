//stackpress-schema
import type {
  AssertInterfaceMap,
  SerializeInterfaceMap,
  UnserializeInterfaceMap
} from 'stackpress-schema/types';
import type { SchemaInterface } from 'stackpress-schema';
//stackpress-sql
import type StoreInterface from 'stackpress-sql/StoreInterface';
import type ActionsInterface from 'stackpress-sql/ActionsInterface';
//stackpress-view
import { 
  ServerConfigProps, 
  ServerPageProps 
} from 'stackpress-view/types';
//stackpress-session/profile
import { Profile } from '../profile/types.js';
//stackpress-session/auth
import type IdColumn from './columns/IdColumn.js';
import type ProfileIdColumn from './columns/ProfileIdColumn.js';
import type TypeColumn from './columns/TypeColumn.js';
import type TokenColumn from './columns/TokenColumn.js';
import type SecretColumn from './columns/SecretColumn.js';
import type VerifiedColumn from './columns/VerifiedColumn.js';
import type ConsumedColumn from './columns/ConsumedColumn.js';
import type ActiveColumn from './columns/ActiveColumn.js';
import type CreatedColumn from './columns/CreatedColumn.js';
import type UpdatedColumn from './columns/UpdatedColumn.js';
import type ProfileStore from '../profile/ProfileStore.js';

export type Auth = {
  id: string;
  profileId: string;
  type: string;
  token: string;
  secret: string;
  verified: boolean;
  consumed: Date;
  active: boolean;
  created: Date;
  updated: Date;
};
export type AuthInput = {
  id?: string;
  profileId: string;
  type?: string;
  token: string;
  secret: string;
  verified?: boolean;
  consumed?: Date;
  active?: boolean;
  created?: Date;
  updated?: Date;
};
export type AuthColumns = {
  id: IdColumn;
  profileId: ProfileIdColumn;
  type: TypeColumn;
  token: TokenColumn;
  secret: SecretColumn;
  verified: VerifiedColumn;
  consumed: ConsumedColumn;
  active: ActiveColumn;
  created: CreatedColumn;
  updated: UpdatedColumn;
};
export type AuthAssertInterfaceMap = AssertInterfaceMap<AuthColumns>;
export type AuthSerializeInterfaceMap = SerializeInterfaceMap<AuthColumns>;
export type AuthUnserializeInterfaceMap = UnserializeInterfaceMap<AuthColumns>;

export interface AuthSchemaInterface extends SchemaInterface<
  Auth,
  AuthColumns
> {};

export type AuthExtended = Auth & {
  profile: Profile;
};
export type AuthRelations = {
  profile: {
    store: ProfileStore;
    local: string;
    foreign: string;
    type: [number, number];
  };
};

export interface AuthStoreInterface extends StoreInterface<
  Auth,
  AuthExtended,
  AuthColumns,
  AuthRelations
> {};

export interface AuthActionsInterface extends ActionsInterface<
  Auth,
  AuthExtended,
  AuthColumns,
  AuthRelations
> {};

export type ActionOptions = {
  seed?: string,
  password?: AuthPasswordConfig
};

//--------------------------------------------------------------------//
// Config Types

export type AuthPasswordConfig = {
  min?: number,
  max?: number,
  upper?: boolean,
  lower?: boolean,
  number?: boolean,
  special?: boolean
};

export type AuthMenuConfig = {
  //use 'footer' to make it a footer link
  type?: string,
  //ex. target _blank
  target?: string,
  name: string,
  icon?: string,
  path: string
};

//ie. ctx.config<AuthConfig>('auth')
export type AuthConfig = {
  base?: string,
  redirect?: string,
  '2fa'?: {},
  captcha?: {},
  roles?: string[],
  //static signin options
  menu?: AuthMenuConfig[],
  password?: AuthPasswordConfig
};


//--------------------------------------------------------------------//
// Page Types

export type SignupInput = {
  name: string,
  type?: string,
  username?: string,
  email?: string,
  phone?: string,
  secret: string,
  roles: string[]
};

export type SigninInput = {
  type?: SigninType,
  username?: string,
  email?: string,
  phone?: string,
  secret: string
};

export type SigninType = 'username' | 'email' | 'phone';

//--------------------------------------------------------------------//
// View Types

export type AuthConfigProps = ServerConfigProps & {
  auth: AuthConfig
};

export type AuthPageProps = ServerPageProps<AuthConfigProps>;