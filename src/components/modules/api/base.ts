import Module from '../../__module';

/**
 * @class ApiModule
 * @classdesc Any API-module abstract class
 */
export default abstract class ApiModule extends Module {
  /**
   * Method names that should be disabled in the Read-Only mode
   */
  public methodsToDisableInReadonly: string[] = [];
}
