/* tslint:disable:max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any, jsdoc/require-jsdoc */
import Tools from '../../../../src/components/modules/tools';
import { EditorConfig } from '../../../../types';
import BlockTool from '../../../../src/components/tools/block';

describe('Tools module', () => {
  const defaultConfig = {
    tools: {},
  };

  /**
   * Construct Tools module for testing purposes
   *
   * @param config - Editor config
   */
  function constructModule(config: EditorConfig = defaultConfig): Tools {
    const module = new Tools({
      config,
      eventsDispatcher: {},
    } as any);

    const APIMethods = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      method(): void {},
    };

    /**
     * Module state should be Editor modules, so we mock required ones only
     */
    module.state = {
      API: {
        getMethodsForTool(): typeof APIMethods {
          return APIMethods;
        },
      },
    } as any;

    return module;
  }

  context('.prepare()', () => {
    it('should return Promise resolved to void', async () => {
      const module = constructModule();

      let err;

      try {
        await module.prepare();
      } catch (e) {
        err = e;
      }

      expect(err).to.be.undefined;
    });

    it('should throw an error if tools config is corrupted', async () => {
      const module = constructModule({
        tools: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          corruptedTool: 'value',
        },
      });

      let err;

      try {
        await module.prepare();
      } catch (e) {
        err = e;
      }

      expect(err).to.be.instanceOf(Error);
    });

    // eslint-disable-next-line cypress/no-async-tests
    it('should call Tools prepare method with user config', async () => {
      class WithSuccessfulPrepare {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        public static prepare = cy.stub();
      }

      const config = {
        property: 'value',
      };

      const module = constructModule({
        defaultBlock: 'withSuccessfulPrepare',
        tools: {
          withSuccessfulPrepare: {
            class: WithSuccessfulPrepare as any,
            config,
          },
        },
      });

      await module.prepare();

      expect(WithSuccessfulPrepare.prepare).to.be.calledWithExactly({
        toolName: 'withSuccessfulPrepare',
        config,
      });
    });
  });

  context('collection accessors', () => {
    let module: Tools;

    beforeEach(async () => {
      module = constructModule({
        defaultBlock: 'withoutPrepare',
        tools: {
          withSuccessfulPrepare: {
            class: class {
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              public static prepare(): void {}
            } as any,
            inlineToolbar: [ 'inlineTool2' ],
            tunes: [ 'blockTune2' ],
          },
          withFailedPrepare: class {
            public static prepare(): void {
              throw new Error();
            }
          } as any,
          withoutPrepare: {
            class: class {} as any,
            inlineToolbar: false,
            tunes: false,
          },
          blockTool: {
            class: class {} as any,
            inlineToolbar: true,
          },
          blockToolWithoutSettings: class {} as any,
          inlineTool: class {
            public static isInline = true;

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            public render(): void {}

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            public surround(): void {}

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            public checkState(): void {}
          } as any,
          inlineTool2: class {
            public static isInline = true;

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            public render(): void {}

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            public surround(): void {}

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            public checkState(): void {}
          } as any,
          /**
           * This tool will be unavailable as it doesn't have required methods
           */
          unavailableInlineTool: class {
            public static isInline = true;
          } as any,
          blockTune: class {
            public static isTune = true;
          } as any,
          blockTune2: class {
            public static isTune = true;
          } as any,
          unavailableBlockTune: class {
            public static isTune = true;

            public static prepare(): void {
              throw new Error();
            }
          } as any,
        },
        inlineToolbar: ['inlineTool2', 'inlineTool'],
        tunes: ['blockTune2', 'blockTune'],
      });

      await module.prepare();
    });

    context('.available', () => {
      it('should return Map instance', () => {
        expect(module.available).to.be.instanceOf(Map);
      });

      it('should contain only ready to use Tools', () => {
        expect(module.available.has('withSuccessfulPrepare')).to.be.true;
        expect(module.available.has('withoutPrepare')).to.be.true;
        expect(module.available.has('withFailedPrepare')).to.be.false;
        expect(module.available.has('unavailableInlineTool')).to.be.false;
      });
    });

    context('.unavailable', () => {
      it('should return Map instance', () => {
        expect(module.unavailable).to.be.instanceOf(Map);
      });

      it('should contain unavailable Tools', () => {
        expect(module.unavailable.has('withSuccessfulPrepare')).to.be.false;
        expect(module.unavailable.has('withoutPrepare')).to.be.false;
        expect(module.unavailable.has('withFailedPrepare')).to.be.true;
        expect(module.unavailable.has('unavailableInlineTool')).to.be.true;
      });
    });

    context('.inlineTools', () => {
      it('should return Map instance', () => {
        expect(module.inlineTools).to.be.instanceOf(Map);
      });

      it('should contain only available Inline Tools', () => {
        expect(module.inlineTools.has('inlineTool')).to.be.true;
        expect(module.inlineTools.has('unavailableInlineTool')).to.be.false;
        expect(Array.from(module.inlineTools.values()).every(tool => tool.isInline())).to.be.true;
      });
    });

    context('.blockTools', () => {
      it('should return Map instance', () => {
        expect(module.blockTools).to.be.instanceOf(Map);
      });

      it('should contain only available Block Tools', () => {
        expect(module.blockTools.has('withSuccessfulPrepare')).to.be.true;
        expect(module.blockTools.has('withoutPrepare')).to.be.true;
        expect(module.blockTools.has('withFailedPrepare')).to.be.false;
        expect(Array.from(module.blockTools.values()).every(tool => tool.isBlock())).to.be.true;
      });

      it('Block Tools should contain default tunes if no settings is specified', () => {
        const tool = module.blockTools.get('blockToolWithoutSettings');

        expect(tool.tunes.has('delete')).to.be.true;
        expect(tool.tunes.has('moveUp')).to.be.true;
        expect(tool.tunes.has('moveDown')).to.be.true;
      });

      it('Block Tools should contain default tunes', () => {
        const tool = module.blockTools.get('blockTool');

        expect(tool.tunes.has('delete')).to.be.true;
        expect(tool.tunes.has('moveUp')).to.be.true;
        expect(tool.tunes.has('moveDown')).to.be.true;
      });

      it('Block Tools should contain tunes in correct order', () => {
        let tool = module.blockTools.get('blockTool');

        expect(tool.tunes.has('blockTune')).to.be.true;
        expect(tool.tunes.has('blockTune2')).to.be.true;
        expect(Array.from(tool.tunes.keys())).to.be.deep.eq(['blockTune2', 'blockTune', 'moveUp', 'delete', 'moveDown']);

        tool = module.blockTools.get('withSuccessfulPrepare');

        expect(tool.tunes.has('blockTune')).to.be.false;
        expect(tool.tunes.has('blockTune2')).to.be.true;

        tool = module.blockTools.get('withoutPrepare');

        expect(tool.tunes.has('blockTune')).to.be.false;
        expect(tool.tunes.has('blockTune2')).to.be.false;
      });

      it('Block Tools should contain inline tools in correct order', () => {
        let tool = module.blockTools.get('blockTool');

        expect(tool.inlineTools.has('inlineTool')).to.be.true;
        expect(tool.inlineTools.has('inlineTool2')).to.be.true;
        expect(Array.from(tool.inlineTools.keys())).to.be.deep.eq(['inlineTool2', 'inlineTool']);

        tool = module.blockTools.get('withSuccessfulPrepare');

        expect(tool.inlineTools.has('inlineTool')).to.be.false;
        expect(tool.inlineTools.has('inlineTool2')).to.be.true;

        tool = module.blockTools.get('withoutPrepare');

        expect(tool.inlineTools.has('inlineTool')).to.be.false;
        expect(tool.inlineTools.has('inlineTool2')).to.be.false;
      });
    });

    context('.blockTunes', () => {
      it('should return Map instance', () => {
        expect(module.blockTunes).to.be.instanceOf(Map);
      });

      it('should contain only available Block Tunes', () => {
        expect(module.blockTunes.has('blockTune')).to.be.true;
        expect(module.blockTunes.has('unavailableBlockTune')).to.be.false;
        expect(Array.from(module.blockTunes.values()).every(tool => tool.isTune())).to.be.true;
      });
    });

    context('.internal', () => {
      it('should return Map instance', () => {
        expect(module.internal).to.be.instanceOf(Map);
      });

      it('should contain only internal tunes', () => {
        expect(Array.from(module.internal.values()).every(tool => tool.isInternal)).to.be.true;
      });
    });

    context('.defaultTools', () => {
      /**
       * @todo add check if user provided default tool is not Block Tool
       */
      it('should return BlockTool instance', () => {
        expect(module.defaultTool).to.be.instanceOf(BlockTool);
      });

      it('should return default Tool', () => {
        expect(module.defaultTool.isDefault).to.be.true;
      });
    });
  });
});
