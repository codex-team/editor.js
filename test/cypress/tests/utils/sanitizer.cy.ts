/* eslint-disable @typescript-eslint/naming-convention */
import { clean, mergeSanitizerConfigs } from '../../../../src/components/utils/sanitizer';
import type { SanitizerConfig } from '../../../../types';

describe('Sanitizer utils', () => {
  context('mergeSanitizerConfigs()', () => {
    it('should keep rules for different tags from all configs', () => {
      const merged = mergeSanitizerConfigs(
        { b: true } as SanitizerConfig,
        { i: {} } as SanitizerConfig
      );

      expect(merged).to.be.deep.eq({
        b: true,
        i: {},
      });
    });

    it('should union attributes when two configs describe the same tag', () => {
      const merged = mergeSanitizerConfigs(
        { span: { class: true,
          'data-font-setting': true } } as SanitizerConfig,
        { span: { class: true,
          'data-font-size-setting': true } } as SanitizerConfig
      );

      expect(merged).to.be.deep.eq({
        span: {
          class: true,
          'data-font-setting': true,
          'data-font-size-setting': true,
        },
      });
    });

    it('should not mutate passed configs', () => {
      const first = { span: { 'data-a': true } } as SanitizerConfig;
      const second = { span: { 'data-b': true } } as SanitizerConfig;

      mergeSanitizerConfigs(first, second);

      expect(first).to.be.deep.eq({ span: { 'data-a': true } });
      expect(second).to.be.deep.eq({ span: { 'data-b': true } });
    });

    it('should resolve "true" over an attributes object for the same tag', () => {
      expect(mergeSanitizerConfigs({ a: true } as SanitizerConfig, { a: { href: true } } as SanitizerConfig))
        .to.be.deep.eq({ a: true });
      expect(mergeSanitizerConfigs({ a: { href: true } } as SanitizerConfig, { a: true } as SanitizerConfig))
        .to.be.deep.eq({ a: true });
    });

    it('should let an allowing rule win over "false" for the same tag', () => {
      expect(mergeSanitizerConfigs({ a: false } as SanitizerConfig, { a: { href: true } } as SanitizerConfig))
        .to.be.deep.eq({ a: { href: true } });
      expect(mergeSanitizerConfigs({ a: { href: true } } as SanitizerConfig, { a: false } as SanitizerConfig))
        .to.be.deep.eq({ a: { href: true } });
      expect(mergeSanitizerConfigs({ a: false } as SanitizerConfig, { a: false } as SanitizerConfig))
        .to.be.deep.eq({ a: false });
    });

    it('should resolve "true" over "false" for the same attribute', () => {
      const merged = mergeSanitizerConfigs(
        { span: { class: false } } as SanitizerConfig,
        { span: { class: true } } as SanitizerConfig
      );

      expect(merged).to.be.deep.eq({ span: { class: true } });
    });

    it('should combine different exact attribute values into a function that accepts either', () => {
      const merged = mergeSanitizerConfigs(
        { a: { target: '_blank' } } as SanitizerConfig,
        { a: { target: '_self' } } as SanitizerConfig
      );

      expect(clean('<a target="_blank">x</a>', merged)).to.eq('<a target="_blank">x</a>');
      expect(clean('<a target="_self">x</a>', merged)).to.eq('<a target="_self">x</a>');
      expect(clean('<a target="_top">x</a>', merged)).to.eq('<a>x</a>');
    });

    it('should treat a truthy non-boolean attribute predicate result as allowed', () => {
      const merged = mergeSanitizerConfigs(
        { span: { style: (value: string) => value.match(/^font-/) } } as unknown as SanitizerConfig,
        { span: { style: 'color: red' } } as SanitizerConfig
      );

      expect(clean('<span style="font-weight: bold">t</span>', merged)).to.eq('<span style="font-weight: bold">t</span>');
      expect(clean('<span style="color: red">t</span>', merged)).to.eq('<span style="color: red">t</span>');
      expect(clean('<span style="color: blue">t</span>', merged)).to.eq('<span>t</span>');
    });

    it('should combine a function rule with an object rule for the same tag', () => {
      const merged = mergeSanitizerConfigs(
        {
          span: (el: Element) => {
            return el.classList.contains('font') ? { class: true,
              'data-font': true } : {};
          },
        } as unknown as SanitizerConfig,
        { span: { 'data-size': true } } as SanitizerConfig
      );

      expect(merged.span).to.be.a('function');

      expect(clean('<span class="font" data-font="a" data-size="b" id="x">t</span>', merged))
        .to.eq('<span class="font" data-font="a" data-size="b">t</span>');
      expect(clean('<span class="other" data-font="a" data-size="b">t</span>', merged))
        .to.eq('<span data-size="b">t</span>');
    });

    it('should combine two function rules for the same tag', () => {
      const merged = mergeSanitizerConfigs(
        { u: (el: Element) => el.textContent === 'first' } as unknown as SanitizerConfig,
        { u: (el: Element) => el.textContent === 'second' } as unknown as SanitizerConfig
      );

      expect(clean('<u>first</u>', merged)).to.eq('<u>first</u>');
      expect(clean('<u>second</u>', merged)).to.eq('<u>second</u>');
      expect(clean('<u>third</u>', merged)).to.eq('third');
    });

    it('should resolve "true" over a function rule for the same tag', () => {
      const merged = mergeSanitizerConfigs(
        { u: (el: Element) => el.textContent === 'first' } as unknown as SanitizerConfig,
        { u: true } as SanitizerConfig
      );

      expect(merged).to.be.deep.eq({ u: true });
    });

    it('should ignore undefined configs', () => {
      expect(mergeSanitizerConfigs(undefined, { b: true } as SanitizerConfig, undefined))
        .to.be.deep.eq({ b: true });
    });
  });
});
