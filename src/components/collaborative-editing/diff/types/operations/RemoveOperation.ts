import { Operation } from '../Operation';
import { OperationType } from '../OperationType';

/**
 * Operation of removing some data
 */
export interface RemoveOperation<DATA_TYPE = string> extends Operation<DATA_TYPE> {
  type: OperationType.Remove;
}
