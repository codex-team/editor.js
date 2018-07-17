export default interface ISanitizerConfig {
  /**
   * Tag name and params
   *
   * Save P tags
   * @example p: true
   *
   * Save A tags and do not strip HREF attribute
   * @example a: {
   *            href: true
   *          }
   *
   * Save A tags with TARGET="_blank" attribute
   * @example a: function (aTag) {
   *            return aTag.target === '_black';
   *          }
   *
   * Save U tags that are not empty
   * @example u: function(el){
   *            return el.textContent !== '';
   *          }
   *
   * For blockquote with class 'indent' save CLASS and STYLE attributes
   * Otherwise strip all attributes
   * @example blockquote: function(el) {
   *            if (el.classList.contains('indent')) {
   *              return { 'class': true, 'style': true };
   *            } else {
   *              return {};
   *            }
   *          }
   */
  [key: string]: boolean|object|(() => any);
}
