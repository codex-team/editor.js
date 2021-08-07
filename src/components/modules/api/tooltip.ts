import { Tooltip as ITooltip } from '../../../../types/api';
import { TooltipContent, TooltipOptions } from 'codex-tooltip';
import Module from '../../__module';
import { ModuleConfig } from '../../../types-internal/module-config';
import Tooltip from '../../utils/tooltip';
import EventsDispatcher from '../../utils/events';
import { EditorConfig } from '../../../../types';
/**
 * @class TooltipAPI
 * @classdesc Tooltip API
 */
export default class TooltipAPI extends Module {
  /**
   * Tooltip utility Instance
   */
  private tooltip: Tooltip;
  /**
   * @class
   * @param {object} moduleConfiguration - Module Configuration
   * @param {EditorConfig} moduleConfiguration.config - Editor's config
   * @param {EventsDispatcher} moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config, eventsDispatcher }: ModuleConfig) {
    super({
      config,
      eventsDispatcher,
    });

    this.tooltip = new Tooltip();
  }

  /**
   * Destroy Module
   */
  public destroy(): void {
    this.tooltip.destroy();
  }

  /**
   * Available methods
   */
  public get methods(): ITooltip {
    return {
      show: (element: HTMLElement,
        content: TooltipContent,
        options?: TooltipOptions
      ): void => this.show(element, content, options),
      hide: (): void => this.hide(),
      onHover: (element: HTMLElement,
        content: TooltipContent,
        options?: TooltipOptions
      ): void => this.onHover(element, content, options),
    };
  }

  /**
   * Method show tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element - element on which tooltip should be shown
   * @param {TooltipContent} content - tooltip content
   * @param {TooltipOptions} options - tooltip options
   */
  public show(element: HTMLElement, content: TooltipContent, options?: TooltipOptions): void {
    this.tooltip.show(element, content, options);
  }

  /**
   * Method hides tooltip on HTML page
   */
  public hide(): void {
    this.tooltip.hide();
  }

  /**
   * Decorator for showing Tooltip by mouseenter/mouseleave
   *
   * @param {HTMLElement} element - element on which tooltip should be shown
   * @param {TooltipContent} content - tooltip content
   * @param {TooltipOptions} options - tooltip options
   */
  public onHover(element: HTMLElement, content: TooltipContent, options?: TooltipOptions): void {
    this.tooltip.onHover(element, content, options);
  }
}
