import type EditorJS from '../../../types';
import type { BlockAPI } from '../../../types';
import { nanoid } from 'nanoid';

/**
 *
 */
class ExampleTune {
  protected data: object;
  protected block: BlockAPI;

  protected wrapper: object;
  /**
   *
   * @param root0
   */
  constructor({ data, block }) {
    this.data = data;
    this.block = block;

    this.wrapper = undefined;
  }

  /**
   * Tell editor.js that this Tool is a Block Tune
   *
   * @returns {boolean}
   */
  public static get isTune(): boolean {
    return true;
  }

  /**
   * CSS selectors used in Tune
   */
  public static get CSS(): object {
    return {
      toggler: 'cdx-text-variant__toggler',
    };
  }

  /**
   * Create Tunes controls wrapper that will be appended to the Block Tunes panel
   *
   * @returns {Element}
   */
  public render(): Element {
    return document.createElement('div');
  }

  /**
   * Returns Tune state
   *
   * @returns {string}
   */
  public save(): object | string {
    return this.data || '';
  }
}

it('Should update tune settings using update method of blocks api', () => {
  // Create Editor
  const blocks = [
    {
      id: nanoid(),
      type: 'paragraph',
      data: {
        text: 'First block',
      },
      tunes: {
        exampleTune: 'citation',
      },
    },
  ];

  cy.createEditor({
    tools: {
      exampleTune: ExampleTune,
    },
    tunes: ['exampleTune'],
  }).as('editorInstance');

  cy.get<EditorJS>('@editorInstance')
    .render({
      blocks,
    });

  // Update the tunes data of a block
  // Check if it is updated
  cy.get<EditorJS>('@editorInstance')
    .then(async (editor) => {
      await editor.blocks.update(editor.blocks.getBlockByIndex(0).id, {}, {
        exampleTune: 'test',
      });
      const data = await editor.save();

      const actual = JSON.stringify(data.blocks[0].tunes);
      const expected = JSON.stringify({ exampleTune: 'test' });
      expect(actual).to.eq(expected);
    });
});
