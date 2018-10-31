namespace EditorJS {
  export namespace API {}

  export interface API {
    blocks: API.Blocks;
    caret: {};
    events: API.Events;
    listener: API.Listeners;
    sanitizer: API.Sanitizer;
    saver: API.Saver;
    selection: API.Selection;
    styles: API.Styles;
    toolbar: API.Toolbar;
  }
}
