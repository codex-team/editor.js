/**
 * Possible operation types
 */
export enum Operation {
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
  type: Operation.Insert;

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
  type: Operation.Remove;

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
 * @returns {object} object of operation
 */
export function getChangesFromString(str1: string, str2: string): (InsertOperation | RemoveOperation)[] {
  if (str1 === str2) {
    return [];
  }

  const length1 = str1.length,
      length2 = str2.length;

  let left = 0;

  while (str1[left] === str2[left]) {
    left++;
  }

  let right = 0;

  while (str1[length1 - right - 1] === str2[length2 - right - 1]) {
    right++;
  }

  if (left + right < length1 && left + right < length2) {
    const before = str1.slice(left, length1 - right);
    const after = str2.slice(left, length2 - right);

    return [
      {
        type: Operation.Remove,
        from: left,
        data: before,
        length: before.length,
      },
      {
        type: Operation.Insert,
        from: left,
        data: after,
        length: after.length,
      },
    ];
  }

  if (left + right < length2) {
    const data = str2.slice(left, length2 - right + (left + right - length1));

    return [
      {
        type: Operation.Insert,
        from: left,
        data,
        length: data.length,
      },
    ];
  }

  if (left + right < length1) {
    const data = str1.slice(left, length1 - right + (left + right - length2));

    return [
      {
        type: Operation.Remove,
        from: left,
        data,
        length: data.length,
      },
    ];
  }
}
