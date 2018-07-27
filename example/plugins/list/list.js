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

    /**
     * HTML nodes
     * @private
     */
    this._elements = {
      wrapper : null,
    };

    /**
     * Tool's data
     * @type {ListData}
     * */
    this._data = {
      style: 'ordered',
      items: []
    };

    this.api = api;
    console.log(this.api);
    // this.listData = listData;

    this.settings = [
      {
        name: 'ordered',
        icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
      },
      {
        name: 'unordered',
        icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><path d="M5.819 4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0-4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0 9.357h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 0 1 0-2.137zM1.468 4.155V1.33c-.554.404-.926.606-1.118.606a.338.338 0 0 1-.244-.104A.327.327 0 0 1 0 1.59c0-.107.035-.184.105-.234.07-.05.192-.114.369-.192.264-.118.475-.243.633-.373.158-.13.298-.276.42-.438a3.94 3.94 0 0 1 .238-.298C1.802.019 1.872 0 1.975 0c.115 0 .208.042.277.127.07.085.105.202.105.351v3.556c0 .416-.15.624-.448.624a.421.421 0 0 1-.32-.127c-.08-.085-.121-.21-.121-.376zm-.283 6.664h1.572c.156 0 .275.03.358.091a.294.294 0 0 1 .123.25.323.323 0 0 1-.098.238c-.065.065-.164.097-.296.097H.629a.494.494 0 0 1-.353-.119.372.372 0 0 1-.126-.28c0-.068.027-.16.081-.273a.977.977 0 0 1 .178-.268c.267-.264.507-.49.722-.678.215-.188.368-.312.46-.371.165-.11.302-.222.412-.334.109-.112.192-.226.25-.344a.786.786 0 0 0 .085-.345.6.6 0 0 0-.341-.553.75.75 0 0 0-.345-.08c-.263 0-.47.11-.62.329-.02.029-.054.107-.101.235a.966.966 0 0 1-.16.295c-.059.069-.145.103-.26.103a.348.348 0 0 1-.25-.094.34.34 0 0 1-.099-.258c0-.132.031-.27.093-.413.063-.143.155-.273.279-.39.123-.116.28-.21.47-.282.189-.072.411-.107.666-.107.307 0 .569.045.786.137a1.182 1.182 0 0 1 .618.623 1.18 1.18 0 0 1-.096 1.083 2.03 2.03 0 0 1-.378.457c-.128.11-.344.282-.646.517-.302.235-.509.417-.621.547a1.637 1.637 0 0 0-.148.187z"/></svg>',
      }
    ];
  }

  /**
   * Returns list tag with items
   * @return {Element}
   * @public
   */
  render() {
    this._elements.wrapper = this._make('ul', [ this.CSS.wrapper ], {
      contentEditable: true
    });

    this._elements.wrapper.appendChild(this._make('li'));

    return this._elements.wrapper;
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
      input: this.api.Styles.input,
      settingsWrapper: 'cdx-list-settings',
      settingsButton: 'cdx-settings-button',
      settingsButtonActive: 'cdx-settings-button--active',
    };
  };

  /**
   * List data setter
   * @param {ListData} listData
   */
  set listData(listData) {

    this._data.style = listData.style || 'ordered';
    this._data.items = listData.items || [];


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
  _make(tagName, classNames = null, attributes = {}) {
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
