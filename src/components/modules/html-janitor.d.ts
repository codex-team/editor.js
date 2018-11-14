import {SanitizerConfig} from '../../../types';

declare module 'html-janitor' {
  export class HTMLJanitor {
    constructor(config: SanitizerConfig);

    public clean(taintString: string): string;
  }

  export = HTMLJanitor;
}
