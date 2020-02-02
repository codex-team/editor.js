/**
 * Event detail for block relocation
 */
export interface MoveEventDetail {
  /**
   * index the block was moved from
   */
  fromIndex: number;
  /**
   * index the block was moved to
   */
  toIndex: number;
}

/**
 * Move event for block relocation
 */
export interface MoveEvent {
  readonly detail: MoveEventDetail;
}
