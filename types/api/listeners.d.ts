export interface Listeners {
  on(element: Element, eventType: string, handler: (event?: Event) => void, useCapture?: boolean): void;
  off(element: Element, eventType: string, handler: (event?: Event) => void, useCapture?: boolean): void;
}
