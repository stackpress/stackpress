//modules
import DataSet from '@stackpress/lib/Set';
//stackpress/schema
import type { ColumnAssertion as Assertion } from '../../types.js';
//stackpress/schema/spec/column
import type Column from './Column.js';

export default class ColumnAssertion {
  //column reference
  protected _column: Column;

  /**
   * Returns the assertion attributes of the column
   */
  public get attributes() {
    return this._column.attributes.filter(
      attribute => attribute.assertion.defined
    );
  }

  /**
   * Returns a collection of assertions to use with this column
   */
  public get assertions() {
    const assertions = new DataSet<Assertion>();
    const defaults = this._column.type.assertions;
    //explicit validators
    for (const attribute of this.attributes.values()) {
      const assertion = attribute.assertion.definition!;
      //get the raw arguments
      const args = attribute.args;
      //the last argument is the message
      const message = typeof args[args.length - 1] === 'string' 
        ? args.pop() as string
        : assertion.message;
      assertions.add({ 
        name: assertion.name, 
        import: assertion.import,
        args, 
        message 
      });
    }
    return defaults
      //remove the default assertions that are already defined
      .filter(defaultAssert => !assertions.findValue(
        assert => assert.name === defaultAssert.name
      ))
      .toArray()
      //then add explicit assertions
      .concat(assertions.toArray());
  }

  /**
   * Sets the column reference
   */
  constructor(column: Column) {
    this._column = column;
  }
};