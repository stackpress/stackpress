//modules
import type Alter from '@stackpress/inquire/Alter';
import type Create from '@stackpress/inquire/Create';
import type Engine from '@stackpress/inquire/Engine';
import type { Field, QueryObject } from '@stackpress/inquire/types';
import { jsonCompare } from '@stackpress/inquire/helpers';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import type Revisions from 'stackpress-schema/Revisions';
import type Schema from 'stackpress-schema/Schema';
//stackpress-sql
import type {
  DestructiveAlterChanges,
  DestructiveSchemaChanges
} from './types.js';
import {
  arrangeModelSequence,
  makeCreateQuery
} from './transform/helpers.js';

//the built create-table shape used to compare SQL column semantics
type CreateBuild = ReturnType<Create['build']>;

//one loaded schema revision returned by stackpress-schema/Revisions
export type MigrationRevision = NonNullable<
  Awaited<ReturnType<Revisions['read']>>
>;

//one safe one-to-one rename reconciled through Inquire
export type MigrationRename = {
  model: string,
  table: string,
  from: string,
  fromField: string,
  to: string,
  toField: string
};

//one same-shape rename group that cannot be matched safely
export type MigrationRenameAmbiguity = {
  model: string,
  table: string,
  fromFields: string[],
  toFields: string[]
};

//the complete rename decision for one adjacent revision pair
export type MigrationRenamePlan = {
  renames: MigrationRename[],
  ambiguous: MigrationRenameAmbiguity[]
};

//one baseline or adjacent migration produced from revision history
export type Migration = {
  kind: 'baseline' | 'revision',
  from: MigrationRevision | null,
  to: MigrationRevision,
  queries: QueryObject[],
  destructive: DestructiveSchemaChanges,
  renames: MigrationRename[],
  ambiguous: MigrationRenameAmbiguity[],
  warning: string | null
};

//the result of inspecting built table definitions before command policy
export type InspectedSchemaChanges = {
  queries: QueryObject[],
  destructive: DestructiveSchemaChanges
};

//the SQL-relevant field details used for conservative rename matching
type ColumnSignature = {
  field: Field,
  primary: boolean,
  unique: number,
  keys: number,
  foreign: Array<{
    table: string,
    foreign: string,
    delete: string,
    update: string
  }>
};

/**
 * Produces SQL migrations and warning metadata from schema revision history.
 */
export default class Migrations {
  //the Inquire engine that owns diff builders and dialect SQL generation
  public readonly database: Engine;
  //the schema revision collection that owns revision storage and loading
  public readonly revisions: Revisions;

  /**
   * Formats ambiguity findings without deciding whether a command should stop.
   */
  public static formatAmbiguousWarning(
    ambiguous: MigrationRenameAmbiguity[]
  ) {
    if (!ambiguous.length) return null;
    const lines = [
      'Ambiguous field rename detected.',
      'Stackpress found multiple same-shape rename candidates and refused to guess.',
      'Review the pending schema change before executing it against a database.'
    ];

    for (const group of ambiguous) {
      lines.push(
        `- ${group.model}: ${group.fromFields.join(', ')} -> ${group.toFields.join(', ')}`
      );
    }

    return lines.join('\n');
  }

  /**
   * Formats destructive findings without deciding whether a command should stop.
   */
  public static formatDestructiveWarning(
    changes: DestructiveSchemaChanges
  ) {
    if (!Migrations.hasDestructiveChanges(changes)) return null;
    const lines = [
      'Destructive schema changes detected.',
      'This migration removes existing schema pieces and may drop data.'
    ];

    for (const alter of changes.alters) {
      lines.push('', `Table "${alter.table}":`);
      if (alter.changes.fields.length > 0) {
        lines.push(`- Removed fields: ${alter.changes.fields.join(', ')}`);
      }
      if (alter.changes.primary.length > 0) {
        lines.push(
          `- Removed primary keys: ${alter.changes.primary.join(', ')}`
        );
      }
      if (alter.changes.unique.length > 0) {
        lines.push(`- Removed unique keys: ${alter.changes.unique.join(', ')}`);
      }
      if (alter.changes.keys.length > 0) {
        lines.push(`- Removed indexes: ${alter.changes.keys.join(', ')}`);
      }
      if (alter.changes.foreign.length > 0) {
        lines.push(
          `- Removed foreign keys: ${alter.changes.foreign.join(', ')}`
        );
      }
    }

    if (changes.drops.length > 0) {
      lines.push('', `Dropped tables: ${changes.drops.join(', ')}`);
    }

    return lines.join('\n');
  }

