import { OperationType } from './OperationType';

export interface Operation<DATA_TYPE = string> {
  /**
   * Type of the operation
   */
  type: OperationType;

  /**
   * Start index of changes
   */
  index: number;

  /**
   * Changed data
   */
  data: DATA_TYPE;
}
