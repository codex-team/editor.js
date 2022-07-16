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

  /**
   * User replaces symbols
   */
  Replace
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

type ReplaceOperation = {
  type: Operation.Replace;

  /**
   * Index where user replaced symbols
   */
  from: number;
  data: {
    /**
     * Replaced data
     */
    before: string;

    /**
     * New data
     */
    after: string;
  };
  length: {
    /**
     * Length of replaced data
     */
    before: number;

    /**
     * Length of new data
     */
    after: number;
  };
}

/**
 * Function finds difference between two different strings
 *
 * @param str1 - original string
 * @param str2 - new string that comes from the first
 *
 * @returns {object} object of operation
 */
export function getChangesFromString(str1: string, str2: string): InsertOperation | RemoveOperation | ReplaceOperation {
  const length1 = str1.length,
      length2 = str2.length;

  let left1 = 0,
      left2 = 0;

  while (str1[left1] === str2[left2]) {
    left1++;
    left2++;
  }

  let right1 = 0,
      right2 = 0;

  while (str1[length1 - right1 - 1] === str2[length2 - right2 - 1]) {
    right1++;
    right2++;
  }

  if (left1 + right1 < length1 && left2 + right2 < length2) {
    const before = str1.slice(left1, length1 - right1);
    const after = str2.slice(left2, length2 - right2);

    return {
      type: Operation.Replace,
      from: left1,
      data: {
        before,
        after,
      },
      length: {
        before: before.length,
        after: after.length,
      },
    };
  }

  if (left2 + right2 < length2) {
    const data = str2.slice(left2, length2 - right2 + (left1 + right1 - length1));

    return {
      type: Operation.Insert,
      from: left2,
      data,
      length: data.length,
    };
  }

  if (left1 + right1 < length1) {
    const data = str1.slice(left1, length1 - right1 + (left2 + right2 - length2));

    return {
      type: Operation.Remove,
      from: left1,
      data,
      length: data.length,
    };
  }
}
