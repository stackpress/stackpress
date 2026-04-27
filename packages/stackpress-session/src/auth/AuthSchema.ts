//modules
import * as z from 'zod';
//stackpress-schema
import { removeUndefined } from 'stackpress-schema/helpers';
//stackpress-session
import type { Auth, AuthSchemaInterface } from './types.js';
import IdColumn from './columns/IdColumn.js';
import ProfileIdColumn from './columns/ProfileIdColumn.js';
import TypeColumn from './columns/TypeColumn.js';
import TokenColumn from './columns/TokenColumn.js';
import SecretColumn from './columns/SecretColumn.js';
import VerifiedColumn from './columns/VerifiedColumn.js';
import ConsumedColumn from './columns/ConsumedColumn.js';
import ActiveColumn from './columns/ActiveColumn.js';
import CreatedColumn from './columns/CreatedColumn.js';
import UpdatedColumn from './columns/UpdatedColumn.js';

export default class AuthSchema implements AuthSchemaInterface {
  public readonly name = 'Auth';
  public readonly columns;
  public readonly shape;
  protected _seed: string;

  public get defaults() {
    return {
      id: this.columns.id.defaults,
      profileId: this.columns.profileId.defaults,
      type: this.columns.type.defaults,
      token: this.columns.token.defaults,
      secret: this.columns.secret.defaults,
      verified: this.columns.verified.defaults,
      consumed: this.columns.consumed.defaults,
      active: this.columns.active.defaults,
      created: this.columns.created.defaults,
      updated: this.columns.updated.defaults
    };
  }

  public constructor(seed = '') {
    this._seed = seed;
    this.columns = {
      id: new IdColumn(),
      profileId: new ProfileIdColumn(),
      type: new TypeColumn(),
      token: new TokenColumn(seed),
      secret: new SecretColumn(),
      verified: new VerifiedColumn(),
      consumed: new ConsumedColumn(),
      active: new ActiveColumn(),
      created: new CreatedColumn(),
      updated: new UpdatedColumn()
    };
    this.shape = z.object({
      id: this.columns.id.shape,
      profileId: this.columns.profileId.shape,
      type: this.columns.type.shape,
      token: this.columns.token.shape,
      secret: this.columns.secret.shape,
      verified: this.columns.verified.shape,
      consumed: this.columns.consumed.shape,
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
      profileId:
        required || typeof value.profileId !== 'undefined' ?
          this.columns.profileId.assert(value.profileId) || undefined
        : undefined,
      type:
        required || typeof value.type !== 'undefined' ?
          this.columns.type.assert(value.type) || undefined
        : undefined,
      token:
        required || typeof value.token !== 'undefined' ?
          this.columns.token.assert(value.token) || undefined
        : undefined,
      secret:
        required || typeof value.secret !== 'undefined' ?
          this.columns.secret.assert(value.secret) || undefined
        : undefined,
      verified:
        required || typeof value.verified !== 'undefined' ?
          this.columns.verified.assert(value.verified) || undefined
        : undefined,
      consumed:
        required || typeof value.consumed !== 'undefined' ?
          this.columns.consumed.assert(value.consumed) || undefined
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
    ) as Partial<Auth>;
    return populate ? this.populate(filtered) : filtered;
  }

  public populate<V extends Record<string, any>>(value: V) {
    return { ...this.defaults, ...value } as typeof this.defaults & V;
  }

  public serialize(value: Record<string, any>) {
    return removeUndefined({
      id: this.columns.id.serialize(value.id),
      profileId: this.columns.profileId.serialize(value.profileId),
      type: this.columns.type.serialize(value.type),
      token: this.columns.token.serialize(value.token),
      secret: this.columns.secret.serialize(value.secret),
      verified: this.columns.verified.serialize(value.verified),
      consumed: this.columns.consumed.serialize(value.consumed),
      active: this.columns.active.serialize(value.active),
      created: this.columns.created.serialize(value.created),
      updated: this.columns.updated.serialize(value.updated)
    });
  }

  public unserialize(value: Record<string, any>) {
    return removeUndefined({
      id: this.columns.id.unserialize(value.id),
      profileId: this.columns.profileId.unserialize(value.profileId),
      type: this.columns.type.unserialize(value.type),
      token: this.columns.token.unserialize(value.token),
      secret: this.columns.secret.unserialize(value.secret),
      verified: this.columns.verified.unserialize(value.verified),
      consumed: this.columns.consumed.unserialize(value.consumed),
      active: this.columns.active.unserialize(value.active),
      created: this.columns.created.unserialize(value.created),
      updated: this.columns.updated.unserialize(value.updated)
    });
  }
}
