class AnchorTune {
  static get isTune() {
    return true
  }

  constructor({api, block, data = false}) {
    this.anchor = data;
    this.api = api;
    this.indicator = this.makeIndicator()
  }

  render() {
    this.button = document.createElement('div');

    this.button.classList.add('ce-settings__button');

    this.button.innerHTML = '&#x1f517;';

    this.button.addEventListener('click', () => this.onClick());

    return this.button;
  }

  onClick() {
    const defaultAnchor = this.wrapper
      .textContent
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .substr(0, 50)
      .toLowerCase();

    this.anchor = prompt('Please enter an anchor for this block', defaultAnchor) || this.anchor;

    if (!this.anchor) {
      this.indicator.remove();

      return;
    }

    this.indicator.innerHTML = `#${this.anchor}`;

    this.wrapper.appendChild(this.indicator);
  }

  wrap(pluginsContent) {
    this.wrapper = document.createElement('div');

    this.wrapper.style.position = 'relative';

    this.wrapper.appendChild(pluginsContent);

    if (this.anchor) {
      this.wrapper.appendChild(this.indicator);
    }

    return this.wrapper;
  }

  makeIndicator() {
    const indicator = document.createElement('div')

    indicator.style.position = 'absolute';
    indicator.style.top = '40%';

    indicator.innerHTML = `#${this.anchor}`;

    return indicator;
  }

  save() {
    return this.anchor;
  }
}
