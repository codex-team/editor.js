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

export interface InsertOperation {
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

export interface RemoveOperation {
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
