import { EditorConfig } from '../../types/index';
import { EditorEventMap } from '../components/events';
import EventsDispatcher from '../components/utils/events';

/**
 * Describes object passed to Editor modules constructor
 */
export interface ModuleConfig {
  config: EditorConfig;
  eventsDispatcher: EventsDispatcher<EditorEventMap>;
}
