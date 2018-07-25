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
   */
  static get toolboxIcon() {
    return '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>';
  }

  /**
   * Styles
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
   * Initialize plugin
   * @param {ListData} listData
   * @param {object} config
   */
  init(listData = {}, config = {}) {
    /** @type {ListData} */
    this._data = {};

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
      let item = List.make('li', [ this.CSS.input, this.CSS.item ], {
        innerHTML : listData.items[i] || ''
      });

      this._elements.items.push(item);
      listEl.appendChild(item);
    }

    this._elements.wrapper = listEl;

  }

  /**
   * @constructor
   *
   * @param {ListData} listdata
   * @param {object} config - Tool settings
   * @param {object} api - CodeX Editor API
   */
  constructor(listdata = {}, config = {}, api = {}) {

    this.init(listdata, config);

    this.api = api;
    this.listData = listdata;

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
   * List data setter
   * @param {ListData} data
   */
  set listData(data = {}) {
    this._data.style = data.style || 'ordered';
    this._data.items = data.items || [];
  }

  /**
   * @return {ListData}
   */
  get listData() {
    return this._data;
  }
  /**
   * Returns list tag with items
   * @return {Element}
   */
  render() {
    return this._elements.wrapper;
  }

  save() {
    return this.listData;
  }

  /**
   * Settings
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

    this._elements.wrapper.replaceWith(newListEl);
    this._elements.wrapper = newListEl;
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

}
