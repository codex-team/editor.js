import SelectionUtils from '../selection';
import * as _ from '../utils';
import type { InlineTool, SanitizerConfig, API } from '../../../types';
import type { Notifier, Toolbar, I18n, InlineToolbar } from '../../../types/api';
import { IconLink, IconUnlink } from '@codexteam/icons';
import { createFakeSelection } from '../utils/selection';

/**
 * Link Tool
 *
 * Inline Toolbar Tool
 *
 * Wrap selected text with <a> tag
 */
export default class LinkInlineTool implements InlineTool {
  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @returns {boolean}
   */
  public static isInline = true;

  /**
   * Title for hover-tooltip
   */
  public static title = 'Link';

  /**
   * Sanitizer Rule
   * Leave <a> tags
   *
   * @returns {object}
   */
  public static get sanitize(): SanitizerConfig {
    return {
      a: {
        href: true,
        target: '_blank',
        rel: 'nofollow',
      },
    } as SanitizerConfig;
  }

  /**
   * Native Document's commands for link/unlink
   */
  private readonly commandLink: string = 'createLink';
  private readonly commandUnlink: string = 'unlink';

  /**
   * Enter key code
   */
  private readonly ENTER_KEY: number = 13;

  /**
   * Styles
   */
  private readonly CSS = {
    button: 'ce-inline-tool',
    buttonActive: 'ce-inline-tool--active',
    buttonModifier: 'ce-inline-tool--link',
    buttonUnlink: 'ce-inline-tool--unlink',
    input: 'ce-inline-tool-input',
    inputShowed: 'ce-inline-tool-input--showed',
  };

  /**
   * Elements
   */
  private nodes: {
    button: HTMLButtonElement;
    input: HTMLInputElement;
  } = {
      button: null,
      input: null,
    };

  /**
   * SelectionUtils instance
   */
  private selection = new SelectionUtils();

  /**
   * Input opening state
   */
  private inputOpened = false;

  /**
   * Available Toolbar methods (open/close)
   */
  private toolbar: Toolbar;

  /**
   * Available inline toolbar methods (open/close)
   */
  private inlineToolbar: InlineToolbar;

  /**
   * Notifier API methods
   */
  private notifier: Notifier;

  /**
   * I18n API
   */
  private i18n: I18n;

  private fakeSelectionRestore: null | ((onlyUnwrap?: boolean) => void) = null;

  private currentAnchorElement: HTMLAnchorElement | null = null;

  /**
   * @param api - Editor.js API
   */
  constructor({ api }: { api: API }) {
    this.toolbar = api.toolbar;
    this.inlineToolbar = api.inlineToolbar;
    this.notifier = api.notifier;
    this.i18n = api.i18n;
  }

  /**
   * Create button for Inline Toolbar
   */
  public render(): HTMLElement {
    this.nodes.button = document.createElement('button') as HTMLButtonElement;
    this.nodes.button.type = 'button';
    this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);

    this.nodes.button.innerHTML = IconLink;

