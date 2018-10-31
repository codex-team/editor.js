import ISanitizerConfig from '../sanitizer-config';

namespace EditorJS.API {
  export interface Sanitizer {
    clean(taintString: string, config: ISanitizerConfig): string;
  }
}
