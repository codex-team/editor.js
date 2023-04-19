/* eslint-disable @typescript-eslint/no-explicit-any */
import ToolsCollection from '../../../../src/components/tools/collection';
import BlockTool from '../../../../src/components/tools/block';
import InlineTool from '../../../../src/components/tools/inline';
import BlockTune from '../../../../src/components/tools/tune';
import BaseTool from '../../../../src/components/tools/base';

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

/**
 * Unit tests for ToolsCollection class
 */
describe('ToolsCollection', (): void => {
  let collection;

  /**
   * Mock for Tools in collection
   */
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
