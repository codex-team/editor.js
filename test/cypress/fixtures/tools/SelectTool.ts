import type { BlockTool } from '../../../../types';

/**
 * A native select without a custom change handler.
 */
export default class SelectTool implements BlockTool {
  /**
   * Render the select as the Tool's root element.
   */
  public render(): HTMLSelectElement {
    const select = document.createElement('select');

    ['first', 'second'].forEach(value => {
      const option = document.createElement('option');

      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });

    return select;
  }

  /**
   * Save the selected value.
   *
   * @param element - rendered Tool element
   */
  public save(element: HTMLElement): { value: string } {
    const select = (element.tagName === 'SELECT' ? element : element.querySelector('select')) as HTMLSelectElement;

    return { value: select.value };
  }
}
