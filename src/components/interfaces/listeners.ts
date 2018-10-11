export interface ListenerData {
  element: EventTarget;
  eventType: string;
  handler: (event: Event) => void;
  useCapture: boolean;
}
