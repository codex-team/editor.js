import Module from '../../__module';
import { Ui, UiNodes } from '../../../../types/api';

/**
 * API module allowing to access some Editor UI elements
 */
export default class UiAPI extends Module {
  /**
   * Available methods / getters
   */
  public get methods(): Ui {
    return {
      nodes: this.editorNodes,
      /**
       * There can be added some UI methods, like toggleThinMode() etc
       */
    };
  }

  /**
   * Exported classes
   */
  private get editorNodes(): UiNodes {
    return {
      /**
       * Top-level editor instance wrapper
       */
      wrapper: this.Editor.UI.nodes.wrapper,

      /**
       * Element that holds all the Blocks
       */
      redactor: this.Editor.UI.nodes.redactor,
    };
  }
}
