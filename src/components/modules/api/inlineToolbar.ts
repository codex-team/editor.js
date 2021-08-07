import { InlineToolbar } from '../../../../types/api/inline-toolbar';
import Module from '../../__module';

import Toolbar from './../../utils/inlineToolbar';
import ToolsCollection from "../../tools/collection";
import InlineTool from "../../tools/inline";

/**
 * @class InlineToolbarAPI
 * Provides methods for working with the Inline Toolbar
 */
export default class InlineToolbarAPI extends Module {
  /**
   * Available methods
   *
   * @returns {InlineToolbar}
   */
  public get methods(): InlineToolbar {
    return {
      close: (): void => this.close(),
      open: (): void => this.open(),
      bind: (element, tools): void => this.bind(element, tools),
    };
  }

  /**
   * Open Inline Toolbar
   */
  public open(): void {
    this.Editor.InlineToolbar.tryToShow();
  }

  /**
   * Close Inline Toolbar
   */
  public close(): void {
    this.Editor.InlineToolbar.close();
  }

  public bind(element: Element, tools: string[]): void {
    /**
     * Filter available tools to passed names list
     */
    const toolsList = new ToolsCollection<InlineTool>(
      Array.from(this.Editor.Tools.inlineTools.entries())
        .filter(([, tool]) => tools ? tools.includes(tool.name) : true) as [string, InlineTool][]
    );

    const toolbar = new Toolbar({
      element,
      editorWrapper: this.Editor.UI.nodes.wrapper,
      editorContentRect: this.Editor.UI.contentRect,
      isRtl: this.isRtl,
      tools: toolsList,
    });

    // Toolbar.bind(element);
  }
}
