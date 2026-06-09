//modules
import type Engine from '@stackpress/inquire/Engine';
import Create from '@stackpress/inquire/Create';
import { jsonCompare } from '@stackpress/inquire/helpers';
import type { Field, QueryObject } from '@stackpress/inquire/types';
import { isObject } from '@stackpress/lib/Nest';
//stackpress-schema
import type Model from 'stackpress-schema/Model';
import type Schema from 'stackpress-schema/Schema';
//stackpress-sql
import { makeCreateQuery } from './transform/helpers.js';
//stackpress/sql
import type {
  ColumnSignature,
  CreateBuild,
  ForeignBuild,
  RenameAmbiguity,
  RenamePlan,
  RenamePlanResult,
  RenameRisk,
  StorePath,
  StoreSelector
} from './types.js';

/**
 * Formats an inputted value to an acceptable SQL string
 */
export function toSqlString(value: any, strict: true): string;
export function toSqlString(value: any, strict?: false): string|undefined|null;
export function toSqlString(value: any, strict = false) {
  if (typeof value === 'undefined') {
    return strict ? '' : undefined;
  } else if (value === null) {
    return strict ? '' : null;
  } else if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value.toString() || String(value);
};

/**
 * Formats an inputted value to an acceptable SQL boolean
 */
export function toSqlBoolean(value: any, strict: true): boolean;
export function toSqlBoolean(value: any, strict?: false): boolean|undefined|null;
export function toSqlBoolean(value: any, strict = false) {
  if (typeof value === 'undefined') {
    return strict ? false: undefined;
  } else if (value === null) {
    return strict ? false: null;
  }
  return Boolean(value);
};

/**
 * Formats an inputted value to an acceptable SQL date string
 */
export function toSqlDate(value: any, strict: true): Date;
export function toSqlDate(value: any, strict?: false): Date|null|undefined;
export function toSqlDate(value: any, strict = false) {
  if (!strict) {
    if (typeof value === 'undefined') {
      return undefined;
    } else if (value === null) {
      return null;
    }
  }
  
  let date = value instanceof Date ? value : new Date(value);
  //if invalid date
  if (isNaN(date.getTime())) {
    //soft error
    date = new Date(0);
  }

  return date;
};

/**
 * Formats an inputted value to an acceptable SQL integer
 */
export function toSqlInteger(value: any, strict: true): number;
export function toSqlInteger(value: any, strict?: false): number|null|undefined;
export function toSqlInteger(value: any, strict = false) {
  if (typeof value === 'undefined') {
    return strict ? 0: undefined;
  } else if (value === null) {
    return strict ? 0: null;
  }
  return parseInt(value) || 0;
};

/**
 * Formats an inputted value to an acceptable SQL float
 */
export function toSqlFloat(value: any, strict: true): number;
export function toSqlFloat(value: any, strict?: false): number|null|undefined;
export function toSqlFloat(value: any, strict = false) {
  if (typeof value === 'undefined') {
    return strict ? 0: undefined;
  } else if (value === null) {
    return strict ? 0: null;
  }
  return parseFloat(value) || 0;
};

/**
 * Flattens the entire data into dot notation paths and values. 
 * 
 * For example:
 * { user: { name: 'John', address: { street: '123 Main St' } } }
 * becomes
 * { 'user.name': 'John', 'user.address.street': '123 Main St' }
 * 
 * if arrays flag is true then should also flatten 
 * arrays with the index as the key, for example:
 * { created: [ DateString ], profile: { age: [ 20, 30 ] } }
 * becomes
 * { 'created.0': DateString, 'profile.age.0': 20, 'profile.age.1': 30 }
 * 
 * if array flag is false then should ignore 
 * arrays and not flatten them, for example:
 * { created: [ DateString, DateString ], profile: { age: [ 20, 30 ] } }
 * becomes
 * { created: [ DateString, DateString ], profile.age: [ 20, 30 ] }
 */
export function flatten(
  object: Record<string, unknown>, 
  arrays = false,
  prefix = ''
) {
  const result: Record<string, unknown> = {};
  Object.entries(object).forEach(([ key, value ]) => {
    //append the key to the prefix
    const path = prefix ? `${prefix}.${key}` : key;
    //if the value is an array
    if (Array.isArray(value)) {
      //and if arrays flag
      if (arrays) {
        //then flatten each item in the array with the index as the key
        value.forEach((item, index) => Object.assign(
          result, 
          //recurse
          flatten({ [index]: item }, arrays, path)
        ));
        return;
      }
      result[path] = value;
      return;
    //if the value is a hash object
    } else if (isObject(value) 
      && typeof value === 'object' 
      && value !== null
    ) {
      //recurse and assign the flattened value to the result
      Object.assign(
        result, 
        flatten(value as Record<string, unknown>, arrays, path)
      );
      return;
    }
    result[path] = value;
  });
  return result;
};

