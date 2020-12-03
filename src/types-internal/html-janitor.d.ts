/**
 * Declaration for external JS module
 * After that we can use it at the TS modules
 */
declare module 'html-janitor' {
  type Option = boolean | { [attr: string]: boolean | string };

  interface Config {
    tags: {
      [key: string]: Option | ((el: Element) => Option)
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
