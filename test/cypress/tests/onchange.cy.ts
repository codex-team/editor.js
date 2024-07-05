import Header from '@editorjs/header';
import Code from '@editorjs/code';
import ToolMock from '../fixtures/tools/ToolMock';
import Delimiter from '@editorjs/delimiter';
import { BlockAddedMutationType } from '../../../types/events/block/BlockAdded';
import { BlockChangedMutationType } from '../../../types/events/block/BlockChanged';
import { BlockRemovedMutationType } from '../../../types/events/block/BlockRemoved';
import { BlockMovedMutationType } from '../../../types/events/block/BlockMoved';
import type EditorJS from '../../../types/index';

/**
 * EditorJS API is passed as the first parameter of the onChange callback
 */
const EditorJSApiMock = Cypress.sinon.match.any;

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

    cy.get('@onChange').should('be.calledWithBatchedEvents', [
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

  it('should filter out similar events on batching', () => {
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
      .get('.ce-popover-item[data-item-name=delimiter]')
      .click();

    cy.get('@onChange').should('be.calledWithBatchedEvents', [
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

  it('should be fired on block replacement for both of blocks', () => {
    createEditor();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('.ce-popover-item[data-item-name=header]')
      .click();

    cy.get('@onChange').should('be.calledWithBatchedEvents', [
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
      .get('[data-item-name=delete]')
      .click();

    /** Second click for confirmation */
    cy.get('[data-cy=editorjs]')
      .get('[data-item-name=delete]')
      .click();

    cy.get('@onChange').should('be.calledWithBatchedEvents', [
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
      .get('[data-item-name=move-up]')
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

    cy.wait(500).then(() => {
      cy.get('@onChange').should('have.callCount', 0);
    });
  });

  it('should be fired when the whole text inside block is removed', () => {
    createEditor([ {
      type: 'paragraph',
      data: {
        text: 'a',
      },
    } ]);

    cy.get('[data-cy=editorjs')
      .get('div.ce-block')
      .click()
      .type('{backspace}');

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockChangedMutationType,
      detail: {
        index: 0,
      },
    }));
  });

  it('should not be fired when element with the "data-mutation-free" mark changes some attribute', () => {
    /**
     * Mock for tool wrapper which we will mutate in a test
     */
    const toolWrapper = document.createElement('div');

    /**
     * Mark it as mutation-free
     */
    toolWrapper.dataset.mutationFree = 'true';

    /**
     * Mock of tool with data-mutation-free attribute
     */
    class ToolWithMutationFreeAttribute {
      /**
       * Simply return mocked element
       */
      public render(): HTMLElement {
        return toolWrapper;
      }

      /**
       * Saving logic is not necessary for this test
       */
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      public save(): void {}
    }

    const editorConfig = {
      tools: {
        testTool: ToolWithMutationFreeAttribute,
      },
      onChange: (api, event): void => {
        console.log('something changed', event);
      },
      data: {
        blocks: [
          {
            type: 'testTool',
            data: {},
          },
        ],
      },
    };

    cy.spy(editorConfig, 'onChange').as('onChange');
    cy.createEditor(editorConfig).as('editorInstance');

    /**
     * Emulate tool's internal attribute mutation
     */
    cy.wait(100).then(() => {
      toolWrapper.setAttribute('some-changed-attr', 'some-new-value');
    });

    /**
     * Check that onChange callback was not called
     */
    cy.wait(500).then(() => {
      cy.get('@onChange').should('have.callCount', 0);
    });
  });

  it('should not be fired when mutation happened in a child of element with the "data-mutation-free" mark', () => {
    /**
     * Mock for tool wrapper which we will mutate in a test
     */
    const toolWrapper = document.createElement('div');
    const toolChild = document.createElement('div');

    toolWrapper.appendChild(toolChild);

    /**
     * Mark it as mutation-free
     */
    toolWrapper.dataset.mutationFree = 'true';

    /**
     * Mock of tool with data-mutation-free attribute
     */
    class ToolWithMutationFreeAttribute {
      /**
       * Simply return mocked element
       */
      public render(): HTMLElement {
        return toolWrapper;
      }

      /**
       * Saving logic is not necessary for this test
       */
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      public save(): void {}
    }

    const editorConfig = {
      tools: {
        testTool: ToolWithMutationFreeAttribute,
      },
      onChange: (api, event): void => {
        console.log('something changed', event);
      },
      data: {
        blocks: [
          {
            type: 'testTool',
            data: {},
          },
        ],
      },
    };

    cy.spy(editorConfig, 'onChange').as('onChange');
    cy.createEditor(editorConfig).as('editorInstance');

    /**
     * Emulate tool's internal attribute mutation
     */
    cy.wait(100).then(() => {
      toolChild.setAttribute('some-changed-attr', 'some-new-value');
    });

    /**
     * Check that onChange callback was not called
     */
    cy.wait(500).then(() => {
      cy.get('@onChange').should('have.callCount', 0);
    });
  });

  it('should not be fired when "characterData" mutation happened in a child of element with the "data-mutation-free" mark', () => {
    /**
     * Mock for tool wrapper which we will mutate in a test
     */
    const toolWrapper = document.createElement('div');
    const toolChild = document.createElement('div');

    toolChild.setAttribute('data-cy', 'tool-child');
    toolChild.setAttribute('contenteditable', 'true');

    toolWrapper.appendChild(toolChild);

    /**
     * Mark it as mutation-free
     */
    toolWrapper.dataset.mutationFree = 'true';

    /**
     * Mock of tool with data-mutation-free attribute
     */
    class ToolWithMutationFreeAttribute {
      /**
       * Simply return mocked element
       */
      public render(): HTMLElement {
        return toolWrapper;
      }

      /**
       * Saving logic is not necessary for this test
       */
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      public save(): void {}
    }

    const editorConfig = {
      tools: {
        testTool: ToolWithMutationFreeAttribute,
      },
      onChange: function (api, event) {
        console.log('something changed!!!!!!!!', event);
      },
      data: {
        blocks: [
          {
            type: 'testTool',
            data: {},
          },
        ],
      },
    };

    cy.spy(editorConfig, 'onChange').as('onChange');
    cy.createEditor(editorConfig).as('editorInstance');

    /**
     * Emulate tool's child-element text typing
     */
    cy.get('[data-cy=editorjs')
      .get('[data-cy=tool-child]')
      .click()
      .type('some text');

    /**
     * Check that onChange callback was not called
     */
    cy.wait(500).then(() => {
      cy.get('@onChange').should('have.callCount', 0);
    });
  });

  it('should be called on blocks.clear() with removed and added blocks', () => {
    createEditor([
      {
        type: 'paragraph',
        data: {
          text: 'The first paragraph',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'The second paragraph',
        },
      },
    ]);

    cy.get<EditorJS>('@editorInstance')
      .then(async editor => {
        cy.wrap(editor.blocks.clear());
      });

    cy.get('@onChange').should('be.calledWithBatchedEvents', [
      {
        type: BlockRemovedMutationType,
      },
      {
        type: BlockRemovedMutationType,
      },
      {
        type: BlockAddedMutationType,
      },
    ]);
  });

  it('should not be called on blocks.render() on non-empty editor', () => {
    createEditor([
      {
        type: 'paragraph',
        data: {
          text: 'The first paragraph',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'The second paragraph',
        },
      },
    ]);

    cy.get<EditorJS>('@editorInstance')
      .then(async editor => {
        cy.wrap(editor.blocks.render({
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'The new paragraph',
              },
            },
          ],
        }));
      });

    cy.get('@onChange').should('have.callCount', 0);
  });

  it('should be called on blocks.update() with "block-changed" event', () => {
    const block = {
      id: 'bwnFX5LoX7',
      type: 'paragraph',
      data: {
        text: 'The first block mock.',
      },
    };
    const config = {
      data: {
        blocks: [
          block,
        ],
      },
      onChange: (api, event): void => {
        console.log('something changed', event);
      },
    };

    cy.spy(config, 'onChange').as('onChange');

    cy.createEditor(config)
      .then((editor) => {
        editor.blocks.update(block.id, {
          text: 'Updated text',
        });

        cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
          type: BlockChangedMutationType,
          detail: {
            index: 0,
            target: {
              id: block.id,
            },
          },
        }));
      });
  });

  it('should be fired when the whole text inside some descendant of the block is removed', () => {
    /**
     * Mock of Tool with nested contenteditable element
     */
    class ToolWithContentEditableDescendant extends ToolMock {
      /**
       * Creates element with nested contenteditable element
       */
      public render(): HTMLElement {
        const contenteditable = document.createElement('div');

        contenteditable.contentEditable = 'true';
        contenteditable.innerText = 'a';
        contenteditable.setAttribute('data-cy', 'nested-contenteditable');

        const wrapper = document.createElement('div');

        wrapper.appendChild(contenteditable);

        return wrapper;
      }
    }

    const config = {
      tools: {
        testTool: {
          class: ToolWithContentEditableDescendant,
        },
      },
      data: {
        blocks: [
          {
            type: 'testTool',
            data: 'a',
          },
        ],
      },
      onChange: (): void => {
        console.log('something changed');
      },
    };

    cy.spy(config, 'onChange').as('onChange');
    cy.createEditor(config).as('editorInstance');

    cy.get('[data-cy=nested-contenteditable]')
      .click()
      .clear();

    cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
      type: BlockChangedMutationType,
      detail: {
        index: 0,
      },
    }));
  });
});
