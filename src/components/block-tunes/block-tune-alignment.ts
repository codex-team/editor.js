/**
 * @class AlignmentCenterTune
 * @classdesc Editor's default tune that aligns blocks
 *
 * @copyright <CodeX Team> 2020
 * @author Sergio Moreno <sergiomorenoalbert@gmail.com>
 */
import { API, BlockTune } from '../../../types';
import $ from '../dom';
import { AlignmentButtonType } from '../../../types/block-tunes';

/**
 *
 */
export default class AlignmentCenterTune implements BlockTune {
  /**
   * Property that contains Editor.js API methods
   *
   * @see {@link docs/api.md}
   */
  private readonly api: API;
  private _state: { elements: HTMLElement[] }

  /**
   * Styles
   */
  private _CSS = {
    button: 'ce-settings__button',
    buttonActive: 'ce-settings__button--active',
  };

  /**
   * AlignCenterTune constructor
   *
   * @param {API} api - Editor's API
   */
  constructor({ api }) {
    this._state = {
      elements: [],
    };
    this.api = api;
  }

  /**
   * Create "Align" button and add click event listener
   *
   * @returns {HTMLElement[]}
   */
  public render(): HTMLElement[] {
    this._state.elements = [
      {
        alignment: 'left',
        icon: 'align-left',
        t: this.api.i18n.t('Align left'),
      },
      {
        alignment: 'center',
        icon: 'align-center',
        t: this.api.i18n.t('Align center'),
      },
      {
        alignment: 'right',
        icon: 'align-right',
        t: this.api.i18n.t('Align right'),
      },
    ].map((el: AlignmentButtonType) => {
      const button = this.createButtons(el);

      return this.findTheSelected(button, el);
    });

    return this._state.elements;
  }

  /**
   * This method searches on blocks if it's aligned, it's useful when opening and closing tunes popup.
   * We can't store the selected option on the class, because reinitializes every time the tune is opened.
   * So if the block, contains align-{left|right|center}, we add active to that element
   *
   * @param {HTMLElement} button - Button element
   * @param {AlignmentButtonType} alignment - Aligment can be left, right or center
   * @returns {HTMLElement}
   */
  private findTheSelected(button: HTMLElement, alignment: AlignmentButtonType): HTMLElement {
    const block = this.api.blocks.getBlockByIndex(this.api.blocks.getCurrentBlockIndex());

    if (block.holder.classList.contains(`align-${alignment.alignment}`)) {
      button.classList.add(this._CSS.buttonActive);

      return button;
    }

    return button;
  }

  /**
   * Align block conditions passed
   *
   * @param {MouseEvent} event - click event
   * @param button - Button element
   * @param elementClicked - BUtton that is clicked on tunes
   */
  private handleClick(event: MouseEvent, button: AlignmentButtonType, elementClicked: HTMLElement): void {
    // we check if the clicked button is the same, for just toggle it.
    // if is not the same, we remove the active status.
    // in this way, we can handle just one click on one aligment at the same time
    this._state.elements = this._state.elements.map(e => {
      if (!e.isEqualNode(elementClicked)) {
        e.classList.remove(this._CSS.buttonActive);
      } else {
        e.classList.toggle(this._CSS.buttonActive);
      }

      return e;
    });

    // we add a class of the aligment of the content block
    this.api.blocks.align(button.alignment);

    this.api.tooltip.hide();

    /**
     * Prevent firing ui~documentClicked that can drop currentBlock pointer
     */
    event.stopPropagation();
  }

  /**
   * Builder for alignment buttons
   *
   * @param {AlignmentButtonType} button - The button element
   * @returns {HTMLElement}
   */
  private createButtons(button: AlignmentButtonType): HTMLElement {
    const element = $.make('div', [ this._CSS.button ], {});

    element.appendChild($.svg(button.icon, 16, 16));
    this.api.listeners.on(element, 'click', (event: MouseEvent) => this.handleClick(event, button, element), false);

    /**
     * Enable tooltip module
     */
    this.api.tooltip.onHover(element, button.t);

    return element;
  }
}
