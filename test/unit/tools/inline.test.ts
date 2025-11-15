import { describe, it, expect, vi } from 'vitest';
import type { ToolSettings, API } from '@/types';
import { ToolType } from '@/types/tools/adapters/tool-type';
import InlineToolAdapter from '../../../src/components/tools/inline';

type InlineToolAdapterOptions = ConstructorParameters<typeof InlineToolAdapter>[0];

type InlineToolInstance = {
  api: object;
  config: ToolSettings;
};

const createInlineToolOptions = (): InlineToolAdapterOptions => {
  /**
   *
   */
  class Constructable {
    public static sanitize = {
      rule1: 'rule1',
    };

    public static title = 'Title';

    public static shortcut = 'CTRL+N';

    public static isReadOnlySupported = true;

    public api: object;

    public config: ToolSettings;

    /**
     *
     * @param root0 - The constructor arguments object
     */
    constructor({ api, config }: { api: object; config: ToolSettings }) {
      this.api = api;
      this.config = config;
    }
  }

  return {
    name: 'inlineTool',
    constructable: Constructable as unknown as InlineToolAdapterOptions['constructable'],
    config: {
      config: {
        option1: 'option1',
        option2: 'option2',
      },
      shortcut: 'CMD+SHIFT+B',
    },
    api: {
      prop1: 'prop1',
      prop2: 'prop2',
    } as unknown as API,
    isDefault: false,
    isInternal: false,
    defaultPlaceholder: 'Default placeholder',
  } as InlineToolAdapterOptions;
};

