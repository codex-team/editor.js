import SelectionUtils from '../../selection';
import { Selection as SelectionAPIInterface } from '../../../../types/api';
import Module from '../../__module';

/**
 * @class SelectionAPI
 * Provides with methods working with SelectionUtils
 */
export default class SelectionAPI extends Module {

  /**
   * create a common SelectionUtils object
   */
  private selection = new SelectionUtils();

  /**
   * Available methods
   *
   * @returns {SelectionAPIInterface}
   */
  public get methods(): SelectionAPIInterface {
    return {
      findParentTag: (tagName: string, className?: string): HTMLElement | null => this.findParentTag(tagName, className),
      expandToTag: (node: HTMLElement): void => this.expandToTag(node),
      clearSaved: (): void => this.clearSaved(),
      collapseToEnd: (): void => this.collapseToEnd(),
      save: (): void => this.save(),
      restore: (): void => this.restore(),
      setFakeBackground: (): void => this.setFakeBackground(),
      removeFakeBackground: (): void => this.removeFakeBackground(),
      isFakeBackgroundEnabled: this.selection.isFakeBackgroundEnabled,
    };
  }
  
  /**
   * clear saved selection range
   */
  public clearSaved(): void{
    return this.selection.clearSaved();
  }

  /**
   * collapse selected range
   */
  public collapseToEnd(): void{
    return this.selection.collapseToEnd();
  }

  /**
   * Looks ahead from selection and find passed tag with class name
   *
   * @param {string} tagName - tag to find
   * @param {string} className - tag's class name
   *
   * @returns {HTMLElement|null}
   */
  public findParentTag(tagName: string, className?: string): HTMLElement | null {
    return this.selection.findParentTag(tagName, className);
  }

  /**
   * Expand selection to passed tag
   *
   * @param {HTMLElement} node - tag that should contain selection
   */
  public expandToTag(node: HTMLElement): void {
    return this.selection.expandToTag(node);
  }

  /**
   * Save selection range
   */
  public save(): void{
    return this.selection.save();
  }

  /**
   * Restore selection range
   */
  public restore(): void{
    return this.selection.restore();
  }

  /**
   * Set fake background
   */
  public setFakeBackground(): void{
    return this.selection.setFakeBackground();
  }

  /**
   * Removes fake background
   */
  public removeFakeBackground(): void{
    return this.selection.removeFakeBackground();
  }
}
