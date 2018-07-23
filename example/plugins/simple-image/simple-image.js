/**
 * SimpleImage Tool for the CodeX Editor
 * Works only with pasted image URLs, don't requires server-side uploader.
 */
/**
 * @typedef {object} SimpleImageData
 * @description Tool's input and output data format
 * @property {string} url — image URL
 * @property {string} caption — image caption
 */
class SimpleImageTool {
  /**
   * @param {SimpleImageData} imageData
   */
  constructor(imageData = {}, {}, api) {
    this.api = api;

    this.CSS = {
      baseClass: 'cdx-block',
      wrapper: 'cdx-simple-image',
      imageHolder: 'cdx-simple-image__picture',
      loading: 'cdx-loader',
      input: 'cdx-input',
      settingsButton: 'cdx-settings-button',
      settingsButtonActive: 'cdx-settings-button--active',
    };

    this.data = {
      url: imageData.url || '',
      caption: imageData.caption || '',
      withBorder: imageData.withBorder !== undefined ? imageData.withBorder : false,
      withBackground: imageData.withBackground !== undefined ? imageData.withBackground : false,
      stretched: imageData.stretched !== undefined ? imageData.stretched : false,
    };

    this.nodes = {
      wrapper: null,
      imageHolder: null,
    };

    this.settings = [
      {
        name: 'withBackground',
        icon: `<svg width="20" height="18" viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`
      },
      {
        name: 'stretched',
        icon: `<svg width="18" height="11" viewBox="0 0 18 11" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
      },
      {
        name: 'withBorder',
        icon: `<svg width="18" height="16" viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
      },
    ];
  }

  /**
   * @public
   */
  render() {
    let wrapper = document.createElement('div'),
      loader = document.createElement('div'),
      imageHolder = document.createElement('div'),
      image = document.createElement('img'),
      caption = document.createElement('div');

    wrapper.classList.add(this.CSS.baseClass, this.CSS.wrapper);
    loader.classList.add(this.CSS.loading);
    caption.classList.add(this.CSS.input);
    caption.contentEditable = 'true';
    caption.dataset.placeholder = 'Enter a caption';
    caption.innerHTML = this.data.caption || '';
    imageHolder.classList.add(this.CSS.imageHolder);

    image.src = this.data.url;
    wrapper.appendChild(loader);

    image.onload = () => {
      wrapper.classList.remove(this.CSS.loading);
      imageHolder.appendChild(image);
      wrapper.appendChild(imageHolder);
      wrapper.appendChild(caption);
      loader.remove();
      this._acceptTuneView();
    };

    this.nodes.imageHolder = imageHolder;
    this.nodes.wrapper = wrapper;

    return wrapper;
  }

  /**
   * @public
   * @param {Element} blockContent - Tool's wrapper
   * @return {SimpleImageData}
   */
  save(blockContent) {
    let image = blockContent.querySelector('img'),
      caption = blockContent.querySelector('.' + this.CSS.input);

    return Object.assign(this.data, {
      url: image.src,
      caption: caption.innerHTML
    });
  }

  /**
   * @public
   */
  static get onPaste() {
    return {
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png)$/i
      },
      patternHandler: (text) => {
        return {
          url: text
        };
      },
      handler: function () {}
    };
  }

  /**
   * Makes buttons with tunes: add background, add border, stretch image
   * @return {HTMLDivElement}
   */
  renderSettings() {
    let wrapper = document.createElement('div');

    this.settings.forEach( tune => {
      let el = document.createElement('div');
      el.classList.add(this.CSS.settingsButton);
      el.innerHTML = tune.icon;

      el.addEventListener('click', () => {
        this._toggleTune(tune.name);
        el.classList.toggle(this.CSS.settingsButtonActive);
      });

      wrapper.appendChild(el);
    });
    return wrapper;
  };

  /**
   * Click on the Settings Button
   * @private
   */
  _toggleTune(tune) {
    this.data[tune] = !this.data[tune];
    this._acceptTuneView();
  }

  /**
   * Add specified class corresponds with activated tunes
   * @private
   */
  _acceptTuneView() {
    this.settings.forEach( tune => {
      this.nodes.imageHolder.classList.toggle(this.CSS.imageHolder + '--' + tune.name.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`), !!this.data[tune.name]);

      if (tune.name === 'stretched') {
        this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex(), !!this.data.stretched);
      }
    });
  }
}
