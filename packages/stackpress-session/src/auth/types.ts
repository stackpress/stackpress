//stackpress-schema
import type {
  AssertInterfaceMap,
  SerializeInterfaceMap,
  UnserializeInterfaceMap
} from 'stackpress-schema/types';
import type { SchemaInterface } from 'stackpress-schema';
//stackpress-sql
import type ActionsInterface from 'stackpress-sql/ActionsInterface';
import type StoreInterface from 'stackpress-sql/StoreInterface';
//stackpress-view
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress-view/types';
//stackpress-session/profile
import type { Profile } from '../profile/types.js';
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

// stores the persisted authentication record shape that auth actions return
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

// describes the writable payload callers can send into auth create or update
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

// maps the generated auth schema columns so store and schema helpers stay typed
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

// exposes the generated assert handlers for each auth column
export type AuthAssertInterfaceMap = AssertInterfaceMap<AuthColumns>;
// exposes the generated serialize handlers for each auth column
export type AuthSerializeInterfaceMap = SerializeInterfaceMap<AuthColumns>;
// exposes the generated unserialize handlers for each auth column
export type AuthUnserializeInterfaceMap = UnserializeInterfaceMap<AuthColumns>;

export interface AuthSchemaInterface extends SchemaInterface<
  Auth,
  AuthColumns
> {}

// expands auth rows with the joined profile record used by page handlers and views
export type AuthExtended = Auth & {
  profile: Profile;
};

// describes the generated relationship wiring between auth and profile stores
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

// carries helper options for auth-related actions such as seeded ids and password rules
export type ActionOptions = {
  seed?: string,
  password?: AuthPasswordConfig
};

//--------------------------------------------------------------------//
// Config Types

// configures the sender identity for auth emails such as OTP and magic links
export type AuthEmailConfig = {
  name: string;
  address: string;
};

// configures password policy checks shared by signup and password updates
export type AuthPasswordConfig = {
  min?: number,
  max?: number,
  upper?: boolean,
  lower?: boolean,
  number?: boolean,
  special?: boolean
};

// describes the sign-in menu entries rendered on the auth landing page
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
// collects package-level auth settings that pages and events read at runtime
export type AuthConfig = {
  base?: string,
  redirect?: string,
  '2fa'?: {},
  captcha?: {},
  email?: AuthEmailConfig,
  roles?: string[],
  //static signin options
  menu?: AuthMenuConfig[],
  password?: AuthPasswordConfig
};

//--------------------------------------------------------------------//
// Page Types

// captures the signup form payload before it fans out into auth and profile records
export type SignupInput = {
  name: string,
  type?: string,
  username?: string,
  email?: string,
  phone?: string,
  secret: string,
  roles: string[]
};

// captures the shared sign-in payload before each route narrows by method
export type SigninInput = {
  type?: SigninType,
  username?: string,
  email?: string,
  phone?: string,
  secret: string
};

// names the built-in sign-in methods that the generic signin event accepts
export type SigninType = 'username' | 'email' | 'phone';

//--------------------------------------------------------------------//
// View Types

// extends page config props with the auth config block used by the views
export type AuthConfigProps = ServerConfigProps & {
  auth: AuthConfig
};

// carries the full page props shape shared by stackpress-session auth pages
export type AuthPageProps = ServerPageProps<AuthConfigProps>;
