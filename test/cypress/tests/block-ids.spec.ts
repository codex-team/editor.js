import Header from '../../../example/tools/header';
import { nanoid } from 'nanoid';

describe.only('Block ids', () => {
  beforeEach(() => {
    if (this && this.editorInstance) {
      this.editorInstance.destroy();
    } else {
      cy.createEditor({
        tools: {
          header: Header,
        },
      }).as('editorInstance');
    }
  });

  it('Should generate unique block ids for new blocks', () => {
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('First block ')
      .type('{enter}')
      .get('div.ce-block')
      .last()
      .type('Second block ')
      .type('{enter}');

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('li.ce-toolbox__button[data-tool=header]')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .last()
      .click()
      .type('Header');

    cy.get('@editorInstance')
      .then(async (editor: any) => {
        const data = await editor.save();

        data.blocks.forEach(block => {
          expect(typeof block.id).to.eq('string');
        });
      });
  });

  it('should preserve passed ids', () => {
    const blocks = [
      {
        id: nanoid(),
        type: 'paragraph',
        data: {
          text: 'First block',
        },
      },
      {
        id: nanoid(),
        type: 'paragraph',
        data: {
          text: 'Second block',
        },
      },
    ];

    cy.get('@editorInstance')
      .render({
        blocks,
      });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .first()
      .click()
      .type('{movetoend} Some more text');

    cy.get('@editorInstance')
      .then(async (editor: any) => {
        const data = await editor.save();

        data.blocks.forEach((block, index) => {
          expect(block.id).to.eq(blocks[index].id);
        });
      });
  });

  it('should preserve passed ids if blocks were added', () => {
    const blocks = [
      {
        id: nanoid(),
        type: 'paragraph',
        data: {
          text: 'First block',
        },
      },
      {
        id: nanoid(),
        type: 'paragraph',
        data: {
          text: 'Second block',
        },
      },
    ];

    cy.get('@editorInstance')
      .render({
        blocks,
      });

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .first()
      .click()
      .type('{enter}')
      .next()
      .type('Middle block');

    cy.get('@editorInstance')
      .then(async (editor: any) => {
        const data = await editor.save();

        expect(data.blocks[0].id).to.eq(blocks[0].id);
        expect(data.blocks[2].id).to.eq(blocks[1].id);
      });
  });
});
