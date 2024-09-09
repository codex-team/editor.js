/* eslint-disable @typescript-eslint/no-explicit-any */
import LinkInlineTool from '../../../../src/components/inline-tools/inline-tool-link';
import MoveUpTune from '../../../../src/components/block-tunes/block-tune-move-up';
import ToolsFactory from '../../../../src/components/tools/factory';
import InlineToolAdapter from '../../../../src/components/tools/inline';
import BlockToolAdapter from '../../../../src/components/tools/block';
import BlockTuneAdapter from '../../../../src/components/tools/tune';
import Paragraph from '@editorjs/paragraph';

describe('ToolsFactory', (): void => {
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
      {
        getMethodsForTool(): object {
          return {
            prop1: 'prop1',
            prop2: 'prop2',
          };
        },
      } as any
    );
  });

  context('.get', (): void => {
    it('should return appropriate tool object', (): void => {
      const tool = factory.get('link');

      expect(tool.name).to.be.eq('link');
    });

    it('should return InlineTool object for inline tool', (): void => {
      const tool = factory.get('link');

      expect(tool instanceof InlineToolAdapter).to.be.true;
    });

    it('should return BlockTool object for block tool', (): void => {
      const tool = factory.get('paragraph');

      expect(tool instanceof BlockToolAdapter).to.be.true;
    });

    it('should return BlockTune object for tune', (): void => {
      const tool = factory.get('moveUp');

      expect(tool instanceof BlockTuneAdapter).to.be.true;
    });
  });
});
