import ISanitizerConfig from '../../src/components/types/sanitizer-config';

export interface Sanitizer {
  clean(taintString: string, config: ISanitizerConfig): string;
}
