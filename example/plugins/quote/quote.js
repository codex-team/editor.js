/**
 * @class Quote
 * @classdesc Quote Tool for Codex Editor
 * @property {QuoteData} data - Tool`s input and output data
 * @propert {object} api - Codex Editor API instance
 *
 * @typedef {object} QuoteData
 * @description Quote Tool`s input and output data
 * @property {string} quote - quote`s text
 * @property {string} caption - quote`s caption
 * @property {'center'|'left'} alignment - quote`s alignment
 *
 * @typedef {object} QuoteConfig
 * @description Quote Tool`s initial configuration
 * @property {string} quotePlaceholder - placeholder to show in quote`s text input
 * @property {string} captionPlaceholder - placeholder to show in quote`s caption input
 * @property {'center'|'left'} defaultAlignment - alignment to use as default
 */
class Quote {
  /**
   * Should this tools be displayed at the Editor's Toolbox
   *
   * @public
   * @returns {boolean}
   */
  static get displayInToolbox() {
    return true;
  }

  /**
   * Get Tool icon element
   *
   * @public
   * @return {string}
   */
  static get toolboxIcon() {
    return '<svg width="15" height="14" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg"><path d="M13.53 6.185l.027.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.569-1.568l4.838-4.837L6.396 2.23A1.125 1.125 0 1 1 7.986.64l5.52 5.518.025.027zm-5.815 0l.026.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.568-1.568l4.837-4.837L.58 2.23A1.125 1.125 0 0 1 2.171.64L7.69 6.158l.025.027z" /></svg>';
  }

  /**
   * Class for the Toolbox icon
   * @public
   * @returns {string}
   */
  static get iconClassName() {
    return 'cdx-quote-icon';
  }

  /**
   * Default placeholder for quote text
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_QUOTE_PLACEHOLDER() {
    return 'Enter a quote';
  }

  /**
   * Default placeholder for quote caption
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_CAPTION_PLACEHOLDER() {
    return 'Enter a caption';
  }

  /**
   * Allowed quote alignments
   *
   * @public
   * @returns {{left: string, center: string}}
   */
  static get ALIGNMENTS() {
    return {
      left: 'left',
      center: 'center'
    };
  }

  /**
   * Default quote alignment
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_ALIGNMENT() {
    return Quote.ALIGNMENTS.left;
  }

  /**
   * Tool`s styles
   *
   * @returns {{baseClass: string, wrapper: string, quote: string, input: string, caption: string, settingsButton: string, settingsButtonActive: string}}
   */
  get CSS() {
    return {
      baseClass: 'cdx-block',
      wrapper: 'cdx-quote',
      quote: 'cdx-quote__text',
      input: 'cdx-input',
      caption: 'cdx-quote__caption',
      settingsButton: 'cdx-settings-button',
      settingsButtonActive: 'cdx-settings-button--active'
    };
  }

  /**
   * Tool`s settings properties
   *
   * @returns {*[]}
   */
  get settings() {
    return [
      {
        name: 'left',
        icon: `<svg width="16" height="11" viewBox="0 0 16 11" xmlns="http://www.w3.org/2000/svg" ><path d="M1.069 0H13.33a1.069 1.069 0 0 1 0 2.138H1.07a1.069 1.069 0 1 1 0-2.138zm0 4.275H9.03a1.069 1.069 0 1 1 0 2.137H1.07a1.069 1.069 0 1 1 0-2.137zm0 4.275h9.812a1.069 1.069 0 0 1 0 2.137H1.07a1.069 1.069 0 0 1 0-2.137z" /></svg>`
      },
      {
        name: 'center',
        icon: `<svg width="16" height="11" viewBox="0 0 16 11" xmlns="http://www.w3.org/2000/svg" ><path d="M1.069 0H13.33a1.069 1.069 0 0 1 0 2.138H1.07a1.069 1.069 0 1 1 0-2.138zm3.15 4.275h5.962a1.069 1.069 0 0 1 0 2.137H4.22a1.069 1.069 0 1 1 0-2.137zM1.069 8.55H13.33a1.069 1.069 0 0 1 0 2.137H1.07a1.069 1.069 0 0 1 0-2.137z"/></svg>`
      }
    ];
  }

  /**
   * @constructor
   *
   * @param {QuoteData} quoteData
   * @param {QuoteConfig} config
   * @param api
   */
  constructor(quoteData = {}, config = {}, api) {
    const {ALIGNMENTS, DEFAULT_ALIGNMENT} = Quote;

    this.api = api;

    this.quotePlaceholder = config.quotePlaceholder || Quote.DEFAULT_QUOTE_PLACEHOLDER;
    this.captionPlaceholder = config.captionPlaceholder || Quote.DEFAULT_CAPTION_PLACEHOLDER;

    this.data = {
      quote: quoteData.quote || '',
      caption: quoteData.caption || '',
      alignment: Object.values(ALIGNMENTS).includes(quoteData.alignment) && quoteData.alignment ||
        config.defaultAlignment ||
        DEFAULT_ALIGNMENT
    };
  }

  /**
   * Create Quote Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('blockquote', [this.CSS.baseClass, this.CSS.wrapper]);
    const quote = this._make('div', [this.CSS.input, this.CSS.quote], {
      contentEditable: true,
      innerHTML: this.data.quote
    });
    const caption = this._make('input', [this.CSS.input, this.CSS.caption], {
      contentEditable: true,
      value: this.data.caption
    });

    quote.dataset.placeholder = this.quotePlaceholder;
    caption.dataset.placeholder = this.captionPlaceholder;

    container.appendChild(quote);
    container.appendChild(caption);

    return container;
  }

  /**
   * Extract Quote data from Quote Tool element
   *
   * @param {HTMLDivElement} quoteElement - element to save
   * @returns {QuoteData}
   */
  save(quoteElement) {
    const quote = quoteElement.querySelector(`.${this.CSS.quote}`);
    const caption = quoteElement.querySelector(`.${this.CSS.caption}`);

    return Object.assign(this.data, {
      quote: quote.innerHTML,
      caption: caption.value
    });
  }

  /**
   * Create wrapper for Tool`s settings buttons:
   * 1. Left alignment
   * 2. Center alignment
   *
   * @returns {HTMLDivElement}
   */
  renderSettings() {
    const wrapper = this._make('div');
    const capitalize = str => str[0].toUpperCase() + str.substr(1);


    this.settings
      .map( tune => {
        const el = this._make('div', this.CSS.settingsButton, {
          innerHTML: tune.icon,
          title: `${capitalize(tune.name)} alignment`
        });

        el.classList.add(this.CSS.settingsButton);
        el.innerHTML = tune.icon;

        el.classList.toggle(this.CSS.settingsButtonActive, tune.name === this.data.alignment);

        wrapper.appendChild(el);

        return el;
      })
      .forEach((element, index, elements) => {
        element.addEventListener('click', () => {
          this._toggleTune(this.settings[index].name);

          elements.forEach((el, i) => {
            const {name} = this.settings[i];

            el.classList.toggle(this.CSS.settingsButtonActive, name === this.data.alignment);
          });
        });
      });

    return wrapper;
  };

  /**
   * Toggle quote`s alignment
   *
   * @param {string} tune - alignment
   * @private
   */
  _toggleTune(tune) {
    this.data.alignment = tune;
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

    if ( Array.isArray(classNames) ) {
      el.classList.add(...classNames);
    } else if( classNames ) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}
