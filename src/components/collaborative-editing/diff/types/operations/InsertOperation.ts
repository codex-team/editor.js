import { Operation } from '../Operation';
import { OperationType } from '../OperationType';

/**
 * Operation of inserting some data inside
 */
export interface InsertOperation<DATA_TYPE = string> extends Operation<DATA_TYPE> {
  type: OperationType.Insert;
}
