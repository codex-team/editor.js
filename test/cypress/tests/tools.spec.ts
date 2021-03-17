// eslint-disable-next-line spaced-comment
/// <reference path="../support/index.d.ts" />

import ToolsCollection from '../../../src/components/tools/collection'
import ToolsFactory from '../../../src/components/tools/factory';
import Paragraph from '../../../src/tools/paragraph/dist/bundle';
import LinkInlineTool from '../../../src/components/inline-tools/inline-tool-link';
import InlineTool from '../../../src/components/tools/inline';
import BlockTool from '../../../src/components/tools/block';
import MoveUpTune from '../../../src/components/block-tunes/block-tune-move-up';
import BlockTune from '../../../src/components/tools/tune';
import BaseTool from '../../../src/components/tools/base';

const FakeTool = {
  isBlock() {
    return false;
  },
  isInline() {
    return false;
  },
  isTune() {
    return false;
  },
  isInternal: false,
};

const FakeBlockTool = {
  ...FakeTool,
  isBlock() {
    return true;
  },
};

const FakeInlineTool = {
  ...FakeTool,
  isInline() {
    return true;
  }
};

const FakeBlockTune = {
  ...FakeTool,
  isTune() {
    return true;
  }
};

describe('Unit test Tools utilities', () => {
  context('ToolsFactory', () => {
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

    beforeEach(() => {
      factory = new ToolsFactory(
        config,
        {
          placeholder: 'Placeholder',
          defaultBlock: 'paragraph'
        } as any,
        {} as any
      );
    });

    context('.get', () => {
      it('should return appropriate tool object', () => {
        const tool = factory.get('link');

        expect(tool.name).to.be.eq('link');
      });

      it('should return InlineTool object for inline tool', () => {
        const tool = factory.get('link');

        expect(tool instanceof InlineTool).to.be.true;
      });

      it('should return BlockTool object for block tool', () => {
        const tool = factory.get('paragraph');

        expect(tool instanceof BlockTool).to.be.true;
      });

      it('should return BlockTune object for tune', () => {
        const tool = factory.get('moveUp');

        expect(tool instanceof BlockTune).to.be.true;
      });
    });
  });

  context('ToolsCollection', () => {
    let collection;
    const fakeTools = [
      ['block1', FakeBlockTool],
      ['inline1', FakeInlineTool],
      ['block2', { ...FakeBlockTool, isInternal: true }],
      ['tune1', FakeBlockTune],
      ['block3', FakeBlockTool],
      ['inline2', { ...FakeInlineTool, isInternal: true }],
      ['tune2', FakeBlockTune],
      ['tune3', { ...FakeBlockTune, isInternal: true }],
      ['block3', FakeInlineTool],
      ['block4', FakeBlockTool],
    ];

    beforeEach(() => {
      collection = new ToolsCollection(fakeTools as any);
    })

    it('should be instance of Map', () => {
      expect(collection instanceof Map).to.be.true;
    });

    context('.block', () => {
      it('should return new instance of ToolsCollection', () => {
        expect(collection.block instanceof ToolsCollection).to.be.true;
      });

      it('result should contain only block tools', () => {
        expect(
          Array
            .from(
              collection.block.values()
            )
            .every((tool: BlockTool) => tool.isBlock())
        ).to.be.true;
      });
    });

    context('.inline', () => {
      it('should return new instance of ToolsCollection', () => {
        expect(collection.inline instanceof ToolsCollection).to.be.true;
      });

      it('result should contain only inline tools', () => {
        expect(
          Array
            .from(
              collection.inline.values()
            )
            .every((tool: InlineTool) => tool.isInline())
        ).to.be.true;
      });
    });

    context('.tune', () => {
      it('should return new instance of ToolsCollection', () => {
        expect(collection.tune instanceof ToolsCollection).to.be.true;
      });

      it('result should contain only block tools', () => {
        expect(
          Array
            .from(
              collection.tune.values()
            )
            .every((tool: BlockTune) => tool.isTune())
        ).to.be.true;
      });
    });

    context('.internal', () => {
      it('should return new instance of ToolsCollection', () => {
        expect(collection.internal instanceof ToolsCollection).to.be.true;
      });

      it('result should contain only internal tools', () => {
        expect(
          Array
            .from(
              collection.internal.values()
            )
            .every((tool: BaseTool) => tool.isInternal)
        ).to.be.true;
      });
    });

    context('.external', () => {
      it('should return new instance of ToolsCollection', () => {
        expect(collection.external instanceof ToolsCollection).to.be.true;
      });

      it('result should contain only external tools', () => {
        expect(
          Array
            .from(
              collection.external.values()
            )
            .every((tool: BaseTool) => !tool.isInternal)
        ).to.be.true;
      });
    });

    context('mixed access', () => {
      context('.tune.internal', () => {
        it('should return only internal tunes', () => {
          expect(
            Array
              .from(
                collection.tune.internal.values()
              )
              .every((tool: BlockTune) => tool.isTune() && tool.isInternal)
          ).to.be.true;
        });
      });

      context('.external.block', () => {
        it('should return only external block tools', () => {
          expect(
            Array
              .from(
                collection.external.block.values()
              )
              .every((tool: BlockTool) => tool.isBlock() && !tool.isInternal)
          ).to.be.true;
        });
      });
    });
  })
});
