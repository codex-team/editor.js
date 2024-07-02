/* eslint-disable @typescript-eslint/no-explicit-any */
/* tslint:disable:max-classes-per-file */
import { ToolSettings } from '../../../../types';
import { ToolType } from '../../../../src/components/tools/base';
import InlineTool from '../../../../src/components/tools/inline';

describe('InlineTool', () => {
  /**
   * Mock for InlineTool constructor options
   */
  const options = {
    name: 'inlineTool',
    constructable: class {
      public static sanitize = {
        rule1: 'rule1',
      };

      public static title = 'Title';

      public static reset;
      public static prepare;

      public static shortcut = 'CTRL+N';

      public api: object;
      public config: ToolSettings;

      /**
       * @param options - constructor options
       * @param options.api - EditorAPI
       * @param options.config - tool config
       */
      constructor({ api, config }) {
        this.api = api;
        this.config = config;
      }
    },
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
    },
    isDefault: false,
    isInternal: false,
    defaultPlaceholder: 'Default placeholder',
  };

  it('.type should return ToolType.Inline', () => {
    const tool = new InlineTool(options as any);

    expect(tool.type).to.be.eq(ToolType.Inline);
  });

  it('.name should return correct value', () => {
    const tool = new InlineTool(options as any);

    expect(tool.name).to.be.eq(options.name);
  });

  it('.title should return correct title', () => {
    const tool = new InlineTool(options as any);

    expect(tool.title).to.be.eq(options.constructable.title);
  });

  it('.isInternal should return correct value', () => {
    const tool1 = new InlineTool(options as any);
    const tool2 = new InlineTool({
      ...options,
      isInternal: true,
    } as any);

    expect(tool1.isInternal).to.be.false;
    expect(tool2.isInternal).to.be.true;
  });

  it('.settings should return correct value', () => {
    const tool = new InlineTool(options as any);

    expect(tool.settings).to.be.deep.eq(options.config.config);
  });

  it('.sanitizeConfig should return correct value', () => {
    const tool = new InlineTool(options as any);

    expect(tool.sanitizeConfig).to.be.deep.eq(options.constructable.sanitize);
  });

  it('.isBlock() should return false', () => {
    const tool = new InlineTool(options as any);

    expect(tool.isBlock()).to.be.false;
  });

  it('.isInline() should return true', () => {
    const tool = new InlineTool(options as any);

    expect(tool.isInline()).to.be.true;
  });

  it('.isTune() should return false', () => {
    const tool = new InlineTool(options as any);

    expect(tool.isTune()).to.be.false;
  });

  context('.prepare()', () => {
    it('should call Tool prepare method', () => {
      options.constructable.prepare = cy.stub();
      const tool = new InlineTool(options as any);

      tool.prepare();

      expect(options.constructable.prepare).to.have.been.calledWithMatch({
        toolName: tool.name,
        config: tool.settings,
      });
    });

    it('should not fail if Tool prepare method is not exist', () => {
      const tool = new InlineTool({
        ...options,
        constructable: {},
      } as any);

      expect(tool.prepare).to.not.throw;
    });
  });

  context('.reset()', () => {
    it('should call Tool reset method', () => {
      options.constructable.reset = cy.stub();
      const tool = new InlineTool(options as any);

      tool.reset();

      expect(options.constructable.reset).to.be.calledOnce;
    });

    it('should not fail if Tool reset method is not exist', () => {
      const tool = new InlineTool({
        ...options,
        constructable: {},
      } as any);

      expect(tool.reset).to.not.throw;
    });
  });

  context('.shortcut', () => {
    it('should return user provided shortcut', () => {
      const tool = new InlineTool(options as any);

      expect(tool.shortcut).to.be.eq(options.config.shortcut);
    });

    it('should return Tool provided shortcut if user one is not specified', () => {
      const tool = new InlineTool({
        ...options,
        config: {
          ...options.config,
          shortcut: undefined,
        },
      } as any);

      expect(tool.shortcut).to.be.eq(options.constructable.shortcut);
    });
  });

  context('.create()', () => {
    const tool = new InlineTool(options as any);

    it('should return Tool instance', () => {
      expect(tool.create()).to.be.instanceOf(options.constructable);
    });

    it('should return Tool instance with passed API object', () => {
      const instance = tool.create() as any;

      expect(instance.api).to.be.deep.eq(options.api);
    });

    it('should return Tool instance with passed config', () => {
      const instance = tool.create() as any;

      expect(instance.config).to.be.deep.eq(options.config.config);
    });
  });
});
