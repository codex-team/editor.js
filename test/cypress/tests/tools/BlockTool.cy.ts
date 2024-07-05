/* eslint-disable @typescript-eslint/no-explicit-any */
/* tslint:disable:max-classes-per-file */
import { BlockToolData, ToolSettings } from '../../../../types';
import { ToolType } from '../../../../src/components/tools/base';
import BlockTool from '../../../../src/components/tools/block';
import InlineTool from '../../../../src/components/tools/inline';
import ToolsCollection from '../../../../src/components/tools/collection';

describe('BlockTool', () => {
  /**
   * Mock for BlockTool constructor options
   */
  const options = {
    name: 'blockTool',
    constructable: class {
      public static sanitize = {
        rule1: {
          div: true,
        },
      };

      public static toolbox = {
        icon: 'Tool icon',
        title: 'Tool title',
      };

      public static enableLineBreaks = true;

      public static pasteConfig = {
        tags: [ 'div' ],
      };

      public static conversionConfig = {
        import: 'import',
        export: 'export',
      };

      public static isReadOnlySupported = true;

      public static reset;
      public static prepare;

      public static shortcut = 'CTRL+N';

      public data: BlockToolData;
      public block: object;
      public readonly: boolean;
      public api: object;
      public config: ToolSettings;

      // eslint-disable-next-line jsdoc/require-jsdoc
      constructor({ data, block, readOnly, api, config }) {
        this.data = data;
        this.block = block;
        this.readonly = readOnly;
        this.api = api;
        this.config = config;
      }
    },
    config: {
      config: {
        option1: 'option1',
        option2: 'option2',
      },
      inlineToolbar: ['link', 'bold'],
      tunes: ['anchor', 'favorites'],
      shortcut: 'CMD+SHIFT+B',
      toolbox: {
        title: 'User Block Tool',
        icon: 'User icon',
      },
    },
    api: {
      prop1: 'prop1',
      prop2: 'prop2',
    },
    isDefault: false,
    isInternal: false,
    defaultPlaceholder: 'Default placeholder',
  };

  it('.type should return ToolType.Block', () => {
    const tool = new BlockTool(options as any);

    expect(tool.type).to.be.eq(ToolType.Block);
  });

  it('.name should return correct value', () => {
    const tool = new BlockTool(options as any);

    expect(tool.name).to.be.eq(options.name);
  });

  it('.isDefault should return correct value', () => {
    const tool1 = new BlockTool(options as any);
    const tool2 = new BlockTool({
      ...options,
      isDefault: true,
    } as any);

    expect(tool1.isDefault).to.be.false;
    expect(tool2.isDefault).to.be.true;
  });

  it('.isInternal should return correct value', () => {
    const tool1 = new BlockTool(options as any);
    const tool2 = new BlockTool({
      ...options,
      isInternal: true,
    } as any);

    expect(tool1.isInternal).to.be.false;
    expect(tool2.isInternal).to.be.true;
  });

  context('.settings', () => {
    it('should return correct value', () => {
      const tool = new BlockTool(options as any);

      expect(tool.settings).to.be.deep.eq(options.config.config);
    });

    it('should add default placeholder if Tool is default', () => {
      const tool = new BlockTool({
        ...options,
        isDefault: true,
      } as any);

      expect(tool.settings).to.have.property('placeholder').that.eq(options.defaultPlaceholder);
    });
  });

  context('.sanitizeConfig', () => {
    it('should return correct value', () => {
      const tool = new BlockTool(options as any);

      expect(tool.sanitizeConfig).to.be.deep.eq(options.constructable.sanitize);
    });

    it('should return composed config if there are enabled inline tools', () => {
      const tool = new BlockTool(options as any);

      const inlineTool = new InlineTool({
        name: 'inlineTool',
        constructable: class {
          public static sanitize = {
            b: true,
          };
        },
        api: {},
        config: {},
      } as any);

      tool.inlineTools = new ToolsCollection([ ['inlineTool', inlineTool] ]);

      const expected = options.constructable.sanitize;

      // tslint:disable-next-line:forin
      for (const key in expected) {
        expected[key] = {
          ...expected[key],
          b: true,
        };
      }

      expect(tool.sanitizeConfig).to.be.deep.eq(expected);
    });

    it('should return inline tools config if block one is not set', () => {
      const tool = new BlockTool({
        ...options,
        constructable: class {},
      } as any);

      const inlineTool1 = new InlineTool({
        name: 'inlineTool',
        constructable: class {
          public static sanitize = {
            b: true,
          };
        },
        api: {},
        config: {},
      } as any);

      const inlineTool2 = new InlineTool({
        name: 'inlineTool',
        constructable: class {
          public static sanitize = {
            a: true,
          };
        },
        api: {},
        config: {},
      } as any);

      tool.inlineTools = new ToolsCollection([ ['inlineTool', inlineTool1], ['inlineTool2', inlineTool2] ]);

      expect(tool.sanitizeConfig).to.be.deep.eq(Object.assign(
        {},
        inlineTool1.sanitizeConfig,
        inlineTool2.sanitizeConfig
      ));
    });

    it('should return empty object by default', () => {
      const tool = new BlockTool({
        ...options,
        constructable: class {},
      } as any);

      expect(tool.sanitizeConfig).to.be.deep.eq({});
    });
  });

  it('.isBlock() should return true', () => {
    const tool = new BlockTool(options as any);

    expect(tool.isBlock()).to.be.true;
  });

  it('.isInline() should return false', () => {
    const tool = new BlockTool(options as any);

    expect(tool.isInline()).to.be.false;
  });

  it('.isTune() should return false', () => {
    const tool = new BlockTool(options as any);

    expect(tool.isTune()).to.be.false;
  });

  it('.isReadOnlySupported should return correct value', () => {
    const tool = new BlockTool(options as any);

    expect(tool.isReadOnlySupported).to.be.eq(options.constructable.isReadOnlySupported);
  });

  it('.isLineBreaksEnabled should return correct value', () => {
    const tool = new BlockTool(options as any);

    expect(tool.isLineBreaksEnabled).to.be.eq(options.constructable.enableLineBreaks);
  });

  it('.conversionConfig should return correct value', () => {
    const tool = new BlockTool(options as any);

    expect(tool.conversionConfig).to.be.deep.eq(options.constructable.conversionConfig);
  });

  describe('.pasteConfig', () => {
    it('should return correct value', () => {
      const tool = new BlockTool(options as any);

      expect(tool.pasteConfig).to.be.deep.eq(options.constructable.pasteConfig);
    });

    it('should return false if `false` value was provided', () => {
      const optionsWithDisabledPaste = {
        ...options,
        constructable: class extends (options.constructable as any) {
          public static pasteConfig = false;
        },
      };
      const tool = new BlockTool(optionsWithDisabledPaste as any);

      expect(tool.pasteConfig).to.be.deep.eq(optionsWithDisabledPaste.constructable.pasteConfig);
    });

    it('should return empty object if getter isn\'t provided', () => {
      const optionsWithoutPasteConfig = {
        ...options,
        constructable: class extends (options.constructable as any) {
          public static pasteConfig = undefined;
        },
      };
      const tool = new BlockTool(optionsWithoutPasteConfig as any);

      expect(tool.pasteConfig).to.be.deep.eq({});
    });
  });

  context('.enabledInlineTools', () => {
    it('should return correct value', () => {
      const tool = new BlockTool(options as any);

      expect(tool.enabledInlineTools).to.be.deep.eq(options.config.inlineToolbar);
    });

    it('should return false by default', () => {
      const tool = new BlockTool({
        ...options,
        config: {
          ...options.config,
          inlineToolbar: undefined,
        },
      } as any);

      expect(tool.enabledInlineTools).to.be.false;
    });
  });

  it('.enabledBlockTunes should return correct value', () => {
    const tool = new BlockTool(options as any);

    expect(tool.enabledBlockTunes).to.be.deep.eq(options.config.tunes);
  });

  context('.prepare()', () => {
    it('should call Tool prepare method', () => {
      options.constructable.prepare = cy.stub();
      const tool = new BlockTool(options as any);

      tool.prepare();

      expect(options.constructable.prepare).to.have.been.calledWithMatch({
        toolName: tool.name,
        config: tool.settings,
      });
    });

    it('should not fail if Tool prepare method is not exist', () => {
      const tool = new BlockTool({
        ...options,
        constructable: {},
      } as any);

      expect(tool.prepare).to.not.throw;
    });
  });

  context('.reset()', () => {
    it('should call Tool reset method', () => {
      options.constructable.reset = cy.stub();
      const tool = new BlockTool(options as any);

      tool.reset();

      expect(options.constructable.reset).to.be.calledOnce;
    });

    it('should not fail if Tool reset method is not exist', () => {
      const tool = new BlockTool({
        ...options,
        constructable: {},
      } as any);

      expect(tool.reset).to.not.throw;
    });
  });

  context('.shortcut', () => {
    it('should return user provided shortcut', () => {
      const tool = new BlockTool(options as any);

      expect(tool.shortcut).to.be.eq(options.config.shortcut);
    });

    it('should return Tool provided shortcut if user one is not specified', () => {
      const tool = new BlockTool({
        ...options,
        config: {
          ...options.config,
          shortcut: undefined,
        },
      } as any);

      expect(tool.shortcut).to.be.eq(options.constructable.shortcut);
    });
  });

  context('.toolbox', () => {
    it('should return user provided toolbox config wrapped in array', () => {
      const tool = new BlockTool(options as any);

      expect(tool.toolbox).to.be.deep.eq([ options.config.toolbox ]);
    });

    it('should return Tool provided toolbox config wrapped in array if user one is not specified', () => {
      const tool = new BlockTool({
        ...options,
        config: {
          ...options.config,
          toolbox: undefined,
        },
      } as any);

      expect(tool.toolbox).to.be.deep.eq([ options.constructable.toolbox ]);
    });

    it('should merge Tool provided toolbox config and user one and wrap result in array in case both are objects', () => {
      const tool1 = new BlockTool({
        ...options,
        config: {
          ...options.config,
          toolbox: {
            title: options.config.toolbox.title,
          },
        },
      } as any);
      const tool2 = new BlockTool({
        ...options,
        config: {
          ...options.config,
          toolbox: {
            icon: options.config.toolbox.icon,
          },
        },
      } as any);

      expect(tool1.toolbox).to.be.deep.eq([ Object.assign({}, options.constructable.toolbox, { title: options.config.toolbox.title }) ]);
      expect(tool2.toolbox).to.be.deep.eq([ Object.assign({}, options.constructable.toolbox, { icon: options.config.toolbox.icon }) ]);
    });

    it('should replace Tool provided toolbox config with user defined config in case the first is an array and the second is an object', () => {
      const toolboxEntries = [
        {
          title: 'Toolbox entry 1',
        },
        {
          title: 'Toolbox entry 2',
        },
      ];
      const userDefinedToolboxConfig = {
        icon: options.config.toolbox.icon,
        title: options.config.toolbox.title,
      };
      const tool = new BlockTool({
        ...options,
        constructable: {
          ...options.constructable,
          toolbox: toolboxEntries,
        },
        config: {
          ...options.config,
          toolbox: userDefinedToolboxConfig,
        },
      } as any);

      expect(tool.toolbox).to.be.deep.eq([ userDefinedToolboxConfig ]);
    });

    it('should replace Tool provided toolbox config with user defined config in case the first is an object and the second is an array', () => {
      const userDefinedToolboxConfig = [
        {
          title: 'Toolbox entry 1',
        },
        {
          title: 'Toolbox entry 2',
        },
      ];
      const tool = new BlockTool({
        ...options,
        config: {
          ...options.config,
          toolbox: userDefinedToolboxConfig,
        },
      } as any);

      expect(tool.toolbox).to.be.deep.eq(userDefinedToolboxConfig);
    });

    it('should merge Tool provided toolbox config with user defined config in case both are arrays', () => {
      const toolboxEntries = [
        {
          title: 'Toolbox entry 1',
        },
      ];

      const userDefinedToolboxConfig = [
        {
          icon: 'Icon 1',
        },
        {
          icon: 'Icon 2',
          title: 'Toolbox entry 2',
        },
      ];

      const tool = new BlockTool({
        ...options,
        constructable: {
          ...options.constructable,
          toolbox: toolboxEntries,
        },
        config: {
          ...options.config,
          toolbox: userDefinedToolboxConfig,
        },
      } as any);

      const expected = userDefinedToolboxConfig.map((item, i) => {
        const toolToolboxEntry = toolboxEntries[i];

        if (toolToolboxEntry) {
          return {
            ...toolToolboxEntry,
            ...item,
          };
        }

        return item;
      });

      expect(tool.toolbox).to.be.deep.eq(expected);
    });

    it('should return undefined if user specifies false as a value', () => {
      const tool = new BlockTool({
        ...options,
        config: {
          ...options.config,
          toolbox: false,
        },
      } as any);

      expect(tool.toolbox).to.be.undefined;
    });

    it('should return undefined if Tool specifies false as a value', () => {
      const tool = new BlockTool({
        ...options,
        constructable: class {
          public static toolbox = false;
        },
      } as any);

      expect(tool.toolbox).to.be.undefined;
    });

    it('should return undefined if Tool provides empty config', () => {
      const tool = new BlockTool({
        ...options,
        constructable: class {
          public static toolbox = {};
        },
      } as any);

      expect(tool.toolbox).to.be.undefined;
    });
  });

  context('.create()', () => {
    const tool = new BlockTool(options as any);
    const data = { text: 'text' };
    const blockAPI = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      method(): void {},
    };

    it('should return Tool instance', () => {
      expect(tool.create(data, blockAPI as any, false)).to.be.instanceOf(options.constructable);
    });

    it('should return Tool instance with passed data', () => {
      const instance = tool.create(data, blockAPI as any, false) as any;

      expect(instance.data).to.be.deep.eq(data);
    });

    it('should return Tool instance with passed BlockAPI object', () => {
      const instance = tool.create(data, blockAPI as any, false) as any;

      expect(instance.block).to.be.deep.eq(blockAPI);
    });

    it('should return Tool instance with passed readOnly flag', () => {
      const instance1 = tool.create(data, blockAPI as any, false) as any;
      const instance2 = tool.create(data, blockAPI as any, true) as any;

      expect(instance1.readonly).to.be.eq(false);
      expect(instance2.readonly).to.be.eq(true);
    });

    it('should return Tool instance with passed API object', () => {
      const instance = tool.create(data, blockAPI as any, false) as any;

      expect(instance.api).to.be.deep.eq(options.api);
    });

    it('should return Tool instance with passed config', () => {
      const instance = tool.create(data, blockAPI as any, false) as any;

      expect(instance.config).to.be.deep.eq(options.config.config);
    });
  });
});