  /**
   * Formats all warning metadata for one migration plan.
   */
  public static formatWarning(
    ambiguous: MigrationRenameAmbiguity[],
    destructive: DestructiveSchemaChanges
  ) {
    const warnings = [
      Migrations.formatAmbiguousWarning(ambiguous),
      Migrations.formatDestructiveWarning(destructive)
    ].filter((warning): warning is string => Boolean(warning));
    if (!warnings.length) return null;
    warnings.push(
      'Re-run with `--force` only if you intentionally want to execute these changes.'
    );
    return warnings.join('\n\n');
  }

  /**
   * Returns removed schema pieces that are not equivalent rename replacements.
   */
  public static getDestructiveAlterChanges(
    build: ReturnType<Alter['build']>,
    previous?: CreateBuild,
    current?: CreateBuild
  ) {
    const renamed = build.fields.rename || {};
    return {
      fields: build.fields.remove,
      primary: build.primary.remove.filter(field => {
        const target = renamed[field] || field;
        return !current?.primary.includes(target);
      }),
      unique: Migrations._filterRemovedEntries(
        build.unique.remove,
        previous?.unique,
        current?.unique,
        renamed
      ),
      keys: Migrations._filterRemovedEntries(
        build.keys.remove,
        previous?.keys,
        current?.keys,
        renamed
      ),
      foreign: Migrations._filterRemovedForeignEntries(
        build.foreign.remove,
        previous?.foreign,
        current?.foreign,
        renamed
      )
    } satisfies DestructiveAlterChanges;
  }

  /**
   * Determines whether one table alteration removes schema pieces.
   */
  public static hasDestructiveAlterChanges(
    changes: DestructiveAlterChanges
  ) {
    return Object.values(changes).some(values => values.length > 0);
  }

  /**
   * Determines whether a migration contains destructive alterations or drops.
   */
  public static hasDestructiveChanges(changes: DestructiveSchemaChanges) {
    return changes.alters.length > 0 || changes.drops.length > 0;
  }

  /**
   * Inspects table definitions and always returns their rendered SQL queries.
   */
  public static inspectSchemaChanges(
    database: Engine,
    previous: Create[],
    current: Create[],
    renames: MigrationRename[] = []
  ) {
    const inspected: InspectedSchemaChanges = {
      queries: [],
      destructive: { alters: [], drops: [] }
    };

    for (const schema of current) {
      const table = schema.build().table;
      const before = previous.find(
        candidate => candidate.build().table === table
      );
      if (!before) {
        schema.engine = database;
        inspected.queries.push(...schema.query());
        continue;
      }

      try {
        const alter = database.diff(before, schema);
        for (const rename of renames) {
          if (rename.table === table) {
            alter.renameField(rename.fromField, rename.toField);
          }
        }

        const changes = Migrations.getDestructiveAlterChanges(
          alter.build(),
          before.build(),
          schema.build()
        );
        if (Migrations.hasDestructiveAlterChanges(changes)) {
          inspected.destructive.alters.push({ table, changes });
        }
        inspected.queries.push(...alter.query());
      } catch (error) {
        if (!Migrations.isNoAlterationsError(error)) throw error;
      }
    }

    for (const schema of previous) {
      const table = schema.build().table;
      const after = current.find(
        candidate => candidate.build().table === table
      );
      if (after) continue;
      inspected.destructive.drops.push(table);
      inspected.queries.push(database.dialect.drop(table));
    }

    return inspected;
  }

  /**
   * Determines whether an Inquire alter rendered an expected no-op error.
   */
  public static isNoAlterationsError(error: unknown) {
    return error instanceof Error
      && error.message === 'No alterations made.';
  }

