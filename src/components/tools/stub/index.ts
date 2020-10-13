import $ from '../../dom';
import { API, BlockTool, BlockToolData, BlockToolConstructorOptions } from '../../../../types';

export interface StubData extends BlockToolData {
  title: string;
  savedData: BlockToolData;
}

/**
 * This tool will be shown in place of a block without corresponding plugin
 * It will store its data inside and pass it back with article saving
 */
export default class Stub implements BlockTool {
  /**
   * Notify core that tool supports read-only mode
   */
  public static isReadOnlySupported = true;

  /**
   * Stub styles
   *
   * @type {{wrapper: string, info: string, title: string, subtitle: string}}
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
   * Editor.js API
   */
  private readonly api: API;

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
   * @param options - constructor options
   * @param options.data - stub tool data
   * @param options.api - Editor.js API
   */
  constructor({ data, api }: BlockToolConstructorOptions<StubData>) {
    this.api = api;
    this.title = data.title || this.api.i18n.t('Error');
    this.subtitle = this.api.i18n.t('The block can not be displayed correctly.');
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
