/**
 * List Tool for the CodeX Editor
 */

/**
 * @typedef {object} ListData
 * @property {string} style - can be ordered or unordered
 * @property {array} items - li elements
 */

class List {
  /**
   * Should this tools be displayed at the Editor's Toolbox
   * @returns {boolean}
   * @public
   */
  static get displayInToolbox() {
    return true;
  }

  /**
   * Class for the Toolbox icon
   * @returns {string}
   * @public
   */
  static get iconClassName() {
    return 'cdx-list-icon';
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   * @public
   */
  static get toolboxIcon() {
    return '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>';
  }

  /**
   * @constructor
   *
   * @param {ListData} listData
   * @param {object} config - Tool settings
   * @param {object} api - CodeX Editor API
   */
  constructor(listData = {}, config = {}, api = {}) {
    this.api = api;
    this.listData = listData;

    this.settings = [
      {
        name: 'ordered',
        icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
      },
      {
        name: 'unordered',
        icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
      }
    ];
  }

  /**
   * Returns list tag with items
   * @return {Element}
   * @public
   */
  render() {
    return this.listWrapper;
  }

  /**
   * @return {ListData}
   * @public
   */
  save() {
    return this.listData;
  }

  /**
   * Settings
   * @public
   */
  renderSettings() {
    let wrapper = List.make('div', [ this.CSS.settingsWrapper ], {});

    this.settings.forEach( (item) => {
      let itemEl = document.createElement('div');

      itemEl.classList.add(this.CSS.settingsButton);
      itemEl.innerHTML = item.icon;

      itemEl.addEventListener('click', () => {
        this.itemClicked(item.name);
        itemEl.classList.toggle(this.CSS.settingsButtonActive);
      });

      if (this.listData.style === item.name) {
        itemEl.classList.add(this.CSS.settingsButtonActive);
      }

      wrapper.appendChild(itemEl);
    });

    return wrapper;
  }

  /**
   * Styles
   * @private
   */
  get CSS() {
    return {
      wrapper: 'cdx-list',
      item: 'cdx-list__item',
      input: 'cdx-input',
      settingsWrapper: 'cdx-list-settings',
      settingsButton: 'cdx-settings-button',
      settingsButtonActive: 'cdx-settings-button--active',
    };
  };

  /**
   * List data setter
   * @param {ListData} listData
   */
  set listData(listData = {}) {
    /** @type {ListData} */
    this._data = {};
    this._data.style = listData.style || 'ordered';
    this._data.items = listData.items || [];

    /**
     * @type {{}}
     * @private
     */
    this._elements = {
      wrapper : '',
      items : [],
    };

    /** Prepare Elements */
    let listTag = listData.style === 'ordered' ? 'ol' : 'ul';

    let listEl = List.make(listTag, [ this.CSS.wrapper ], {
      contentEditable: true
    });

    listData.items = listData.items || [];

    for (let i = 0; i < listData.items.length; i++) {
      let item = List.make('li', [this.CSS.input, this.CSS.item], {
        innerHTML : listData.items[i] || ''
      });

      this._elements.items.push(item);
      listEl.appendChild(item);
    }

    this._elements.wrapper = listEl;

    this._elements.wrapper.addEventListener('keydown', (event) => {
      this.getOutofList(event);
    }, false);
  }

  /**
   * @param {Element} el
   */
  set listWrapper(el) {
    this._elements.wrapper.replaceWith(el);
    this._elements.wrapper = el;
    this._data.style = el.tagName === 'UL' ? 'unordered' : 'ordered';

    this._elements.wrapper.addEventListener('keydown', (event) => {
      this.getOutofList(event);
    }, false);
  }

  /**
   * @return {string}
   */
  get listWrapper() {
    return this._elements.wrapper;
  }

  /**
   * @return {ListData}
   */
  get listData() {
    this._data.items = [];

    const items = this._elements.wrapper.childNodes;

    for (let i = 0; i < items.length; i++) {
      this._data.items.push(items[i].innerHTML);
    }

    return this._data;
  }

  /**
   * @param itemName
   */
  itemClicked(itemName) {
    let listTag = itemName === 'ordered' ? 'ol' : 'ul';

    let newListEl = List.make(listTag, [ this.CSS.wrapper ], {
      contentEditable: true
    });

    this._elements.items.forEach( (element) => {
      newListEl.appendChild(element);
    });

    this.listWrapper = newListEl;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  static make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Get out from List Tool
   * when last 2 items are empty
   * @param {KeyboardEvent} event
   */
  getOutofList(event) {

    /**
     * Handler on Enter
     */
    if (event.keyCode === 13) {
      const lastChild = this.listWrapper.lastChild;

      /** Prevent Default li generation if item is empty */
      if (lastChild.textContent === '') {
        event.preventDefault();
        lastChild.remove();

        /** Insert New Block and set caret */
        this.api.blocks.insertNewBlock();
      }
    }
  }
}
