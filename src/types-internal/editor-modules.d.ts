/** ./api */
import BlocksAPI from '../components/modules/api/blocks';
import CaretAPI from '../components/modules/api/caret';
import EventsAPI from '../components/modules/api/events';
import I18nAPI from '../components/modules/api/i18n';
import API from '../components/modules/api/index';
import InlineToolbarAPI from '../components/modules/api/inlineToolbar';
import ListenersAPI from '../components/modules/api/listeners';
import NotifierAPI from '../components/modules/api/notifier';
import ReadOnlyAPI from '../components/modules/api/readonly';
import SanitizerAPI from '../components/modules/api/sanitizer';
import SaverAPI from '../components/modules/api/saver';
import SelectionAPI from '../components/modules/api/selection';
import StylesAPI from '../components/modules/api/styles';
import ToolbarAPI from '../components/modules/api/toolbar';
import TooltipAPI from '../components/modules/api/tooltip';
import UiAPI from '../components/modules/api/ui';

/** ./toolbar */
import BlockSettings from '../components/modules/toolbar/blockSettings';
import Toolbar from '../components/modules/toolbar/index';
import InlineToolbar from '../components/modules/toolbar/inline';

/** . */
import BlockEvents from '../components/modules/blockEvents';
import BlockManager from '../components/modules/blockManager';
import BlockSelection from '../components/modules/blockSelection';
import Caret from '../components/modules/caret';
import CrossBlockSelection from '../components/modules/crossBlockSelection';
import DragNDrop from '../components/modules/dragNDrop';
import ModificationsObserver from '../components/modules/modificationsObserver';
import Paste from '../components/modules/paste';
import ReadOnly from '../components/modules/readonly';
import RectangleSelection from '../components/modules/rectangleSelection';
import Renderer from '../components/modules/renderer';
import Saver from '../components/modules/saver';
import Tools from '../components/modules/tools';
import UI from '../components/modules/ui';
import ToolsAPI from '../components/modules/api/tools';

export interface EditorModules {
  // API Modules
  BlocksAPI: BlocksAPI,
  CaretAPI: CaretAPI,
  ToolsAPI: ToolsAPI,
  EventsAPI: EventsAPI,
  I18nAPI: I18nAPI,
  API: API,
  InlineToolbarAPI: InlineToolbarAPI,
  ListenersAPI: ListenersAPI,
  NotifierAPI: NotifierAPI,
  ReadOnlyAPI: ReadOnlyAPI,
  SanitizerAPI: SanitizerAPI,
  SaverAPI: SaverAPI,
  SelectionAPI: SelectionAPI,
  StylesAPI: StylesAPI,
  ToolbarAPI: ToolbarAPI,
  TooltipAPI: TooltipAPI,
  UiAPI: UiAPI,

  // Toolbar Modules
  BlockSettings: BlockSettings,
  Toolbar: Toolbar,
  InlineToolbar: InlineToolbar,

  // Modules
  BlockEvents: BlockEvents,
  BlockManager: BlockManager,
  BlockSelection: BlockSelection,
  Caret: Caret,
  CrossBlockSelection: CrossBlockSelection,
  DragNDrop: DragNDrop,
  ModificationsObserver: ModificationsObserver,
  Paste: Paste,
  ReadOnly: ReadOnly,
  RectangleSelection: RectangleSelection,
  Renderer: Renderer,
  Saver: Saver,
  Tools: Tools,
  UI: UI,
}
