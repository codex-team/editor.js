import { PopoverHeaderParams } from './popover-header.types';
import Dom from '../../../../dom';
import { css } from './popover-header.const';
import { IconChevronLeft } from '@codexteam/icons';
import Listeners from '../../../listeners';

/**
 * Represents popover header ui element
 */
export class PopoverHeader {
  /**
   * Listeners util instance
   */
  private listeners = new Listeners();

  /**
   * Header html elements
   */
  private nodes: {
      root: null | HTMLElement,
      text: null | HTMLElement,
      backButton: null | HTMLElement
    } = {
      root: null,
      text: null,
      backButton: null,
    };

  /**
   * Text displayed inside header
   */
  private readonly text: string;

  /**
   * Back button click handler
   */
  private readonly onBackButtonClick: () => void;

  /**
   * Constructs the instance
   *
   * @param params - popover header params
   */
  constructor({ text, onBackButtonClick }: PopoverHeaderParams) {
    this.text = text;
    this.onBackButtonClick = onBackButtonClick;
    this.make();
  }

  /**
   * Returns popover header root html element
   */
  public getElement(): HTMLElement | null {
    return this.nodes.root;
  }

  /**
   * Destroys the instance
   */
  public destroy(): void {
    this.nodes.root.remove();
    this.nodes.root = null;
    this.nodes.backButton = null;
    this.nodes.text = null;
    this.listeners.removeAll();
    this.listeners.destroy();
  }

  /**
   * Constructs HTML elements corresponding to popover header params
   */
  private make(): void {
    this.nodes.root = Dom.make('div', [ css.root ]);

    this.nodes.backButton = Dom.make('button', [ css.backButton ]);
    this.nodes.backButton.innerHTML = IconChevronLeft;
    this.nodes.root.appendChild(this.nodes.backButton);
    this.listeners.on(this.nodes.backButton, 'click', this.onBackButtonClick);

    this.nodes.text = Dom.make('div', [ css.text ]);
    this.nodes.text.innerText = this.text;
    this.nodes.root.appendChild(this.nodes.text);
  }
}
