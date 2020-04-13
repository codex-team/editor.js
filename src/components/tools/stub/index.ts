import $ from '../../dom';
import { BlockTool, BlockToolData } from '../../../../types';

export interface StubData extends BlockToolData{
  title: string;
  savedData: BlockToolData;
}

/**
 *
 */
export default class Stub implements BlockTool {
  /**
   * Stub styles
   *
   * @type {{wrapper: string; info: string; title: string; subtitle: string}}
   */
  private CSS = {
    wrapper: 'ce-stub',
    info: 'ce-stub__info',
    title: 'ce-stub__title',
    subtitle: 'ce-stub__subtitle',
  };

  /**
   * Main stub wrapper
   */
  private readonly wrapper: HTMLElement;

  /**
   * Stub title — tool name
   */
  private readonly title: string;

  /**
   * Stub hint
   */
  private readonly subtitle: string;

  /**
   * Original Tool data
   */
  private readonly savedData: BlockToolData;

  /**
   * @param {BlockToolData} data - stub tool data
   */
  constructor({ data }: {data: StubData}) {
    this.title = data.title || 'Error';
    this.subtitle = 'The block can not be displayed correctly.';
    this.savedData = data.savedData;

    this.wrapper = this.make();
  }

  /**
   * Returns stub holder
   *
   * @returns {HTMLElement}
   */
  public render(): HTMLElement {
    return this.wrapper;
  }

  /**
   * Return original Tool data
   *
   * @returns {BlockToolData}
   */
  public save(): BlockToolData {
    return this.savedData;
  }

  /**
   * Create Tool html markup
   *
   * @returns {HTMLElement}
   */
  private make(): HTMLElement {
    const wrapper = $.make('div', this.CSS.wrapper);
    const icon = $.svg('sad-face', 52, 52);
    const infoContainer = $.make('div', this.CSS.info);
    const title = $.make('div', this.CSS.title, {
      textContent: this.title,
    });
    const subtitle = $.make('div', this.CSS.subtitle, {
      textContent: this.subtitle,
    });

    wrapper.appendChild(icon);

    infoContainer.appendChild(title);
    infoContainer.appendChild(subtitle);

    wrapper.appendChild(infoContainer);

    return wrapper;
  }
}
