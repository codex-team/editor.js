namespace EditorJS {
  export default interface API {
    blocks: BlocksAPI;
    caret: {};
    events: EventsAPI;
    listener: ListenersAPI;
    sanitizer: SanitizerAPI;
    saver: ISaverAPI;
    selection: ISelectionAPI;
    styles: IStylesAPI;
    toolbar: IToolbarAPI;
  }
}
