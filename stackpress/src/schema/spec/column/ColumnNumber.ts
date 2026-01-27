//stackpress/schema/spec/column
import type Column from './Column.js';

export default class ColumnNumber {
  //column reference
  protected _column: Column;

  /**
   * Returns a char length if ever
   */
  public get chars() {
    //if is.ceq, is.clt, is.cle
    for (const assertion of this._column.assertion.assertions) {
      if (assertion.name === 'ceq') {
        return assertion.args[0] as number;
      } else if (assertion.name === 'clt') {
        return assertion.args[0] as number;
      } else if (assertion.name === 'cle') {
        return assertion.args[0] as number;
      }
    }
    return 255;
  }

  /**
   * Returns the column @max
   * example: @max(100)
   * example: @is.eq(100)
   * example: @is.lt(100)
   * example: @is.le(100)
   */
  public get max() {
    const maxes: number[] = [];
    const max = this._column.attributes.value<number>('max');
    if (typeof max === 'number') {
      maxes.push(max);
    }
    const assertions = this._column.assertion.assertions;
    assertions.forEach(assertion => {
      if (assertion.name === 'eq'
        || assertion.name === 'lt'
        || assertion.name === 'le'
      ) {
        maxes.push(assertion.args[0] as number);
      }
    });
    if (maxes.length > 0) {
      return Math.max(...maxes.filter(number => Number(number)));
    }
    return 0;
  }

  /**
   * Returns the column @min
   * example: @min(100)
   * example: @is.eq(100)
   * example: @is.gt(100)
   * example: @is.ge(100)
   */
  public get min() {
    const mins: number[] = [];
    const min = this._column.attributes.value<number>('min');
    if (typeof min === 'number') {
      mins.push(min);
    }
    const assertions = this._column.assertion.assertions;
    assertions.forEach(assertion => {
      if (assertion.name === 'eq'
        || assertion.name === 'gt'
        || assertion.name === 'ge'
      ) {
        mins.push(assertion.args[0] as number);
      }
    });
    if (mins.length > 0) {
      return Math.min(...mins.filter(number => Number(number)));
    }
    return 0;
  }

  /**
   * Returns the column @step
   * example: @step(0.01)
   */
  public get step() {
    const step = this._column.attributes.value<number>('step');
    if (typeof step === 'number') {
      return step;
    }
    
    const max = this.max;
    const min = this.min;
    //if max has decimals, get the length
    const maxDecimals = max.toString().split('.')[1]?.length || 0;
    //if min has decimals, get the length
    const minDecimals = min.toString().split('.')[1]?.length || 0;
    //which ever is longer that's the step
    const decimalLength = Math.max(maxDecimals, minDecimals);
    //if no decimals
    if (decimalLength === 0) {
      //step is 1 by default
      return 1;
    }
    //convert to 0.001 for example
    return Math.pow(10, -decimalLength);
  }

  /**
   * Sets the column reference
   */
  constructor(column: Column) {
    this._column = column;
  }
};