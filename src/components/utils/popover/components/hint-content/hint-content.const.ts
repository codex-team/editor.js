import { bem } from '../../../bem';

/**
 * Hint content block CSS class constructor
 */
const className = bem('ce-hint-content');

/**
 * CSS class names to be used in hint content class
 */
export const css = {
  root: className(),
  title: className('title'),
  description: className('description'),
};
