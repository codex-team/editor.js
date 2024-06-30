/* eslint-disable @typescript-eslint/no-explicit-any */
/* tslint:disable:max-classes-per-file */
import { ToolSettings } from '../../../../types';
import { ToolType } from '../../../../src/components/tools/base';
import BlockTune from '../../../../src/components/tools/tune';
import { BlockTuneData } from '../../../../types/block-tunes/block-tune-data';

describe('BlockTune', () => {
  /**
   * Mock for BlockTune constructor options
   */
  const options = {
    name: 'blockTune',
    constructable: class {
      public static reset;
      public static prepare;

      public api: object;
      public config: ToolSettings;
      public data: BlockTuneData;
      public block: object;

      // eslint-disable-next-line jsdoc/require-jsdoc
      constructor({ api, config, block, data }) {
        this.api = api;
        this.config = config;
        this.block = block;
        this.data = data;
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

  it('.type should return ToolType.Tune', () => {
    const tool = new BlockTune(options as any);

    expect(tool.type).to.be.eq(ToolType.Tune);
  });

  it('.name should return correct value', () => {
    const tool = new BlockTune(options as any);

    expect(tool.name).to.be.eq(options.name);
  });

  it('.isInternal should return correct value', () => {
    const tool1 = new BlockTune(options as any);
    const tool2 = new BlockTune({
      ...options,
      isInternal: true,
    } as any);

    expect(tool1.isInternal).to.be.false;
    expect(tool2.isInternal).to.be.true;
  });

  it('.settings should return correct value', () => {
    const tool = new BlockTune(options as any);

    expect(tool.settings).to.be.deep.eq(options.config.config);
  });

  it('.isBlock() should return false', () => {
    const tool = new BlockTune(options as any);

    expect(tool.isBlock()).to.be.false;
  });

  it('.isInline() should return false', () => {
    const tool = new BlockTune(options as any);

    expect(tool.isInline()).to.be.false;
  });

  it('.isTune() should return true', () => {
    const tool = new BlockTune(options as any);

    expect(tool.isTune()).to.be.true;
  });

  context('.prepare()', () => {
    it('should call Tool prepare method', () => {
      options.constructable.prepare = cy.stub();
      const tool = new BlockTune(options as any);

      tool.prepare();

      expect(options.constructable.prepare).to.have.been.calledWithMatch({
        toolName: tool.name,
        config: tool.settings,
      });
    });

    it('should not fail if Tool prepare method is not exist', () => {
      const tool = new BlockTune({
        ...options,
        constructable: {},
      } as any);

      expect(tool.prepare).to.not.throw;
    });
  });

  context('.reset()', () => {
    it('should call Tool reset method', () => {
      options.constructable.reset = cy.stub();
      const tool = new BlockTune(options as any);

      tool.reset();

      expect(options.constructable.reset).to.be.calledOnce;
    });

    it('should not fail if Tool reset method is not exist', () => {
      const tool = new BlockTune({
        ...options,
        constructable: {},
      } as any);

      expect(tool.reset).to.not.throw;
    });
  });

  context('.create()', () => {
    const tool = new BlockTune(options as any);
    const data = { text: 'text' };
    const blockAPI = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      method(): void {},
    };

    it('should return Tool instance', () => {
      expect(tool.create(data, blockAPI as any)).to.be.instanceOf(options.constructable);
    });

    it('should return Tool instance with passed data', () => {
      const instance = tool.create(data, blockAPI as any) as any;

      expect(instance.data).to.be.deep.eq(data);
    });

    it('should return Tool instance with passed BlockAPI object', () => {
      const instance = tool.create(data, blockAPI as any) as any;

      expect(instance.block).to.be.deep.eq(blockAPI);
    });

    it('should return Tool instance with passed API object', () => {
      const instance = tool.create(data, blockAPI as any) as any;

      expect(instance.api).to.be.deep.eq(options.api);
    });

    it('should return Tool instance with passed settings', () => {
      const instance = tool.create(data, blockAPI as any) as any;

      expect(instance.config).to.be.deep.eq(options.config.config);
    });
  });
});
