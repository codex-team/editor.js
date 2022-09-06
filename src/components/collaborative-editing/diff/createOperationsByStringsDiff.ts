import { InsertOperation, OperationType, RemoveOperation } from './types';

/**
 * Function finds difference between two different strings
 *
 * @param str1 - original string
 * @param str2 - new string that comes from the first
 *
 * @returns {object[]} array of operations
 */
export function createOperationsByStringsDiff(str1: string, str2: string): (InsertOperation<string> | RemoveOperation<string>)[] {
  if (str1 === str2) {
    return [];
  }

  const length1 = str1.length;
  const length2 = str2.length;

  /**
   * Left border of changes
   */
  let left = 0;

  while (str1[left] === str2[left]) {
    left++;
  }

  /**
   * Right border of changes
   */
  let right = 0;

  while (str1[length1 - right - 1] === str2[length2 - right - 1]) {
    right++;
  }

  /**
   * Length of difference in the first string
   */
  const diffLength1 = length1 - left - right;

  /**
   * Length of difference in the second string
   */
  const diffLength2 = length2 - left - right;

  /**
   * There are differences in two strings
   * User replaced values by new
   */
  if (diffLength1 > 0 && diffLength2 > 0) {
    const before = str1.slice(left, length1 - right);
    const after = str2.slice(left, length2 - right);

    return [
      {
        type: OperationType.Remove,
        index: left,
        data: before,
      },
      {
        type: OperationType.Insert,
        index: left,
        data: after,
      },
    ];
  }

  /**
   * There is a difference only in the second string
   * Used inserted new values
   */
  if (diffLength2 > 0) {
    const data = str2.slice(left, length2 - right + (left + right - length1));

    return [
      {
        type: OperationType.Insert,
        index: left,
        data,
      },
    ];
  }

  /**
   * There is a difference only in the first string
   * Used removed values from it
   */
  if (diffLength1 > 0) {
    const data = str1.slice(left, length1 - right + (left + right - length2));

    return [
      {
        type: OperationType.Remove,
        index: left,
        data,
      },
    ];
  }
}
