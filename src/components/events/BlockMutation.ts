import { BlockMutationEvent, BlockMutationEventDetail, BlockMutationType } from '../../../types/events/block';

/**
 * CustomEvent describing a change related to a block
 */
export class BlockMutationCustomEvent<Type extends BlockMutationType, Detail extends Extract<BlockMutationEvent, { type: Type }>['detail']> extends CustomEvent<Detail> {
  /**
   * Explicitly specified type of CustomEvent
   */
  public type: Type;

  /**
   * Explicitly specified detail of CustomEvent
   */
  public detail: Detail;

  /**
   * Constructor of custom event related to block mutation
   *
   * @param type - event type
   * @param detail - relate data
   */
  constructor(type: Type, detail: Detail) {
    super(type, {
      detail,
    });
  }
}
