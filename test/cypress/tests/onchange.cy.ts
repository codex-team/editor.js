import Header from '@editorjs/header';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import { BlockAddedMutationType } from '../../../types/events/block/BlockAdded';
import { BlockChangedMutationType } from '../../../types/events/block/BlockChanged';
import { BlockRemovedMutationType } from '../../../types/events/block/BlockRemoved';
import { BlockMovedMutationType } from '../../../types/events/block/BlockMoved';


/**
 * EditorJS API is passed as the first parameter of the onChange callback
 */
const EditorJSApiMock = Cypress.sinon.match.any;

/**
 * Check if passed onChange method is called with an array of passed events
 *
 * @param $onChange - editor onChange spy
 * @param expectedEvents - batched events to check
 */
function beCalledWithBatchedEvents($onChange, expectedEvents): void {
  expect($onChange).to.be.calledOnce;
  expect($onChange).to.be.calledWithMatch(
    EditorJSApiMock,
    Cypress.sinon.match((events) => {
      return events.every((event, index) => {
        const eventToCheck = expectedEvents[index];

        return expect(event).to.containSubset(eventToCheck);
      });
    })
  );
}

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
        console.log('something changed', event);
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
        console.log('something changed', event);
        api.saver.save();
      },
      data: blocks ? {
        blocks,
      } : null,
    };

    cy.spy(config, 'onChange').as('onChange');

    cy.createEditor(config).as('editorInstance');
  }

  it('should batch events when several changes happened at once', () => {
    createEditor([
      {
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

    cy.get('@onChange').should(($callback) => {
      return beCalledWithBatchedEvents($callback, [
        {
          type: BlockChangedMutationType,
          detail: {
            index: 0,
          },
        },
        {
          type: BlockAddedMutationType,
          detail: {
            index: 1,
          },
        },
      ]);
    });
  });

  it('should filter out similar events on batching', () => {
    createEditor([
      {
        type: 'paragraph',
        data: {
          text: 'The first paragraph',
        },
      },
    ]);

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('first change')
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      .wait(100)
      .type('second change');

    cy.get('@onChange').should('be.calledOnce');
    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockChangedMutationType,
      detail: {
        target: {
          name: 'paragraph',
        },
        index: 0,
      },
    }));
  });

  it('should be fired with correct index on block insertion above the current (by pressing Enter at the start)', () => {
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

  it('should be fired with only single "block-added" event by pressing Enter at the end of a block', () => {
    createEditor([ {
      type: 'paragraph',
      data: {
        text: 'some text',
      },
    } ]);

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('{enter}');

    cy.get('@onChange').should('be.calledOnce');
    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockAddedMutationType,
    }));
  });

  it('should be fired onChange with BlockChange and BlockAdded at split event by pressing Enter in the middle of a sentence', () => {
    createEditor([ {
      type: 'paragraph',
      data: {
        text: 'The block with some text',
      },
    } ]);

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .click()
      .selectText('some')
      // .wait(0)
      .type('{enter}');

    cy.get('@onChange').should(($callback) => {
      return beCalledWithBatchedEvents($callback, [
        {
          type: BlockChangedMutationType,
          detail: {
            index: 0,
          },
        },
        {
          type: BlockAddedMutationType,
          detail: {
            index: 1,
          },
        },
      ]);
    });
  });

  it('should be fired with correct index on block insertion after the current (by pressing enter at the end)', () => {
    createEditor([ {
      type: 'paragraph',
      data: {
        text: 'some text',
      },
    } ]);

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click()
      .type('{enter}');

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockAddedMutationType,
      detail: {
        index: 1,
      },
    }));
  });

  it('should be fired on typing into block', () => {
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

  it('should be fired on block insertion with save inside onChange', () => {
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

    cy.get('@onChange').should(($callback) => {
      return beCalledWithBatchedEvents($callback, [
        {
          type: BlockRemovedMutationType,
          detail: {
            index: 0,
            target: {
              name: 'paragraph',
            },
          },
        },
        {
          type: BlockAddedMutationType,
          detail: {
            index: 0,
            target: {
              name: 'delimiter',
            },
          },
        },
        {
          type: BlockAddedMutationType,
          detail: {
            index: 1,
            target: {
              name: 'paragraph',
            },
          },
        },
      ]);
    });
  });

  it('should be fired on block replacement for both of blocks', () => {
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

    cy.get('@onChange').should(($callback) => {
      return beCalledWithBatchedEvents($callback, [
        {
          type: BlockRemovedMutationType,
          detail: {
            index: 0,
            target: {
              name: 'paragraph',
            },
          },
        },
        {
          type: BlockAddedMutationType,
          detail: {
            index: 0,
            target: {
              name: 'header',
            },
          },
        },
      ]);
    });
  });

  it('should be fired on tune modifying', () => {
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

  it('should be fired when block is removed', () => {
    createEditor([
      {
        type: 'paragraph',
        data: {
          text: 'some text',
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
      .get('div[data-item-name=delete]')
      .click();

    /** Second click for confirmation */
    cy.get('[data-cy=editorjs]')
      .get('div[data-item-name=delete]')
      .click();

    cy.get('@onChange').should(($callback) => {
      return beCalledWithBatchedEvents($callback, [
        /**
         * "block-removed" fired since we have deleted a block
         */
        {
          type: BlockRemovedMutationType,
          detail: {
            index: 0,
          },
        },
        /**
         * "block-added" fired since we have deleted the last block, so the new one is created
         */
        {
          type: BlockAddedMutationType,
          detail: {
            index: 0,
          },
        },
      ]);
    });
  });

  it('should be fired when block is moved', () => {
    createEditor([
      {
        type: 'paragraph',
        data: {
          text: 'first block',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'second block',
        },
      },
    ]);

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

  it('should be fired if something changed inside native input', () => {
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

  it('should not be fired on fake cursor adding and removing', () => {
    createEditor([ {
      type: 'paragraph',
      data: {
        text: 'some text',
      },
    } ]);

    cy.get('[data-cy=editorjs')
      .get('div.ce-block')
      .click();

    /**
     * Open Block Tunes, add fake cursor
     */
    cy.get('[data-cy=editorjs]')
      .get('span.ce-toolbar__settings-btn')
      .click();

    /**
     * Close Block Tunes, remove fake cursor
     */
    cy.get('[data-cy=editorjs')
      .get('div.ce-block')
      .click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting, @typescript-eslint/no-magic-numbers
    cy.wait(500).then(() => {
      cy.get('@onChange').should('have.callCount', 0);
    });
  });
});