describe('InlineToolAdapter', () => {
  describe('.type', () => {
    it('returns ToolType.Inline', () => {
      const options = createInlineToolOptions();
      const tool = new InlineToolAdapter(options);

      expect(tool.type).toBe(ToolType.Inline);
    });
  });

  describe('.name', () => {
    it('returns provided tool name', () => {
      const options = createInlineToolOptions();
      const tool = new InlineToolAdapter(options);

      expect(tool.name).toBe(options.name);
    });
  });

  describe('.title', () => {
    it('returns constructable title', () => {
      const options = createInlineToolOptions();
      const tool = new InlineToolAdapter(options);
      const constructable = options.constructable as { title?: string };

      expect(tool.title).toBe(constructable.title);
    });

    it('returns empty string when constructable is undefined', () => {
      const tool = new InlineToolAdapter({
        ...createInlineToolOptions(),
        constructable: undefined as unknown as InlineToolAdapterOptions['constructable'],
      });

      expect(tool.title).toBe('');
    });

    it('returns empty string when constructable title is undefined', () => {
      const tool = new InlineToolAdapter({
        ...createInlineToolOptions(),
        constructable: {} as InlineToolAdapterOptions['constructable'],
      });

      expect(tool.title).toBe('');
    });
  });

  describe('.isInternal', () => {
    it('reflects provided value', () => {
      const tool = new InlineToolAdapter(createInlineToolOptions());
      const internalTool = new InlineToolAdapter({
        ...createInlineToolOptions(),
        isInternal: true,
      });

      expect(tool.isInternal).toBe(false);
      expect(internalTool.isInternal).toBe(true);
    });
  });

  describe('.settings', () => {
    it('returns user configuration', () => {
      const options = createInlineToolOptions();
      const tool = new InlineToolAdapter(options);

      expect(tool.settings).toStrictEqual(options.config.config);
    });

    it('includes default placeholder when tool is default', () => {
      const options = {
        ...createInlineToolOptions(),
        isDefault: true,
      } as InlineToolAdapterOptions;
      const tool = new InlineToolAdapter(options);

      expect(tool.settings).toStrictEqual({
        ...options.config.config,
        placeholder: options.defaultPlaceholder,
      });
    });
  });

  describe('.sanitizeConfig', () => {
    it('returns constructable sanitize config', () => {
      const options = createInlineToolOptions();
      const tool = new InlineToolAdapter(options);

      expect(tool.sanitizeConfig).toStrictEqual(options.constructable.sanitize);
    });
  });

  describe('type guards', () => {
    it('identify tool type correctly', () => {
      const tool = new InlineToolAdapter(createInlineToolOptions());

      expect(tool.isBlock()).toBe(false);
      expect(tool.isInline()).toBe(true);
      expect(tool.isTune()).toBe(false);
    });
  });

  describe('.prepare', () => {
    it('invokes constructable prepare with tool context', async () => {
      const options = createInlineToolOptions();
      const prepare = vi.fn();

      options.constructable.prepare = prepare;
      const tool = new InlineToolAdapter(options);

      await tool.prepare();

      expect(prepare).toHaveBeenCalledWith({
        toolName: tool.name,
        config: tool.settings,
      });
    });

    it('does nothing when constructable prepare is absent', async () => {
      const tool = new InlineToolAdapter({
        ...createInlineToolOptions(),
        constructable: {} as InlineToolAdapterOptions['constructable'],
      });

      const result = await tool.prepare();

      expect(result).toBeUndefined();
    });
  });

  describe('.reset', () => {
    it('invokes constructable reset', async () => {
      const options = createInlineToolOptions();
      const reset = vi.fn();

      options.constructable.reset = reset;
      const tool = new InlineToolAdapter(options);

      await tool.reset();

      expect(reset).toHaveBeenCalledTimes(1);
    });

    it('does nothing when constructable reset is absent', async () => {
      const tool = new InlineToolAdapter({
        ...createInlineToolOptions(),
        constructable: {} as InlineToolAdapterOptions['constructable'],
      });

      const result = await tool.reset();

      expect(result).toBeUndefined();
    });
  });

  describe('.getMissingMethods', () => {
    it('returns all required methods when constructable prototype is missing', () => {
      const tool = new InlineToolAdapter({
        ...createInlineToolOptions(),
        constructable: {} as InlineToolAdapterOptions['constructable'],
      });
      const requiredMethods = ['render', 'surround'];

      expect(tool.getMissingMethods(requiredMethods)).toStrictEqual(requiredMethods);
    });

    it('returns methods missing on the prototype', () => {
      const options = createInlineToolOptions();

      /**
       *
       */
      class ConstructableWithRender extends (options.constructable as unknown as { new (args: { api: object; config: ToolSettings }): InlineToolInstance }) {
        /**
         *
         */
        public render(): void {}
      }

      const tool = new InlineToolAdapter({
        ...options,
        constructable: ConstructableWithRender as unknown as InlineToolAdapterOptions['constructable'],
      });
      const requiredMethods = ['render', 'surround'];

      expect(tool.getMissingMethods(requiredMethods)).toStrictEqual([ 'surround' ]);
    });

    it('returns empty array when all methods are implemented', () => {
      const options = createInlineToolOptions();

      /**
       *
       */
      class ConstructableWithAllMethods extends (options.constructable as unknown as { new (args: { api: object; config: ToolSettings }): InlineToolInstance }) {
        /**
         *
         */
        public render(): void {}

        /**
         *
         */
        public surround(): void {}
      }

      const tool = new InlineToolAdapter({
        ...options,
        constructable: ConstructableWithAllMethods as unknown as InlineToolAdapterOptions['constructable'],
      });
      const requiredMethods = ['render', 'surround'];

      expect(tool.getMissingMethods(requiredMethods)).toStrictEqual([]);
    });
  });

  describe('.shortcut', () => {
    it('prefers user shortcut over constructable shortcut', () => {
      const options = createInlineToolOptions();
      const tool = new InlineToolAdapter(options);

      expect(tool.shortcut).toBe(options.config.shortcut);
    });

    it('falls back to constructable shortcut', () => {
      const options = createInlineToolOptions();
      const tool = new InlineToolAdapter({
        ...options,
        config: {
          ...options.config,
          shortcut: undefined,
        },
      });

      expect(tool.shortcut).toBe(options.constructable.shortcut);
    });
  });

  describe('.create', () => {
    it('returns instance of constructable class', () => {
      const options = createInlineToolOptions();
      const tool = new InlineToolAdapter(options);

      expect(tool.create()).toBeInstanceOf(options.constructable as unknown as { new (): InlineToolInstance });
    });

    it('passes api and config to constructable instance', () => {
      const options = createInlineToolOptions();
      const tool = new InlineToolAdapter(options);

      const instance = tool.create() as unknown as InlineToolInstance & { api: InlineToolAdapterOptions['api']; config: ToolSettings };

      expect(instance.api).toBe(options.api);
      expect(instance.config).toStrictEqual(options.config.config);
    });
  });

  describe('.isReadOnlySupported', () => {
    it('returns constructable flag when present', () => {
      const tool = new InlineToolAdapter(createInlineToolOptions());

      expect(tool.isReadOnlySupported).toBe(true);
    });

    it('returns false when constructable flag is absent', () => {
      const tool = new InlineToolAdapter({
        ...createInlineToolOptions(),
        constructable: {} as InlineToolAdapterOptions['constructable'],
      });

      expect(tool.isReadOnlySupported).toBe(false);
    });
  });
});
