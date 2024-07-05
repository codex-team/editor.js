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
  alignedStart: className(null, 'align-left'),
  alignedCenter: className(null, 'align-center'),
  title: className('title'),
  description: className('description'),
};