/**
 * Converts dot format to snake case (for an SQL query)
 * used by `getColumnInfo()` above
 */
export function getAlias(selector: string) {
  return selector.split('.').map(part => part.trim()
    //replace "someString" to "some_string"
    .replace(/([a-z])([A-Z0-9])/g, '$1_$2')
    //replace multiple lines with a single lines
    .replace(/-{2,}/g, '_')
    //trim lines from the beginning and end of the string
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
  ).join('__');
};

/**
 * Formats a StorePath to an alias format for SQL queries. For example:
 * 
 * {
 *   selector: [ 'auth', 'user_profile' ],
 *   parents: [ 'auth' ],
 *   navigation: [ 'auth', 'user_profile', 'address_location' ],
 *   table: 'user_profile',
 *   column: 'address_location',
 *   json: [ 'references', 'google_id' ]
 * }
 * becomes
 * {
 *   format: 'auth__user_profile__address_location__references__google_id',
 *   selector: [ 'auth', 'user_profile' ],
 *   parents: [ 'auth' ],
 *   navigation: [ 'auth', 'user_profile', 'address_location' ],
 *   table: 'user_profile',
 *   column: 'address_location'
 * }
 */
export function storePathToAlias(path: StorePath) {
  return {
    //feedback_note__author__data__references__google_id
    expression: [ 
      ...path.selector, 
      ...path.json 
    ].filter(Boolean).map(getAlias).join('__'),
    //[ feedback_note, author, data ]
    selector: [ ...path.selector ].map(getAlias),
    //[ category, article ]
    parents: [ ...path.parents ].map(getAlias),
    //ratings
    table: getAlias(path.table),
    //feedback_note
    column: getAlias(path.column),
    //[ author, data ]
    children: [ ...path.children ].map(getAlias)
  };
};

/**
 * Formats a StoreSelector to an SQL selector string. For example:
 * {
 *   parents: [ 'auth' ],
 *   column: 'address_location',
 *   json: [ 'references', 'google_id' ]
 * }
 * becomes
 * auth.address_location:references.google_id 
 */
export function storeSelectorToSqlSelector(selector: StoreSelector, q = '"') {
  //auth__user_profile
  const table = selector.parents.join('__') || selector.table;
  //address_location
  const column = selector.column;
  //references.googleId
  const json = selector.json.join('.');
  //if no column, skip
  if (!column) return null;
  return table.length > 0 && json.length > 0
    //auth__user_profile.address_location:references.googleId
    ? `${table}.${column}:${json}`
    : table.length > 0
    //auth__user_profile.address_location
    ? `${q}${table}${q}.${q}${column}${q}`
    : json.length > 0
    //address_location:references.googleId
    ? `${column}:${json}`
    //address_location
    : `${q}${column}${q}`;
};

/**
 * Plan safe one-to-one column renames by comparing adjacent schema revisions.
 */
