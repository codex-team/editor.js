import { BlockTool } from '../../../../types';

/**
 * In the simplest Contentless Tool (eg. Delimiter) there is no data to save
 */
interface ContentlessToolData {}

/**
 * This tool behaves like a delimiter
 */
export default class ContentlessToolMock implements BlockTool {
  /**
   * Renders a single content editable element as tools element
   */
  public render(): HTMLElement {
    const wrapper = document.createElement('div');

    wrapper.dataset.cyType = 'contentless-tool';

    wrapper.textContent = '***';

    return wrapper;
  }

  /**
   * Save method mock
   */
  public save(): ContentlessToolData {
    return {};
  }

  /**
   * Allow Tool to have no content
   */
  public static get contentless(): boolean {
    return true;
  }
}
