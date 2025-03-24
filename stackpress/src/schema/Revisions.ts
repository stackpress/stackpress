//node
import path from 'node:path';
//modules
import glob from 'fast-glob';
//stackpress
import type { SchemaConfig } from '@stackpress/idea-parser/dist/types';
import FileLoader from '@stackpress/lib/dist/system/FileLoader';
//schema
import Registry from './Registry';

export default class Revisions {
  /**
   * Inserts a new schema into the revisions folder. 
   */
  public static insert(
    root: string, 
    loader: FileLoader, 
    schema: SchemaConfig
  ) {
    const revisions = new Revisions(root, loader);
    return revisions.insert(schema);
  }

  //the revisions folder root
  public readonly root: string;
  //the file loader
  public readonly loader: FileLoader;
  //the epochs found in the revisions folder
  protected _epochs: number[] = [];
  
  /**
   * Sets the root and loader. Reads from the root folder
   * and loads the epochs (sorted) into memory.
   */
  constructor(root: string, loader: FileLoader) {
    this.root = root;
    this.loader = loader;
    //if the root folder exists, read the epochs
    if (this.loader.fs.existsSync(this.root)) {
      //ex. [ '1734693964343.json' ]
      const results = glob.sync('*.json', { cwd: this.root });
      //ex. [ 1734693964343 ]
      this._epochs = results.map(
        filename => Number(filename.split('.')[0])
      ).sort();
    }
  }
  
  /**
   * Returns the first epoch found in the revisions folder.
   */
  public first(plus = 0) {
    if (!this._epochs.length) {
      return null;
    }
    return this.index(0 + plus);
  }
  
  /**
   * Returns the epoch at the given index.
   */
  public index(index: number) {
    if (!this._epochs[index]) {
      return null;
    }
    return this.read(this._epochs[index]);
  }

  /**
   * Adds a new schema to the revisions folder 
   * if it's different from the last schema.
   */
  public insert(schema: SchemaConfig) {
    //get the last epoch
    const last = this.last();
    //serialize the last schema
    const from = last ? JSON.stringify(last.schema, null, 2): '';
    //serialize the new schema
    const to = JSON.stringify(schema, null, 2);
    //if they are the same
    if (from === to) {
      //do nothing
      return this;
    }
    //if the root folder doesn't exist
    if (!this.loader.fs.existsSync(this.root)) {
      //create it
      this.loader.fs.mkdirSync(this.root, { recursive: true });
    }
    //add revision file
    const epoch = Date.now();
    this._epochs.push(epoch);
    this.loader.fs.writeFileSync(
      path.join(this.root, `${epoch}.json`),
      to
    );
    return this;
  }

  /**
   * Returns the last epoch found in the revisions folder.
   */
  public last(minus = 0) {
    if (!this._epochs.length) {
      return null;
    }
    return this.index(this._epochs.length - 1 - Math.abs(minus));
  }
  
  /**
   * Returns the meta data for the given epoch.
   */
  public read(epoch: number) {
    if (!this._epochs.includes(epoch)) {
      return null;
    }
    const filename = `${epoch}.json`;
    const filepath = path.join(this.root, filename);
    const schema = this.loader.require(filepath);
    return {
      date: new Date(epoch),
      file: filename,
      path: filepath,
      schema: schema as SchemaConfig,
      registry: new Registry(schema)
    };
  }

  /**
   * Returns the number of epochs found in the revisions folder.
   */
  public size() {
    return this._epochs.length;
  }
}