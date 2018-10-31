import {ToolConfig, ToolData, ToolPreparationData} from '../tools';

/**
 * Abstract interface of all Tools
 */
namespace EditorJS {

  export default interface Tool {

    constructor: ToolConstructable;

    /**
     * Tool`s render method
     * For inline Tools returns inline toolbar button
     * For block Tools returns tool`s wrapper
     */
    render(): HTMLElement;
  }

  export interface ToolConstructable {
    /**
     * Tool name
     */
    name: string;

    /**
     * Define Tool type as Inline
     */
    isInline?: boolean;

    new (config: {api: any}): Tool;

    /**
     * Tool`s prepare method. Can be async
     * @param data
     */
    prepare?(data: ToolPreparationData): void | Promise<void>;
  }
}