    return this.nodes.button;
  }

  /**
   * Input for the link
   */
  public renderActions(): HTMLElement {
    this.nodes.input = document.createElement('input') as HTMLInputElement;
    this.nodes.input.placeholder = this.i18n.t('Add a link');
    this.nodes.input.enterKeyHint = 'done';
    this.nodes.input.classList.add(this.CSS.input);
    this.nodes.input.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === this.ENTER_KEY) {
        this.enterPressed(event);
      }
    });

    return this.nodes.input;
  }

  /**
   * Handle clicks on the Inline Toolbar icon
   *
   * @param {Range} range - range to wrap with link
   */
  public surround(range: Range): void {
    console.log('surround');

    /**
     * Range will be null when user makes second click on the 'link icon' to close opened input
     */
    if (range) {
      /**
       * Save selection before change focus to the input
       */
      if (!this.inputOpened) {
        /** Create blue background instead of selection */
        // this.selection.setFakeBackground();
        // this.selection.save();

        this.fakeSelectionRestore = createFakeSelection();
      } else {
        this.fakeSelectionRestore?.();
        // this.selection.restore();
        // this.selection.removeFakeBackground();
      }
      const parentAnchor = this.selection.findParentTag('A');

      /**
       * Unlink icon pressed
       */
      if (parentAnchor) {
        this.selection.expandToTag(parentAnchor);
        this.unlink();
        // this.closeActions();
        // this.checkState();
        // this.toolbar.close();

        return;
      }
    }

    this.toggleActions();
  }

  /**
   * Check selection and set activated state to button if there are <a> tag
   */
  public checkState(): boolean {
    // console.trace('checkState');
    const anchorTag = this.selection.findParentTag('A') as HTMLAnchorElement;

    if (anchorTag !== null) {
      this.nodes.button.innerHTML = IconUnlink;
      this.nodes.button.classList.add(this.CSS.buttonUnlink);
      this.nodes.button.classList.add(this.CSS.buttonActive);

      this.selection.expandToTag(anchorTag);
      // console.log('1');

      this.fakeSelectionRestore = createFakeSelection();
      this.openActions();

      /**
       * Fill input value with link href
       */
      const hrefAttr = anchorTag.getAttribute('href');

      this.nodes.input.value = hrefAttr !== 'null' ? hrefAttr : '';

      this.currentAnchorElement = anchorTag;

      // this.selection.save();
    } else {
      this.nodes.button.innerHTML = IconLink;
      this.nodes.button.classList.remove(this.CSS.buttonUnlink);
      this.nodes.button.classList.remove(this.CSS.buttonActive);
    }

    return anchorTag !== null;
  }

  /**
   * Function called with Inline Toolbar closing
   */
  public clear(): void {
    // this.fakeSelectionRestore?.(true);
    if (this.inputOpened) {
      this.closeActions();
    }
  }

  /**
   * Set a shortcut
   */
  public get shortcut(): string {
    return 'CMD+K';
  }

  /**
   * Show/close link input
   */
  private toggleActions(): void {
    if (!this.inputOpened) {
      this.openActions(true);
    } else {
      this.closeActions(false);
    }
  }

  /**
   * @param {boolean} needFocus - on link creation we need to focus input. On editing - nope.
   */
  private openActions(needFocus = false): void {
    this.nodes.input.classList.add(this.CSS.inputShowed);
    if (needFocus) {
      this.nodes.input.focus();
    }
    this.inputOpened = true;
  }

  /**
   * Close input
   *
   * @param {boolean} clearSavedSelection — we don't need to clear saved selection
   *                                        on toggle-clicks on the icon of opened Toolbar
   */
  private closeActions(clearSavedSelection = true): void {
    if (this.selection.isFakeBackgroundEnabled) {
      // if actions is broken by other selection We need to save new selection
      const currentSelection = new SelectionUtils();

      currentSelection.save();

      this.selection.restore();
      this.selection.removeFakeBackground();

      // and recover new selection after removing fake background
      currentSelection.restore();
    }

    this.nodes.input.classList.remove(this.CSS.inputShowed);
    this.nodes.input.value = '';
    if (clearSavedSelection) {
      this.selection.clearSaved();
    }
    this.inputOpened = false;
  }

  /**
   * Enter pressed on input
   *
   * @param {KeyboardEvent} event - enter keydown event
   */
  private enterPressed(event: KeyboardEvent): void {
    let value = this.nodes.input.value || '';

    /**
     * Removing a link
     */
    if (this.currentAnchorElement && !value.trim()) {
      // this.selection.expandToTag(this.currentAnchorElement);
      this.unlink();
      event.preventDefault();
      console.log('this.fakeSelectionRestore', this.fakeSelectionRestore);
      this.fakeSelectionRestore?.();
      this.closeActions();
    } else {
      if (!this.validateURL(value)) {
        this.notifier.show({
          message: 'Pasted link is not valid.',
          style: 'error',
        });

        _.log('Incorrect Link pasted', 'warn', value);

        return;
      }

      value = this.prepareLink(value);

      /**
       * Addind / Editing a link
       */

      /**
       * First, we need to resotore selection
       * Case 1. Input was opened by Link icon click in InlineToolbar, here will be a fake selection
       * Case 2. Input was opened by selecting exising link in text, here will be this.currentAnchorElement
       */
      if (this.fakeSelectionRestore !== null) {
        this.fakeSelectionRestore();
      } else if (this.currentAnchorElement) {
        this.selection.expandToTag(this.currentAnchorElement);
      } else {
        throw new Error('Cannot add a link: no selection or anchor element found');
      }


      // const selection = window.getSelection();
      // const range = selection?.getRangeAt(0);

      // range?.surroundContents(document.createElement('a'));

      // this.selection.restore();
      // this.selection.removeFakeBackground();


      // requestAnimationFrame(() => {
      this.insertLink(value);
      // });
    }
    /**
     * Preventing events that will be able to happen
     */
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.selection.collapseToEnd();
    // this.inlineToolbar.close();
  }

  /**
   * Detects if passed string is URL
   *
   * @param {string} str - string to validate
   * @returns {boolean}
   */
  private validateURL(str: string): boolean {
    /**
     * Don't allow spaces
     */
    return !/\s/.test(str);
  }

  /**
   * Process link before injection
   * - sanitize
   * - add protocol for links like 'google.com'
   *
   * @param {string} link - raw user input
   */
  private prepareLink(link: string): string {
    link = link.trim();
    link = this.addProtocol(link);

    return link;
  }

  /**
   * Add 'http' protocol to the links like 'vc.ru', 'google.com'
   *
   * @param {string} link - string to process
   */
  private addProtocol(link: string): string {
    /**
     * If protocol already exists, do nothing
     */
    if (/^(\w+):(\/\/)?/.test(link)) {
      return link;
    }

    /**
     * We need to add missed HTTP protocol to the link, but skip 2 cases:
     *     1) Internal links like "/general"
     *     2) Anchors looks like "#results"
     *     3) Protocol-relative URLs like "//google.com"
     */
    const isInternal = /^\/[^/\s]/.test(link),
        isAnchor = link.substring(0, 1) === '#',
        isProtocolRelative = /^\/\/[^/\s]/.test(link);

    if (!isInternal && !isAnchor && !isProtocolRelative) {
      link = 'http://' + link;
    }

    return link;
  }

  /**
   * Inserts <a> tag with "href"
   *
   * @param {string} link - "href" value
   */
  private insertLink(link: string): void {
    /**
     * Edit all link, not selected part
     */
    const anchorTag = this.selection.findParentTag('A');

    if (anchorTag) {
      this.selection.expandToTag(anchorTag);
    }

    document.execCommand(this.commandLink, false, link);
  }

  /**
   * Removes <a> tag
   */
  private unlink(): void {
    document.execCommand(this.commandUnlink);
  }
}
