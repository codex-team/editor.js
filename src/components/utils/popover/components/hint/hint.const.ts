import { bem } from '../../../bem';

/**
 * Hint block CSS class constructor
 */
const className = bem('ce-hint');

/**
 * CSS class names to be used in hint class
 */
export const css = {
  root: className(),
  alignedLeft: className(null, 'align-left'),
  title: className('title'),
  description: className('description'),
};
