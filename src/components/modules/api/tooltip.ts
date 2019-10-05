import Module from '../../__module';
import { Tooltip } from '../../../../types/api';

export default class TooltipAPI extends Module {
  /**
   * Available methods
   */
  get methods(): Tooltip {
    return {
      show: (element: HTMLElement, content: HTMLElement) => this.show(element, content),
      hide: () => this.show(),
    };
  }

  public show(element: HTMLElement, content: HTMLElement) {
    this.Editor.Tooltip.show(element, content);
  }

  public hide() {
    this.Editor.Tooltip.hide();
  }
}
