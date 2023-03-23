/* tslint:disable:max-classes-per-file */
import Header from '@editorjs/header';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import { BlockMutationType } from '../../../types/events/block/mutation-type';
import BlockTool from '../../../src/components/tools/block';
import * as _ from '../../../src/components/utils';

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
   * @param additionalTools - object with additional tools used by the editor
   */
  function createEditor(blocks = null, additionalTools = {}): void {
    const config = {
      tools: {
        header: Header,
        code: Code,
        ...additionalTools,
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
      type: BlockMutationType.Added,
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
      type: BlockMutationType.Added,
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
      type: BlockMutationType.Changed,
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
      type: BlockMutationType.Removed,
      detail: {
        index: 0,
        target: {
          name: 'paragraph',
        },
      },
    }));

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockMutationType.Added,
      detail: {
        index: 0,
        target: {
          name: 'delimiter',
        },
      },
    }));

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockMutationType.Added,
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
      type: BlockMutationType.Removed,
      detail: {
        index: 0,
        target: {
          name: 'paragraph',
        },
      },
    }));
    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockMutationType.Added,
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
      type: BlockMutationType.Changed,
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
      type: BlockMutationType.Removed,
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
      type: BlockMutationType.Moved,
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
      type: BlockMutationType.Changed,
      detail: {
        index: 0,
      },
    }));
  });

  it('should not fire onChange when observing an input change on a tool with shouldUpdateOnMutation disabled', () => {
    /**
     * Equal to Code, but shouldn't trigger updates on input changes.
     */
    class StaticCode extends Code {
      public static get shouldUpdateOnMutation(): boolean {
        return false;
      }
    }

    createEditor([ {
      type: 'staticCode',
      data: {
        code: '',
      },
    } ], {
      staticCode: StaticCode,
    });

    cy.get('[data-cy=editorjs')
      .get('textarea')
      .type('Some input to the textarea');

    cy.wait(_.modificationDebounceTimer)
      .get('@onChange')
      .should('not.be.called');
  });

  it('should not fire onChange when observing a mutation on a tool with shouldUpdateOnMutation disabled', () => {
    /**
     * Renders a button that adds new elements to the DOM every time it is
     * clicked. It shouldn't trigger updates when adding these elements.
     */
    class SpawnerBlock extends BlockTool {
      public render(): HTMLElement {
        const wrapper = document.createElement('div');
        const button = document.createElement('button');

        button.setAttribute('data-name', 'testButton');
        button.addEventListener('click', () => {
          wrapper.appendChild(document.createElement('span'));
        });

        wrapper.appendChild(button);

        return wrapper;
      }

      public static get shouldUpdateOnMutation(): boolean {
        return false;
      }
    }

    createEditor([ {
      type: 'spawner',
      data: {},
    } ], {
      spawner: SpawnerBlock,
    });

    cy.get('[data-name=testButton]')
      .click();

    cy.wait(_.modificationDebounceTimer)
      .get('@onChange')
      .should('not.be.called');
  });
});
