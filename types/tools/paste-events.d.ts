/**
 * Event detail for tag substitution on paste
 */
export interface HTMLPasteEventDetail {
  /**
   * Pasted element
   */
  data: HTMLElement;
}

/**
 * Paste event for tag substitution
 */
export interface HTMLPasteEvent extends CustomEvent {
  readonly detail: HTMLPasteEventDetail;
}

/**
 * Event detail for file substitution on paste
 */
export interface FilePasteEventDetail {
  /**
   * Pasted file
   */
  file: File;
}

export interface FilePasteEvent extends CustomEvent {
  readonly detail: FilePasteEventDetail;
}

/**
 * Event detail for pattern substitution on paste
 */
export interface PatternPasteEventDetail {
  /**
   * Pattern key
   */
  key: string;

  /**
   * Pasted string
   */
  data: string;
}

export interface PatternPasteEvent extends CustomEvent {
  readonly detail: PatternPasteEventDetail;
}

export type PasteEvent = HTMLPasteEvent | FilePasteEvent | PatternPasteEvent;
export type PasteEventDetail = HTMLPasteEventDetail | FilePasteEventDetail | PatternPasteEventDetail;
