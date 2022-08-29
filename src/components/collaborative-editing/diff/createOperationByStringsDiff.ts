/**
 * Possible operation types
 */
export enum OperationType {
  /**
   * User inserts symbols
   */
  Insert,

  /**
   * User removes symbols
   */
  Remove,
}

type InsertOperation = {
  type: OperationType.Insert;

  /**
   * Index where user inserted symbols
   */
  from: number;

  /**
   * Which symbols user inserted
   */
  data: string;

  /**
   * Length of inserted data
   */
  length: number;
}

type RemoveOperation = {
  type: OperationType.Remove;

  /**
   * Index where user removed symbols
   */
  from: number;

  /**
   * Which symbols user removed
   */
  data: string;

  /**
   * Length of removed data
   */
  length: number;
}

/**
 * Function finds difference between two different strings
 *
 * @param str1 - original string
 * @param str2 - new string that comes from the first
 *
 * @returns {object[]} array of operations
 */
export function createOperationByStringsDiff(str1: string, str2: string): (InsertOperation | RemoveOperation)[] {
  if (str1 === str2) {
    return [];
  }

  const length1 = str1.length;
  const length2 = str2.length;

  let left = 0;

  while (str1[left] === str2[left]) {
    left++;
  }

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
   * There are differences in two strings. User replaced values by new.
   */
  if (diffLength1 > 0 && diffLength2 > 0) {
    const before = str1.slice(left, length1 - right);
    const after = str2.slice(left, length2 - right);

    return [
      {
        type: OperationType.Remove,
        from: left,
        data: before,
        length: before.length,
      },
      {
        type: OperationType.Insert,
        from: left,
        data: after,
        length: after.length,
      },
    ];
  }

  /**
   * There is a difference only in the second string. Used inserted new values.
   */
  if (diffLength2 > 0) {
    const data = str2.slice(left, length2 - right + (left + right - length1));

    return [
      {
        type: OperationType.Insert,
        from: left,
        data,
        length: data.length,
      },
    ];
  }

  /**
   * There is a difference only in the first string. Used removed values from it.
   */
  if (diffLength1 > 0) {
    const data = str1.slice(left, length1 - right + (left + right - length2));

    return [
      {
        type: OperationType.Remove,
        from: left,
        data,
        length: data.length,
      },
    ];
  }
}
