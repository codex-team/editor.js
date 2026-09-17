import type { BlockTool } from '../../../../types';

/**
 * A composite Tool containing more than one native select.
 */
export default class CompositeSelectTool implements BlockTool {
  /**
   * Render two selects inside a single Tool root.
   */
  public render(): HTMLDivElement {
    const wrapper = document.createElement('div');

    ['first', 'second'].forEach(name => {
      const select = document.createElement('select');

      select.dataset.cy = `${name}-select`;

      ['first', 'second'].forEach(value => {
        const option = document.createElement('option');

        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });

      wrapper.appendChild(select);
    });

    return wrapper;
  }

  /**
   * Save both selected values.
   *
   * @param element - rendered Tool element
   */
  public save(element: HTMLElement): { first: string; second: string } {
    const first = element.querySelector('[data-cy="first-select"]') as HTMLSelectElement;
    const second = element.querySelector('[data-cy="second-select"]') as HTMLSelectElement;

    return {
      first: first.value,
      second: second.value,
    };
  }
}