  /**
   * Plans conservative one-to-one renames across adjacent schema revisions.
   */
  public static planRenames(from: Schema, to: Schema) {
    const renames: MigrationRename[] = [];
    const ambiguous: MigrationRenameAmbiguity[] = [];
    const previous = Array.from(from.models.values());
    const current = Array.from(to.models.values());

    for (const after of current) {
      const before = previous.find(
        model => model.name.snakeCase === after.name.snakeCase
      );
      if (!before) continue;

      const beforeBuild = makeCreateQuery(before).build();
      const afterBuild = makeCreateQuery(after).build();
      const removed = Object.keys(beforeBuild.fields).filter(
        name => !afterBuild.fields[name]
      );
      const added = Object.keys(afterBuild.fields).filter(
        name => !beforeBuild.fields[name]
      );
      if (!removed.length || !added.length) continue;

      const matches = new Map<string, string[]>();
      for (const fromField of removed) {
        if (!Migrations._getColumnByField(before, fromField)) continue;
        const signature = Migrations._getColumnSignature(
          beforeBuild,
          fromField
        );
        const candidates = added.filter(toField => {
          return Boolean(Migrations._getColumnByField(after, toField))
            && jsonCompare(
              signature,
              Migrations._getColumnSignature(afterBuild, toField)
            );
        });
        if (candidates.length) matches.set(fromField, candidates);
      }

      const ambiguousFrom = Array.from(matches.entries()).filter(
        ([, candidates]) => candidates.length > 1
      );
      const sharedTargets = new Map<string, string[]>();
      for (const [fromField, candidates] of matches.entries()) {
        if (candidates.length !== 1) continue;
        const toField = candidates[0];
        const sources = sharedTargets.get(toField) || [];
        sources.push(fromField);
        sharedTargets.set(toField, sources);
      }
      const ambiguousTargets = Array.from(sharedTargets.entries()).filter(
        ([, sources]) => sources.length > 1
      );

      if (ambiguousFrom.length || ambiguousTargets.length) {
        ambiguous.push({
          model: after.name.toString(),
          table: after.name.snakeCase,
          fromFields: Array.from(new Set([
            ...ambiguousFrom.map(([fromField]) => fromField),
            ...ambiguousTargets.flatMap(([, sources]) => sources)
          ])).sort(),
          toFields: Array.from(new Set([
            ...ambiguousFrom.flatMap(([, candidates]) => candidates),
            ...ambiguousTargets.map(([toField]) => toField)
          ])).sort()
        });
        continue;
      }

      for (const [fromField, candidates] of matches.entries()) {
        if (candidates.length !== 1) continue;
        const fromColumn = Migrations._getColumnByField(before, fromField);
        const toField = candidates[0];
        const toColumn = Migrations._getColumnByField(after, toField);
        if (!fromColumn || !toColumn) continue;
        renames.push({
          model: after.name.toString(),
          table: after.name.snakeCase,
          from: fromColumn.name.toString(),
          fromField,
          to: toColumn.name.toString(),
          toField
        });
      }
    }

    return { renames, ambiguous } satisfies MigrationRenamePlan;
  }

  /**
   * Composes migration planning around an existing revision collection.
   */
  public constructor(revisions: Revisions, database: Engine) {
    this.database = database;
    this.revisions = revisions;
  }

  /**
   * Returns every baseline and adjacent migration in revision order.
   */
  public async all() {
    await this.revisions.last();
    const migrations: Migration[] = [];
    for (let index = 0; index < this.revisions.size(); index++) {
      const migration = await this.at(index);
      if (migration) migrations.push(migration);
    }
    return migrations;
  }

  /**
   * Returns the baseline or adjacent migration at one target revision index.
   */
  public async at(index: number) {
    if (index < 0) return null;
    await this.revisions.last();
    const to = await this.revisions.index(index);
    if (!to) return null;
    if (index === 0) return this._getBaseline(to);
    const from = await this.revisions.index(index - 1);
    return from ? this._getMigration(from, to) : null;
  }

  /**
   * Returns the latest adjacent migration for live upgrade consideration.
   */
  public async latest() {
    const to = await this.revisions.last();
    const from = await this.revisions.last(-1);
    if (!from || !to) return null;
    return this._getMigration(from, to);
  }

  /**
   * Builds the initial drop-and-create migration for the first revision.
   */
  protected _getBaseline(to: MigrationRevision) {
    const models = to.schema.models.toArray();
    const order = arrangeModelSequence(models);
    const queries: QueryObject[] = [];
    const destructive: DestructiveSchemaChanges = {
      alters: [],
      drops: order.map(model => model.name.snakeCase)
    };

    for (const model of order) {
      queries.push(this.database.dialect.drop(model.name.snakeCase));
    }
    for (const model of [ ...order ].reverse()) {
      const schema = makeCreateQuery(model);
      schema.engine = this.database;
      queries.push(...schema.query());
    }

    return {
      kind: 'baseline',
      from: null,
      to,
      queries,
      destructive,
      renames: [],
      ambiguous: [],
      warning: Migrations.formatWarning([], destructive)
    } satisfies Migration;
  }

