import IBlocksAPI from './blocks-api';
import ICaretAPI from './caret-api';
import IEventsAPI from './events-api';
import ISanitizerAPI from './sanitizer-api';
import ISaverAPI from './saver-api';
import ISelectionAPI from './selection-api';
import IToolbarAPI from './toolbar-api';
import IListenerAPI from './listener-api';
import IStylesAPI from './styles-api';

/**
 * CodeX Editor Public API
 *
 * @copyright <CodeX Team> 2018
 */
export default interface IAPI {

  blocks: IBlocksAPI;

  caret: ICaretAPI;

  events: IEventsAPI;

  listener: IListenerAPI;

  sanitizer: ISanitizerAPI;

  saver: ISaverAPI;

  selection: ISelectionAPI;

  styles: IStylesAPI;

  toolbar: IToolbarAPI;
}
