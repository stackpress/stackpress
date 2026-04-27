//modules
import * as z from 'zod';
//stackpress-schema
import { removeUndefined } from 'stackpress-schema/helpers';
//stackpress-sql
import type { Profile, ProfileSchemaInterface } from './types.js';
import IdColumn from './columns/IdColumn.js';
import ImageColumn from './columns/ImageColumn.js';
import NameColumn from './columns/NameColumn.js';
import TypeColumn from './columns/TypeColumn.js';
import RolesColumn from './columns/RolesColumn.js';
import TagsColumn from './columns/TagsColumn.js';
import ReferencesColumn from './columns/ReferencesColumn.js';
import ActiveColumn from './columns/ActiveColumn.js';
import CreatedColumn from './columns/CreatedColumn.js';
import UpdatedColumn from './columns/UpdatedColumn.js';

export default class ProfileSchema implements ProfileSchemaInterface {
  public readonly name = 'Profile';
  public readonly columns;
  public readonly shape;
  protected _seed: string;

  public get defaults() {
    return {
      id: this.columns.id.defaults,
      image: this.columns.image.defaults,
      name: this.columns.name.defaults,
      type: this.columns.type.defaults,
      roles: this.columns.roles.defaults,
      tags: this.columns.tags.defaults,
      references: this.columns.references.defaults,
      active: this.columns.active.defaults,
      created: this.columns.created.defaults,
      updated: this.columns.updated.defaults
    };
  }

  public constructor(seed = '') {
    this._seed = seed;
    this.columns = {
      id: new IdColumn(),
      image: new ImageColumn(),
      name: new NameColumn(),
      type: new TypeColumn(),
      roles: new RolesColumn(),
      tags: new TagsColumn(),
      references: new ReferencesColumn(),
      active: new ActiveColumn(),
      created: new CreatedColumn(),
      updated: new UpdatedColumn()
    };
    this.shape = z.object({
      id: this.columns.id.shape,
      image: this.columns.image.shape,
      name: this.columns.name.shape,
      type: this.columns.type.shape,
      roles: this.columns.roles.shape,
      tags: this.columns.tags.shape,
      references: this.columns.references.shape,
      active: this.columns.active.shape,
      created: this.columns.created.shape,
      updated: this.columns.updated.shape
    });
  }

  public assert(value: Record<string, any>, required = false) {
    const errors = {
      id:
        required || typeof value.id !== 'undefined' ?
          this.columns.id.assert(value.id) || undefined
        : undefined,
      image:
        required || typeof value.image !== 'undefined' ?
          this.columns.image.assert(value.image) || undefined
        : undefined,
      name:
        required || typeof value.name !== 'undefined' ?
          this.columns.name.assert(value.name) || undefined
        : undefined,
      type:
        required || typeof value.type !== 'undefined' ?
          this.columns.type.assert(value.type) || undefined
        : undefined,
      roles:
        required || typeof value.roles !== 'undefined' ?
          this.columns.roles.assert(value.roles) || undefined
        : undefined,
      tags:
        required || typeof value.tags !== 'undefined' ?
          this.columns.tags.assert(value.tags) || undefined
        : undefined,
      references:
        required || typeof value.references !== 'undefined' ?
          this.columns.references.assert(value.references) || undefined
        : undefined,
      active:
        required || typeof value.active !== 'undefined' ?
          this.columns.active.assert(value.active) || undefined
        : undefined,
      created:
        required || typeof value.created !== 'undefined' ?
          this.columns.created.assert(value.created) || undefined
        : undefined,
      updated:
        required || typeof value.updated !== 'undefined' ?
          this.columns.updated.assert(value.updated) || undefined
        : undefined
    };
    return Object.values(errors).some(Boolean) ? removeUndefined(errors) : null;
  }

  public filter<V extends Record<string, any>>(value: V, populate = false) {
    const filtered = Object.fromEntries(
      Object.entries(value).filter(([key]) => key in this.columns)
    ) as Partial<Profile>;
    return populate ? this.populate(filtered) : filtered;
  }

  public populate<V extends Record<string, any>>(value: V) {
    return { ...this.defaults, ...value } as typeof this.defaults & V;
  }

  public serialize(value: Record<string, any>) {
    return removeUndefined({
      id: this.columns.id.serialize(value.id),
      image: this.columns.image.serialize(value.image),
      name: this.columns.name.serialize(value.name),
      type: this.columns.type.serialize(value.type),
      roles: this.columns.roles.serialize(value.roles),
      tags: this.columns.tags.serialize(value.tags),
      references: this.columns.references.serialize(value.references),
      active: this.columns.active.serialize(value.active),
      created: this.columns.created.serialize(value.created),
      updated: this.columns.updated.serialize(value.updated)
    });
  }

  public unserialize(value: Record<string, any>) {
    return removeUndefined({
      id: this.columns.id.unserialize(value.id),
      image: this.columns.image.unserialize(value.image),
      name: this.columns.name.unserialize(value.name),
      type: this.columns.type.unserialize(value.type),
      roles: this.columns.roles.unserialize(value.roles),
      tags: this.columns.tags.unserialize(value.tags),
      references: this.columns.references.unserialize(value.references),
      active: this.columns.active.unserialize(value.active),
      created: this.columns.created.unserialize(value.created),
      updated: this.columns.updated.unserialize(value.updated)
    });
  }
}
