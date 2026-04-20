//node
import path from 'node:path';
//stackpress/lib
import FileLoader from '@stackpress/lib/FileLoader';
//stackpress/idea
import type { 
  Data,
  AttributeValue,
  IdentifierToken,
  LiteralToken,
  DataToken
} from '@stackpress/idea-parser';
import { Lexer, Compiler } from '@stackpress/idea-parser';
import { Transformer } from '@stackpress/idea-transformer';
import definitions, { data, scan } from '@stackpress/idea-parser/definitions';
//src
import Schema from '../src/Schema.js';
import Fieldset from '../src/Fieldset.js';
import { server as http } from '@stackpress/ingest/http';

//--------------------------------------------------------------------//
// Constants

export const cwd = process.cwd();
export const paths = {
  cwd,
  tests: path.join(cwd, 'tests'),
  idea: path.join(cwd, 'tests/fixtures/test.idea'),
  tsconfig: path.join(cwd, 'tsconfig.json'),
  out: path.join(cwd, 'tests/out'),
  client: path.join(cwd, 'tests/out/client'),
  build: path.join(cwd, 'tests/out/build'),
  database: path.join(cwd, 'tests/out/database')
};

//--------------------------------------------------------------------//
// Mocks for stackpress schema

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
        name: name.name,
        type: {
          name: typeName as string,
          required: required as boolean,
          multiple: multiple as boolean
        },
        attributes: {}
      };
    }
    this._lexer.expect('whitespace');
    const attributes = this.toAttributes();
    //then do something with properties
    return {
      name: name.name,
      type: {
        name: typeName as string,
        required: required as boolean,
        multiple: multiple as boolean
      },
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
 * Mocks a fieldset from a name, attributes string and columns strings
 */
export async function mockFieldset(name: string, attr = '', cols: string[] = []) {
  const schema = await mockSchema();
  const parser = new ColumnParser();
  const attributes = attr.length ? parser.load(attr).toAttributes() : {};
  const columns = cols.map(col => parser.load(col).toColumn());
  const fieldset = Fieldset.make(name, attributes, columns);
  fieldset.schema = schema;
  return fieldset;
};

/**
 * Mocks a schema instance
 */
export async function mockSchema() {
  return Schema.make(await mockConfig());
};

/**
 * Mocks a schema instance
 */
export async function mockConfig() {
  const transformer = mockTransformer();
  return await transformer.schema();
};

//--------------------------------------------------------------------//
// Mocks for stackpress server

/**
 * Mocks a server instance
 */
export function mockServer(cwd = paths.tests) {
  return http({ cwd });
};

//--------------------------------------------------------------------//
// Mocks for idea file parser

/**
 * Mocks a transformer instance
 */
export function mockTransformer(
  ideaFile = paths.idea, 
  loader = mockFileLoader()
) {
  return new Transformer(ideaFile, loader);
};

/**
 * Mocks a file loader instance
 */
export function mockFileLoader(server = mockServer()) {
  return new FileLoader(server.loader.fs, server.loader.cwd);
};
