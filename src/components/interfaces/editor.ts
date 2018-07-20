import BlockEvents from '../modules/block-events';
import InlineToolbar from '../modules/toolbar-inline';
import ListenerAPI from '../modules/api-listener';
import Module from '../__module';
import SanitizerAPI from '../modules/api-sanitizer';
import SaverAPI from '../modules/api-saver';
import SelectionAPI from '../modules/api-selection';
import ToolbarAPI from '../modules/api-toolbar';
import API from '../modules/api';

export default interface IEditor {
  API: API;

  BlockEvents: BlockEvents;

  BlockSettings: Module; // @todo create interface

  BlocksAPI: Module; // @todo create interface

  Caret: Module; // @todo create interface

  Events: Module; // @todo create interface

  EventsAPI: Module; // @todo create interface

  InlineToolbar: InlineToolbar;

  ListenerAPI: ListenerAPI;

  Listeners: Module; // @todo create interface

  Renderer: Module; // @todo create interface

  Sanitizer: Module; // @todo create interface

  SanitizerAPI: SanitizerAPI;

  Saver: Module; // @todo create interface

  SaverAPI: SaverAPI;

  Shortcuts: Module; // @todo create interface

  Toolbar: Module; // @todo create interface

  ToolbarAPI: ToolbarAPI;

  Toolbox: Module; // @todo create interface

  Tools: Module; // @todo create interface

  UI: Module; // @todo create interface
}
