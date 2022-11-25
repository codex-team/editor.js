import $ from '../../components/dom';
import { API, BlockTool, BlockToolConstructorOptions, BlockToolData } from '../../../types';

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
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52"><path fill="#D76B6B" fill-rule="nonzero" d="M26 52C11.64 52 0 40.36 0 26S11.64 0 26 0s26 11.64 26 26-11.64 26-26 26zm0-3.25c12.564 0 22.75-10.186 22.75-22.75S38.564 3.25 26 3.25 3.25 13.436 3.25 26 13.436 48.75 26 48.75zM15.708 33.042a2.167 2.167 0 1 1 0-4.334 2.167 2.167 0 0 1 0 4.334zm23.834 0a2.167 2.167 0 1 1 0-4.334 2.167 2.167 0 0 1 0 4.334zm-15.875 5.452a1.083 1.083 0 1 1-1.834-1.155c1.331-2.114 3.49-3.179 6.334-3.179 2.844 0 5.002 1.065 6.333 3.18a1.083 1.083 0 1 1-1.833 1.154c-.913-1.45-2.366-2.167-4.5-2.167s-3.587.717-4.5 2.167z"/></svg>`;
    const infoContainer = $.make('div', this.CSS.info);
    const title = $.make('div', this.CSS.title, {
      textContent: this.title,
    });
    const subtitle = $.make('div', this.CSS.subtitle, {
      textContent: this.subtitle,
    });

    wrapper.innerHTML = icon;

    infoContainer.appendChild(title);
    infoContainer.appendChild(subtitle);

    wrapper.appendChild(infoContainer);

    return wrapper;
  }
}
