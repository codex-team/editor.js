import Header from '@editorjs/header';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import { BlockAddedMutationType } from '../../../types/events/block/BlockAdded';
import { BlockChangedMutationType } from '../../../types/events/block/BlockChanged';
import { BlockRemovedMutationType } from '../../../types/events/block/BlockRemoved';
import { BlockMovedMutationType } from '../../../types/events/block/BlockMoved';

/**
 * @todo Add checks that correct block API object is passed to onChange
 * @todo Add cases for native inputs changes
 * @todo debug onChange firing on Block Tune toggling (see below)
 */
describe('onChange callback', () => {
  /**
   * Creates Editor instance
   *
   * @param blocks - list of blocks to prefill the editor
   */
  function createEditor(blocks = null): void {
    const config = {
      tools: {
        header: Header,
        code: Code,
      },
      onChange: (api, event): void => {
        console.log('something changed', api, event);
      },
      data: blocks ? {
        blocks,
      } : null,
    };

    cy.spy(config, 'onChange').as('onChange');

    cy.createEditor(config).as('editorInstance');
  }

  /**
   * Creates Editor instance with save inside the onChange event.
   *
   * @param blocks - list of blocks to prefill the editor
   */
  function createEditorWithSave(blocks = null): void {
    const config = {
      tools: {
        header: Header,
        code: Code,
        delimiter: Delimiter,
      },
      onChange: (api, event): void => {
        console.log('something changed', api, event);
        api.saver.save();
      },
      data: blocks ? {
        blocks,
      } : null,
    };

    cy.spy(config, 'onChange').as('onChange');

    cy.createEditor(config).as('editorInstance');
  }

  /**
   * EditorJS API is passed as the first parameter of the onChange callback
   */
  const EditorJSApiMock = Cypress.sinon.match.any;

  it('should fire onChange callback with correct index on block insertion above the current (by pressing Enter at the start)', () => {
    createEditor();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('{enter}');

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockAddedMutationType,
      detail: {
        target: {
          name: 'paragraph',
        },
        index: 0,
      },
    }));
  });

  it('should fire onChange callback with correct index on block insertion below the current (by pressing enter at the end)', () => {
    createEditor();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('some text')
      .type('{enter}');

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockAddedMutationType,
      detail: {
        target: {
          name: 'paragraph',
        },
        index: 1,
      },
    }));
  });

  it('should fire onChange callback on typing into block', () => {
    createEditor();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('some text');

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockChangedMutationType,
      detail: {
        index: 0,
      },
    }));
  });

  it('should fire onChange callback on block insertion with save inside onChange', () => {
    createEditorWithSave();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-popover-item[data-item-name=delimiter]')
      .click();

    cy.get('@onChange').should('be.calledThrice');
    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockRemovedMutationType,
      detail: {
        index: 0,
        target: {
          name: 'paragraph',
        },
      },
    }));

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockAddedMutationType,
      detail: {
        index: 0,
        target: {
          name: 'delimiter',
        },
      },
    }));

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockAddedMutationType,
      detail: {
        index: 1,
        target: {
          name: 'paragraph',
        },
      },
    }));
  });

  it('should fire onChange callback on block replacement for both of blocks', () => {
    createEditor();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-popover-item[data-item-name=header]')
      .click();

    cy.get('@onChange').should('be.calledTwice');
    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockRemovedMutationType,
      detail: {
        index: 0,
        target: {
          name: 'paragraph',
        },
      },
    }));
    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockAddedMutationType,
      detail: {
        index: 0,
        target: {
          name: 'header',
        },
      },
    }));
  });

  it('should fire onChange callback on tune modifying', () => {
    createEditor([
      {
        type: 'header',
        data: {
          text: 'Header block',
        },
      },
    ]);

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('span.ce-toolbar__settings-btn')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('.ce-settings .ce-popover-item:nth-child(4)')
      .click();

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockChangedMutationType,
      detail: {
        index: 0,
        target: {
          name: 'header',
        },
      },
    }));
  });

  it('should fire onChange callback when block is removed', () => {
    createEditor();

    /**
     * The only block does not have Tune menu, so need to create at least 2 blocks to test deleting
     */
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('some text');

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('span.ce-toolbar__settings-btn')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div[data-item-name=delete]')
      .click();

    /** Second click for confirmation */
    cy.get('[data-cy=editorjs]')
      .get('div[data-item-name=delete]')
      .click();

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockRemovedMutationType,
      detail: {
        index: 0,
      },
    }));
  });

  it('should fire onChange callback when block is moved', () => {
    createEditor();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('{enter}');

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .last()
      .click();

    cy.get('[data-cy=editorjs]')
      .get('span.ce-toolbar__settings-btn')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div[data-item-name=move-up]')
      .click();

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockMovedMutationType,
      detail: {
        fromIndex: 1,
        toIndex: 0,
      },
    }));
  });

  it('should fire onChange if something changed inside native input', () => {
    createEditor([ {
      type: 'code',
      data: {
        code: '',
      },
    } ]);

    cy.get('[data-cy=editorjs')
      .get('textarea')
      .type('Some input to the textarea');

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockChangedMutationType,
      detail: {
        index: 0,
      },
    }));
  });

  it.only('should be fired with batched events when several changes happened at one', () => {
    const firstBlockId = '1234';

    createEditor([
      {
        id: firstBlockId,
        type: 'paragraph',
        data: {
          text: 'The first paragraph',
        },
      },
    ]);

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('change')
      .type('{enter}');

    cy.get('@onChange').should('be.calledOnce');
    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match([
      {
        type: BlockChangedMutationType,
        detail: {
          index: 0,
          target: {
            id: firstBlockId,
          },
        },
      },
      {
        type: BlockAddedMutationType,
        detail: {
          index: 1,
        },
      },
    ]));
  });
});
