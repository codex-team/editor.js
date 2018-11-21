/**
 * Declaration for external JS module
 * After that we can use it at the TS modules
 */
declare module 'html-janitor' {
  interface Config {
    tags: {
      [key: string]: boolean|{[attr: string]: boolean|string}|(() => any)
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