export function planColumnRenames(from: Schema, to: Schema) {
  const renames: RenamePlan[] = [];
  const ambiguous: RenameAmbiguity[] = [];
  //only compare models that existed before and still exist after the change
  const previous = Array.from(from.models.values());
  const current = Array.from(to.models.values());

  for (const after of current) {
    //the table identity is anchored on the model snake_case name
    const before = previous.find(
      model => model.name.snakeCase === after.name.snakeCase
    );
    if (!before) continue;

    //compare the built SQL definitions instead of the raw idea fields so the
    //risk check matches the actual migration output
    const beforeBuild = makeCreateQuery(before).build();
    const afterBuild = makeCreateQuery(after).build();
    //a rename candidate looks like one field disappearing and another appearing
    const removed = Object.keys(beforeBuild.fields).filter(
      name => !afterBuild.fields[name]
    );
    const added = Object.keys(afterBuild.fields).filter(
      name => !beforeBuild.fields[name]
    );
    if (!removed.length || !added.length) continue;

    //collect every same-shape candidate first so we can reject ambiguous groups
    //before planning any live rename query.
    const matches = new Map<string, string[]>();
    for (const fromField of removed) {
      //if the removed field cannot be traced back to a model column, skip it
      const fromColumn = getColumnByField(before, fromField);
      if (!fromColumn) continue;
      //capture the structural SQL signature of the removed field so we can
      //look for an added field that behaves the same
      const fromSignature = getColumnSignature(beforeBuild, fromField);

      const candidates = added.filter(toField => {
        //ignore generated fields we cannot map back to model columns cleanly
        const toColumn = getColumnByField(after, toField);
        if (!toColumn) return false;
        //if the signatures match, this looks like a rename rather than a
        //genuine drop and unrelated add
        return jsonCompare(
          fromSignature,
          getColumnSignature(afterBuild, toField)
        );
      });
      if (candidates.length > 0) {
        matches.set(fromField, candidates);
      }
    }

    //if any removed field matches more than one added field, stop and ask the
    //caller to fail safe instead of guessing which rename to preserve.
    const ambiguousFrom = Array.from(matches.entries()).filter(
      ([, candidates]) => candidates.length > 1
    );

    //also reject cases where two removed fields both point at the same target.
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

    if (ambiguousFrom.length > 0 || ambiguousTargets.length > 0) {
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

    //once the candidate graph is unambiguous, promote the one-to-one matches
    //into the rename plan shared by push and migrate.
    for (const [fromField, candidates] of matches.entries()) {
      if (candidates.length !== 1) continue;
      const fromColumn = getColumnByField(before, fromField);
      const toField = candidates[0];
      const toColumn = getColumnByField(after, toField);
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

  return {
    ambiguous,
    renames
  } satisfies RenamePlanResult;
}

/**
 * Format one user-facing error when rename candidates are too ambiguous to
 * preserve safely without guesswork.
 */
export function formatAmbiguousRenameMessage(ambiguous: RenameAmbiguity[]) {
  //no findings means no warning text
  if (!ambiguous.length) return '';
  //lead with the behavior change that matters: Stackpress found rename-like
  //changes, but there is not enough evidence to preserve them automatically.
  const lines = [
    'Ambiguous field rename detected.',
    'Stackpress found multiple same-shape rename candidates and refused to guess.',
    'Review the pending schema change and re-run with `--force` only if you intend to accept the destructive diff.'
  ];

  for (const group of ambiguous) {
    //show the removed and added SQL keys together so the caller can find the
    //conflict in idea files and in generated migration output.
    lines.push(
      `- ${group.model}: ${group.fromFields.join(', ')} -> ${group.toFields.join(', ')}`
    );
  }

  return lines.join('\n');
}

/**
 * Keep the old rename-risk export available while reusing the new planner.
 */
export function findLikelyRenameRisks(from: Schema, to: Schema) {
  return planColumnRenames(from, to).renames;
}

/**
 * Keep the older risk-message export available for callers that still use it.
 */
export function formatRenameRiskMessage(risks: RenameRisk[]) {
  if (!risks.length) return '';
  const lines = [
    'Potential destructive field rename detected.',
    'Running `stackpress push` now would drop the old column and add a new one, which can erase populated values.',
    'Back up the database before continuing.'
  ];

  for (const risk of risks) {
    lines.push(
      `- ${risk.model}: ${risk.from} (${risk.fromField}) -> ${risk.to} (${risk.toField})`
    );
  }

  lines.push('Re-run with `--force` only if you intend to accept the data-loss risk.');
  return lines.join('\n');
}

/**
 * Build raw rename statements for the active SQL dialect.
 */
export function makeRenameQueries(database: Engine, renames: RenamePlan[]) {
  const dialect = database.dialect?.constructor?.name?.toLowerCase() || '';
  const quote = dialect.includes('mysql') ? '`' : '"';

  return renames.map<QueryObject>(rename => ({
    query: [
      `ALTER TABLE ${quote}${rename.table}${quote}`,
      `RENAME COLUMN ${quote}${rename.fromField}${quote}`,
      `TO ${quote}${rename.toField}${quote}`
    ].join(' ')
  }));
}

/**
 * Rebuild one create-table query after applying the planned field renames.
 */
export function rewriteCreateQueryWithRenames(
  schema: ReturnType<typeof makeCreateQuery>,
  renames: RenamePlan[]
) {
  const build = schema.build();
  const relevant = renames.filter(rename => rename.table === build.table);
  if (relevant.length === 0) return schema;

  const mapping = Object.fromEntries(
    relevant.map(rename => [ rename.fromField, rename.toField ])
  );

  return createQueryFromBuild(rewriteCreateBuild(build, mapping));
}

/**
 * Find the schema column object that produced a given built SQL field name.
 */
function getColumnByField(model: Model, field: string) {
  return model.columns.findValue(
    column => column.name.snakeCase === field
  ) || null;
}

/**
 * Reduce one built field into the parts that matter for rename-risk matching.
 */
function getColumnSignature(build: CreateBuild, field: string): ColumnSignature {
  return {
    //normalize the base field shape first so unrelated builder metadata does
    //not affect the comparison
    field: normalizeField(build.fields[field]),
    //primary key membership changes the migration semantics, so keep it
    primary: build.primary.includes(field),
    //keep the participation count, but ignore generated index names that only
    //change because the field name changed.
    unique: getKeyCountForField(build.unique, field),
    keys: getKeyCountForField(build.keys, field),
    //foreign key shape also matters because it changes referential behavior
    foreign: getForeignForField(build.foreign, field)
  };
}

/**
 * Collect normalized foreign-key definitions that use the target local field.
 */
function getForeignForField(
  foreign: Record<string, ForeignBuild>,
  field: string
) {
  return Object.values(foreign).map(relation => ({
    relation,
    usesField: relation.local === field
  }))
    //only foreign-key relations attached to this local field are relevant
    .filter(({ usesField }) => usesField)
    .map(({ relation }) => ({
      //fill missing pieces with empty strings so comparisons stay stable.
      table: relation.table || '',
      foreign: relation.foreign || '',
      delete: relation.delete || '',
      update: relation.update || ''
    }))
    //sort for deterministic comparisons when relation declaration order varies
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

/**
 * Count how many index-like definitions include the target field.
 */
function getKeyCountForField(
  entries: Record<string, string|string[]>,
  field: string
) {
  return Object.values(entries)
    //keys may be declared as one field or many, so normalize before checking
    .filter(value => [ value ].flat().includes(field))
    .length;
}

/**
 * Keep only the field properties that affect the generated SQL column shape.
 */
function normalizeField(field: Field) {
  return {
    //type and length describe the core storage format
    type: field.type,
    length: field.length,
    //nullable and default influence generated migration behavior
    nullable: field.nullable,
    default: field.default,
    //the remaining flags can change how the database creates the column
    autoIncrement: field.autoIncrement,
    attribute: field.attribute,
    comment: field.comment,
    unsigned: field.unsigned
  };
}

/**
 * Rebuild one create-table definition after renaming its field references.
 */
function rewriteCreateBuild(
  build: CreateBuild,
  mapping: Record<string, string>
) {
  return {
    ...build,
    fields: Object.fromEntries(
      Object.entries(build.fields).map(([name, field]) => [
        renameField(name, mapping),
        field
      ])
    ),
    primary: build.primary.map(field => renameField(field, mapping)),
    unique: renameKeyEntries(build.unique, mapping),
    keys: renameKeyEntries(build.keys, mapping),
    foreign: Object.fromEntries(
      Object.entries(build.foreign).map(([name, relation]) => [
        name,
        {
          ...relation,
          local: relation.local
            ? renameField(relation.local, mapping)
            : relation.local
        }
      ])
    )
  };
}

/**
 * Build a fresh Create query from one create-table build snapshot.
 */
function createQueryFromBuild(build: CreateBuild) {
  const schema = new Create(build.table);

  for (const [field, definition] of Object.entries(build.fields)) {
    schema.addField(field, { ...definition } as Field);
  }

  for (const field of build.primary) {
    schema.addPrimaryKey(field);
  }

  for (const [name, fields] of Object.entries(build.unique)) {
    schema.addUniqueKey(name, fields);
  }

  for (const [name, fields] of Object.entries(build.keys)) {
    schema.addKey(name, fields);
  }

  for (const [name, relation] of Object.entries(build.foreign)) {
    schema.addForeignKey(name, { ...relation });
  }

  return schema;
}

/**
 * Rename every field reference inside one index map while preserving key names.
 */
function renameKeyEntries(
  entries: Record<string, string|string[]>,
  mapping: Record<string, string>
) {
  return Object.fromEntries(
    Object.entries(entries).map(([name, value]) => [
      name,
      [ value ].flat().map(field => renameField(field, mapping))
    ])
  ) as Record<string, string[]>;
}

/**
 * Resolve one field name through the active rename mapping.
 */
function renameField(field: string, mapping: Record<string, string>) {
  return mapping[field] || field;
}
