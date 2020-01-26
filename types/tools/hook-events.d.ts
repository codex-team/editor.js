/**
 * Event detail for block relocations
 */
export interface MoveEventDetail {
  /**
   * index the block was moved from
   */
  fromIndex: number
  /**
   * index the block was moved to
   */
  toIndex: number
}

/**
 * Move event for block relocations
 */
export interface MoveEvent {
  readonly detail: MoveEventDetail
}