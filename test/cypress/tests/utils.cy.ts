/* eslint-disable @typescript-eslint/no-empty-function */
import { isFunction } from '../../../src/components/utils';

/**
 * Example of typical synchronous function
 */
function syncFunction(): void {}

/**
 * Example of typical asynchronous function
 */
async function asyncFunction(): Promise<void> {}

const syncArrowFunction = (): void => {};

const asyncArrowFunction = async (): Promise<void> => {};

describe('isFunction function', () => {
  it('should recognize sync functions', () => {
    /**
     * Act
     */
    const commonFunctionResult = isFunction(syncFunction);
    const arrowFunctionResult = isFunction(syncArrowFunction);

    /**
     * Assert
     */
    expect(commonFunctionResult).to.eq(true);
    expect(arrowFunctionResult).to.eq(true);
  });

  it('should recognize async functions', () => {
    /**
     * Act
     */
    const commonFunctionResult = isFunction(asyncFunction);
    const arrowFunctionResult = isFunction(asyncArrowFunction);

    /**
     * Assert
     */
    expect(commonFunctionResult).to.eq(true);
    expect(arrowFunctionResult).to.eq(true);
  });

  it('should return false if it isn\'t a function', () => {
    /**
     * Arrange
     */
    const obj = {};
    const num = 123;
    const str = '123';

    /**
     * Act
     */
    const objResult = isFunction(obj);
    const numResult = isFunction(num);
    const strResult = isFunction(str);

    /**
     * Assert
     */
    expect(objResult).to.eq(false);
    expect(numResult).to.eq(false);
    expect(strResult).to.eq(false);
  });
});
