import {SanitizerConfig} from '../../../types';

/**
 * Declaration for external JS module
 * After that we can use it at the TS modules
 */
declare module 'html-janitor' {
  export class HTMLJanitor {
    constructor(config: SanitizerConfig);

    public clean(taintString: string): string;
  }

  /**
   * Default export
   */
  export = HTMLJanitor;
}
