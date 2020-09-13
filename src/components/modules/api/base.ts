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

  /**
   * API Module methods
   */
  public methods?: object;

  /**
   * If module provides CSS classnames, they stored in 'classes' property
   */
  public classes?: object;
}
