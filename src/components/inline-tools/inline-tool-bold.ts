import InlineTool from './inline-tool';

/**
 * Bold Tool
 *
 * Inline Toolbar Tool
 *
 * Makes selected text more bolder
 */
export default class BoldInlineTool implements InlineTool {

  /**
   * Native Document's command that uses for Bold
   */
  private readonly commandName: string = 'bold';

  /**
   * Styles
   */
  private readonly CSS = {
    button: 'ce-inline-tool',
    buttonActive: 'ce-inline-tool--active',
    buttonModifier: 'ce-inline-tool--bold',
  };

  /**
   * Elements
   */
  private nodes = {
    button: null,
  };

  constructor() {
    console.log('Bold Inline Tool is ready');
  }

  /**
   * Create button for Inline Toolbar
   */
  public render(): HTMLElement {
    this.nodes.button = document.createElement('button');

    this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);

    return this.nodes.button;
  }

  /**
   * Wrap range with <b> tag
   * @param {Range} range
   */
  public surround(range: Range) {
    document.execCommand(this.commandName);
  }

  /**
   * Check selection and set activated state to button if there are <b> tag
   * @param {Selection} selection
   */
  public checkState(selection: Selection): boolean {
    const isActive = document.queryCommandState(this.commandName);

    this.nodes.button.classList.toggle(this.CSS.buttonActive, isActive);
    return isActive;
  }
}
