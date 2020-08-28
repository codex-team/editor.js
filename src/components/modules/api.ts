import Module from "../__module";

/**
 * @abstract
 *
 * @class APIModule
 * @classdesc Abstract API module
 */
export abstract class APIModule extends Module {
  /**
   * Method names that must be decorated
   */
  protected methodsToDisableInReadonly: string[] = [];
}