  /**
   * Builds one adjacent migration without applying command policy.
   */
  protected _getMigration(
    from: MigrationRevision,
    to: MigrationRevision
  ) {
    const previous = from.schema.models.toArray().map(
      model => makeCreateQuery(model)
    );
    const current = to.schema.models.toArray().map(
      model => makeCreateQuery(model)
    );
    const plan = Migrations.planRenames(from.schema, to.schema);
    const inspected = Migrations.inspectSchemaChanges(
      this.database,
      previous,
      current,
      plan.renames
    );

    return {
      kind: 'revision',
      from,
      to,
      queries: inspected.queries,
      destructive: inspected.destructive,
      renames: plan.renames,
      ambiguous: plan.ambiguous,
      warning: Migrations.formatWarning(
        plan.ambiguous,
        inspected.destructive
      )
    } satisfies Migration;
  }

  /**
   * Consumes equivalent renamed index definitions one-for-one.
   */
  protected static _filterRemovedEntries(
    removed: string[],
    previous: Record<string, string|string[]> | undefined,
    current: Record<string, string|string[]> | undefined,
    renamed: Record<string, string>
  ) {
    if (!previous || !current) return removed;
    const replacements = Object.values(current).map(value => [ value ].flat());
    return removed.filter(name => {
      const source = previous[name];
      if (!source) return true;
      const target = [ source ].flat().map(field => renamed[field] || field);
      const index = replacements.findIndex(value => jsonCompare(target, value));
      if (index === -1) return true;
      replacements.splice(index, 1);
      return false;
    });
  }

  /**
   * Consumes equivalent renamed foreign-key definitions one-for-one.
   */
  protected static _filterRemovedForeignEntries(
    removed: string[],
    previous: CreateBuild['foreign'] | undefined,
    current: CreateBuild['foreign'] | undefined,
    renamed: Record<string, string>
  ) {
    if (!previous || !current) return removed;
    const replacements = Object.values(current);
    return removed.filter(name => {
      const source = previous[name];
      if (!source) return true;
      const target = {
        ...source,
        local: source.local
          ? renamed[source.local] || source.local
          : source.local
      };
      const index = replacements.findIndex(value => jsonCompare(target, value));
      if (index === -1) return true;
      replacements.splice(index, 1);
      return false;
    });
  }

  /**
   * Finds the model column that produced one built SQL field name.
   */
  protected static _getColumnByField(model: Model, field: string) {
    return model.columns.findValue(
      column => column.name.snakeCase === field
    ) || null;
  }

  /**
   * Reduces one built field to the semantics required for rename matching.
   */
  protected static _getColumnSignature(
    build: CreateBuild,
    field: string
  ): ColumnSignature {
    return {
      field: Migrations._normalizeField(build.fields[field]),
      primary: build.primary.includes(field),
      unique: Migrations._getKeyCountForField(build.unique, field),
      keys: Migrations._getKeyCountForField(build.keys, field),
      foreign: Migrations._getForeignForField(build.foreign, field)
    };
  }

  /**
   * Normalizes foreign-key behavior while ignoring the renamed local field.
   */
  protected static _getForeignForField(
    foreign: CreateBuild['foreign'],
    field: string
  ) {
    return Object.values(foreign)
      .filter(relation => relation.local === field)
      .map(relation => ({
        table: relation.table || '',
        foreign: relation.foreign || '',
        delete: relation.delete || '',
        update: relation.update || ''
      }))
      .sort((left, right) => {
        return JSON.stringify(left).localeCompare(JSON.stringify(right));
      });
  }

  /**
   * Counts index-like definitions that include one field.
   */
  protected static _getKeyCountForField(
    entries: Record<string, string|string[]>,
    field: string
  ) {
    return Object.values(entries)
      .filter(value => [ value ].flat().includes(field))
      .length;
  }

  /**
   * Keeps only field properties that affect generated SQL column behavior.
   */
  protected static _normalizeField(field: Field) {
    return {
      type: field.type,
      length: field.length,
      nullable: field.nullable,
      default: field.default,
      autoIncrement: field.autoIncrement,
      attribute: field.attribute,
      comment: field.comment,
      unsigned: field.unsigned
    };
  }
};
