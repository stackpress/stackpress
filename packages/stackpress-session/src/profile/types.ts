//modules
import { ScalarInput } from '@stackpress/lib/types';
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
//stackpress-session
import type IdColumn from './columns/IdColumn.js';
import type ImageColumn from './columns/ImageColumn.js';
import type NameColumn from './columns/NameColumn.js';
import type TypeColumn from './columns/TypeColumn.js';
import type RolesColumn from './columns/RolesColumn.js';
import type TagsColumn from './columns/TagsColumn.js';
import type ReferencesColumn from './columns/ReferencesColumn.js';
import type ActiveColumn from './columns/ActiveColumn.js';
import type CreatedColumn from './columns/CreatedColumn.js';
import type UpdatedColumn from './columns/UpdatedColumn.js';
import type { Auth } from '../auth/types.js';

export type Profile = {
  id: string;
  image: string | null;
  name: string;
  type: string;
  roles: string[];
  tags: string[];
  references: Record<string, ScalarInput> | null;
  active: boolean;
  created: Date;
  updated: Date;
};
export type ProfileInput = {
  id?: string;
  image?: string | null;
  name: string;
  type?: string;
  roles?: string[];
  tags?: string[];
  references?: Record<string, ScalarInput> | null;
  active?: boolean;
  created?: Date;
  updated?: Date;
};
export type ProfileColumns = {
  id: IdColumn;
  image: ImageColumn;
  name: NameColumn;
  type: TypeColumn;
  roles: RolesColumn;
  tags: TagsColumn;
  references: ReferencesColumn;
  active: ActiveColumn;
  created: CreatedColumn;
  updated: UpdatedColumn;
};
export type ProfileAssertInterfaceMap = AssertInterfaceMap<ProfileColumns>;
export type ProfileSerializeInterfaceMap =
  SerializeInterfaceMap<ProfileColumns>;
export type ProfileUnserializeInterfaceMap =
  UnserializeInterfaceMap<ProfileColumns>;

export interface ProfileSchemaInterface extends SchemaInterface<
  Profile,
  ProfileColumns
> {}

export type ProfileExtended = Profile;
export type ProfileRelations = {};

export interface ProfileStoreInterface extends StoreInterface<
  Profile,
  ProfileExtended,
  ProfileColumns,
  ProfileRelations
> {};

export interface ProfileActionsInterface extends ActionsInterface<
  Profile,
  ProfileExtended,
  ProfileColumns,
  ProfileRelations
> {};

export type ProfileAuth = Profile & { auth: Record<string, Partial<Auth>> };
