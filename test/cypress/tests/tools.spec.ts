// eslint-disable-next-line spaced-comment
/// <reference path="../support/index.d.ts" />

import ToolsCollection from '../../../src/components/tools/collection';
import ToolsFactory from '../../../src/components/tools/factory';
import Paragraph from '../../../src/tools/paragraph/dist/bundle';
import LinkInlineTool from '../../../src/components/inline-tools/inline-tool-link';
import InlineTool from '../../../src/components/tools/inline';
import BlockTool from '../../../src/components/tools/block';
import MoveUpTune from '../../../src/components/block-tunes/block-tune-move-up';
import BlockTune from '../../../src/components/tools/tune';
import BaseTool from '../../../src/components/tools/base';

const FakeTool = {
  isBlock(): boolean {
    return false;
  },
  isInline(): boolean {
    return false;
  },
  isTune(): boolean {
    return false;
  },
  isInternal: false,
};

const FakeBlockTool = {
  ...FakeTool,
  isBlock(): boolean {
    return true;
  },
};

const FakeInlineTool = {
  ...FakeTool,
  isInline(): boolean {
    return true;
  },
};

const FakeBlockTune = {
  ...FakeTool,
  isTune(): boolean {
    return true;
  },
};

describe('Unit test Tools utilities', (): void => {
  context('ToolsFactory', (): void => {
    let factory;
    const config = {
      paragraph: {
        class: Paragraph,
      },
      link: {
        class: LinkInlineTool,
      },
      moveUp: {
        class: MoveUpTune,
      },
    };

    beforeEach((): void => {
      factory = new ToolsFactory(
        config,
        {
          placeholder: 'Placeholder',
          defaultBlock: 'paragraph',
        } as any,
        {} as any
      );
    });

    context('.get', (): void => {
      it('should return appropriate tool object', (): void => {
        const tool = factory.get('link');

        expect(tool.name).to.be.eq('link');
      });

      it('should return InlineTool object for inline tool', (): void => {
        const tool = factory.get('link');

        expect(tool instanceof InlineTool).to.be.true;
      });

      it('should return BlockTool object for block tool', (): void => {
        const tool = factory.get('paragraph');

        expect(tool instanceof BlockTool).to.be.true;
      });

      it('should return BlockTune object for tune', (): void => {
        const tool = factory.get('moveUp');

        expect(tool instanceof BlockTune).to.be.true;
      });
    });
  });

  context('ToolsCollection', (): void => {
    let collection;
    const fakeTools = [
      ['block1', FakeBlockTool],
      ['inline1', FakeInlineTool],
      ['block2', {
        ...FakeBlockTool,
        isInternal: true,
      } ],
      ['tune1', FakeBlockTune],
      ['block3', FakeBlockTool],
      ['inline2', {
        ...FakeInlineTool,
        isInternal: true,
      } ],
      ['tune2', FakeBlockTune],
      ['tune3', {
        ...FakeBlockTune,
        isInternal: true,
      } ],
      ['block3', FakeInlineTool],
      ['block4', FakeBlockTool],
    ];

    beforeEach((): void => {
      collection = new ToolsCollection(fakeTools as any);
    });

    it('should be instance of Map', (): void => {
      expect(collection instanceof Map).to.be.true;
    });

    context('.blockTools', (): void => {
      it('should return new instance of ToolsCollection', (): void => {
        expect(collection.blockTools instanceof ToolsCollection).to.be.true;
      });

      it('result should contain only block tools', (): void => {
        expect(
          Array
            .from(
              collection.blockTools.values()
            )
            .every((tool: BlockTool) => tool.isBlock())
        ).to.be.true;
      });
    });

    context('.inlineTools', (): void => {
      it('should return new instance of ToolsCollection', (): void => {
        expect(collection.inlineTools instanceof ToolsCollection).to.be.true;
      });

      it('result should contain only inline tools', (): void => {
        expect(
          Array
            .from(
              collection.inlineTools.values()
            )
            .every((tool: InlineTool) => tool.isInline())
        ).to.be.true;
      });
    });

    context('.blockTunes', (): void => {
      it('should return new instance of ToolsCollection', (): void => {
        expect(collection.blockTunes instanceof ToolsCollection).to.be.true;
      });

      it('result should contain only block tools', (): void => {
        expect(
          Array
            .from(
              collection.blockTunes.values()
            )
            .every((tool: BlockTune) => tool.isTune())
        ).to.be.true;
      });
    });

    context('.internalTools', (): void => {
      it('should return new instance of ToolsCollection', (): void => {
        expect(collection.internalTools instanceof ToolsCollection).to.be.true;
      });

      it('result should contain only internal tools', (): void => {
        expect(
          Array
            .from(
              collection.internalTools.values()
            )
            .every((tool: BaseTool) => tool.isInternal)
        ).to.be.true;
      });
    });

    context('.externalTools', (): void => {
      it('should return new instance of ToolsCollection', (): void => {
        expect(collection.externalTools instanceof ToolsCollection).to.be.true;
      });

      it('result should contain only external tools', (): void => {
        expect(
          Array
            .from(
              collection.externalTools.values()
            )
            .every((tool: BaseTool) => !tool.isInternal)
        ).to.be.true;
      });
    });

    context('mixed access', (): void => {
      context('.blockTunes.internalTools', (): void => {
        it('should return only internal tunes', (): void => {
          expect(
            Array
              .from(
                collection.blockTunes.internalTools.values()
              )
              .every((tool: BlockTune) => tool.isTune() && tool.isInternal)
          ).to.be.true;
        });
      });

      context('.externalTools.blockTools', (): void => {
        it('should return only external block tools', (): void => {
          expect(
            Array
              .from(
                collection.externalTools.blockTools.values()
              )
              .every((tool: BlockTool) => tool.isBlock() && !tool.isInternal)
          ).to.be.true;
        });
      });
    });
  });
});
