/**
 * Sanitizer config of each HTML element
 * @see {@link https://github.com/guardian/html-janitor#options}
 */
type TagConfig = boolean | { [attr: string]: boolean | string };

export interface SanitizerConfig {
  /**
   * Tag name and params not to be stripped off
   * @see {@link https://github.com/guardian/html-janitor}
   *
   * @example Save P tags
   * p: true
   *
   * @example Save A tags and do not strip HREF attribute
   * a: {
   *   href: true
   * }
   *
   * @example Save A tags with TARGET="_blank" attribute
   * a: function (aTag) {
   *   return aTag.target === '_black';
   * }
   *
   * @example Save U tags that are not empty
   * u: function(el){
   *   return el.textContent !== '';
   * }
   *
   * @example For blockquote with class 'indent' save CLASS and STYLE attributes
   *          Otherwise strip all attributes
   * blockquote: function(el) {
   *   if (el.classList.contains('indent')) {
   *     return { 'class': true, 'style': true };
   *   } else {
   *     return {};
   *   }
   * }
   */
  [key: string]: TagConfig | ((el: Element) => TagConfig);
}
