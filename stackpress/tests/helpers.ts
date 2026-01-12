//modules
import type { 
  Data,
  ColumnConfig,
  AttributeValue,
  IdentifierToken,
  LiteralToken,
  DataToken
} from '@stackpress/idea-parser';
import { Lexer, Compiler } from '@stackpress/idea-parser';
import definitions, { data, scan } from '@stackpress/idea-parser/definitions';
//tests
import schema from './fixtures/schema.js';
//src
import Registry from '../src/schema/Registry.js';
import Column from '../src/schema/spec/Column.js';
import Fieldset from '../src/schema/spec/Fieldset.js';
import Model from '../src/schema/spec/Model.js';

export { schema };

export const auth = schema.model!.Auth;
export const profile = schema.model!.Auth;
export const registry = new Registry(schema);

export const mocks = {
  auth: {
    schema: auth,
    columns: Object.fromEntries(auth.columns.map(
      column => [ column.name, column ]
    )),
    fieldset: new Fieldset(
      registry, 
      auth.name, 
      auth.attributes, 
      auth.columns
    )
  },
  profile: {
    schema: profile,
    columns: Object.fromEntries(profile.columns.map(
      column => [ column.name, column ]
    )),
    fieldset: new Fieldset(
      registry, 
      profile.name, 
      profile.attributes, 
      profile.columns
    )
  }
};

/**
 * A tricky string to parse column parser for tests
 */
export class ColumnParser {
  protected _lexer: Lexer;
  protected _code = '';

  constructor() {
    this._lexer = new Lexer();
    //add definitions
    Object.keys(definitions).forEach((key) => {
      this._lexer.define(key, definitions[key]);
    });
    this._lexer.define('Type', (code, index) => {
      const regexp = /^[A-Z][a-zA-Z0-9_]*((\[\])|\?)?/;
      const results = scan('Literal', regexp, code, index);
      if (results) {
        const square = code.substring(
          results.end, 
          results.end + 2
        );
        if (results.end > index && square === '[]') {
          results.end += 2;
          results.value += square;
        }
        results.raw = `"${results.value}"`;
      }
      return results;
    }); 
    this._lexer.define('TypeWord', (code, index) => scan(
      '_TypeWord', 
      /^type/, 
      code, 
      index
    ));
  }

  /**
   * Loads code into the lexer
   */
  public load(code: string, start = 0) {
    this._code = code;
    this._lexer.load(code, start);
    return this;
  }

  /**
   * Consumes non code
   */
  public noncode() {
    while(this._lexer.optional(['whitespace', 'comment', 'note']));
  }

  /**
   * Builds the attributes syntax
   * ex. @id("foo" "bar") ...
   */
  public toAttributes() {
    const attributes: Record<string, AttributeValue> = {};
    //foo String @id("foo" "bar") ...
    this.dotry(() => {
      const attribute = this.toAttribute();
      attributes[attribute.name] = attribute.args.length > 0 
        ? attribute.args
        : true;
      this.noncode();
    });
    return attributes;
  }

  /**
   * Builds the attribute syntax
   * ex. @id("foo" "bar")
   */
  public toAttribute() {
    // @id
    const key = this._lexer.expect<IdentifierToken>('AttributeIdentifier');
    key.name = key.name.slice(1);
    const args: Data[] = [];
    // @id(
    if (this._lexer.optional('(')) {
      this.noncode();
      // @id("foo" "bar"
      //keep parsing data until we reach the end
      let results: DataToken|undefined;
      do {
        results = this._lexer.optional<DataToken>([ ...data, 'CapitalIdentifier' ]);
        if (results) {
          args.push(Compiler.data(results));
          this.noncode();
          continue;
        }
      } while(results);
      // @id("foo" "bar")
      this._lexer.expect(')');
    }
    return { name: key.name, args };
  }

  /**
   * Builds the column syntax
   * ex. foo String[] @is.required 
   */
  public toColumn() {
    //foo
    const name = this._lexer.expect<IdentifierToken>('CamelIdentifier');
    this._lexer.expect('whitespace');
    //foo String
    //foo String?
    //foo String[]
    const type = this._lexer.expect<LiteralToken>('Type');
    const required = !type.value.endsWith('?');
    const multiple = type.value.endsWith('[]');
    const typeName = multiple 
      ? type.value.slice(0, type.value.length - 3) 
      : !required
      ? type.value.slice(0, type.value.length - 2)
      : type.value;
    if (this._lexer.index >= this._code.length) {
      return {
        type: typeName,
        name: name.name,
        required,
        multiple,
        attributes: {}
      };
    }
    this._lexer.expect('whitespace');
    const attributes = this.toAttributes();
    //then do something with properties
    return {
      type: typeName,
      name: name.name,
      required,
      multiple,
      attributes
    }
  }

  /**
   * Wrapper for do-try-catch-while
   */
  public dotry(callback: () => void) {
    do {
      try {
        callback();
      } catch(error) {
        break;
      }
    } while(true);
  }
};

/**
 * Mocks a column from a code string
 */
export function mockColumn(code: string) {
  const { profile } = mocks;
  const parser = new ColumnParser();
  return new Column(profile.fieldset, parser.load(code).toColumn());
};

/**
 * Mocks a fieldset from a name, attributes string and columns strings
 */
export function mockFieldset(name: string, attr = '', cols: string[] = []) {
  const parser = new ColumnParser();
  const attributes = attr.length ? parser.load(attr).toAttributes() : {};
  const columns = cols.map(col => parser.load(col).toColumn());
  return new Fieldset(registry, name, attributes, columns);
};

/**
 * Mocks a model from a name, attributes string and columns strings
 */
export function mockModel(name: string, attr = '', cols: string[] = []) {
  const parser = new ColumnParser();
  const attributes = attr.length ? parser.load(attr).toAttributes() : {};
  const columns = cols.map(col => parser.load(col).toColumn());
  return new Model(registry, name, attributes, columns);
};