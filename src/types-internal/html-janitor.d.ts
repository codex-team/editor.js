/**
 * Declaration for external JS module
 * After that we can use it at the TS modules
 */
declare module 'html-janitor' {
  /**
   * Sanitizer config of each HTML element
   * @see {@link https://github.com/guardian/html-janitor#options}
   */
  type TagConfig = boolean | { [attr: string]: boolean | string };

  interface Config {
    tags: {
      [key: string]: TagConfig | ((el: Element) => TagConfig)
    };
  }

  export class HTMLJanitor {
    constructor(config: Config);

    public clean(taintString: string): string;
  }

  /**
   * Default export
   */
  export default HTMLJanitor;
}
