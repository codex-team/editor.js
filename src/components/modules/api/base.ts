import Module from '../../__module';

/**
 * @class BaseApiModule
 */
export default class BaseApiModule extends Module {
  /**
   * Method names that should be disabled in the Read-Only mode
   */
  public methodsToDisableInReadonly: string[] = [];
}
