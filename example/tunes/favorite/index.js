class FavoriteTune {
  static get isTune() {
    return true
  }

  constructor({api, block, data = false}) {
    this.state = data;
  }

  set state(state) {
    this._state = state;

    if (this.wrapper) {
      this.wrapper.style.backgroundColor = this.background;
    }

    if (this.button) {
      this.button.innerHTML = this.state ? '<b>F</b>' : 'F';
    }
  }

  get state() {
    return this._state;
  }

  get background() {
    return this.state ? 'yellow' : 'unset';
  }

  render() {
    this.button = document.createElement('div');

    this.button.classList.add('ce-settings__button');

    this.button.innerHTML = this.state ? '<b>F</b>' : 'F';

    this.button.addEventListener('click', () => this.onClick());

    return this.button;
  }

  onClick() {
    this.state = !this.state;
  }

  wrap(pluginsContent) {
    this.wrapper = document.createElement('div');

    this.wrapper.style.backgroundColor = this.background;

    this.wrapper.appendChild(pluginsContent);

    return this.wrapper;
  }

  save() {
    return this.state;
  }
}
