/** ./api */
import BlocksAPI from './api/blocks';
import CaretAPI from './api/caret';
import EventsAPI from './api/events';
import I18nAPI from './api/i18n';
import API from './api/index';
import InlineToolbarAPI from './api/inlineToolbar';
import ListenersAPI from './api/listeners';
import NotifierAPI from './api/notifier';
import ReadOnlyAPI from './api/readonly';
import SanitizerAPI from './api/sanitizer';
import SaverAPI from './api/saver';
import SelectionAPI from './api/selection';
import ToolsAPI from './api/tools';
import StylesAPI from './api/styles';
import ToolbarAPI from './api/toolbar';
import TooltipAPI from './api/tooltip';
import UiAPI from './api/ui';

/** ./toolbar */
import BlockSettings from './toolbar/blockSettings';
import Toolbar from './toolbar/index';
import InlineToolbar from './toolbar/inline';

/** . */
import BlockEvents from './blockEvents';
import BlockManager from './blockManager';
import BlockSelection from './blockSelection';
import Caret from './caret';
import CrossBlockSelection from './crossBlockSelection';
import DragNDrop from './dragNDrop';
import ModificationsObserver from './modificationsObserver';
import Paste from './paste';
import ReadOnly from './readonly';
import RectangleSelection from './rectangleSelection';
import Renderer from './renderer';
import Saver from './saver';
import Tools from './tools';
import UI from './ui';

export default {
  // API Modules
  BlocksAPI,
  CaretAPI,
  EventsAPI,
  I18nAPI,
  API,
  InlineToolbarAPI,
  ListenersAPI,
  NotifierAPI,
  ReadOnlyAPI,
  SanitizerAPI,
  SaverAPI,
  SelectionAPI,
  ToolsAPI,
  StylesAPI,
  ToolbarAPI,
  TooltipAPI,
  UiAPI,

  // Toolbar Modules
  BlockSettings,
  Toolbar,
  InlineToolbar,

  // Modules
  BlockEvents,
  BlockManager,
  BlockSelection,
  Caret,
  CrossBlockSelection,
  DragNDrop,
  ModificationsObserver,
  Paste,
  ReadOnly,
  RectangleSelection,
  Renderer,
  Saver,
  Tools,
  UI,
};
