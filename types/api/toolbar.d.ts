/**
 * Describes Toolbar API methods
 */
export interface Toolbar {
  /**
   * Closes Toolbar
   */
  close(): void;

  /**
   * Opens Toolbar
   */
  open(): void;

  on(event: string, callback: (data: any) => void);
  off(event: string, callback: (data: any) => void);
}
