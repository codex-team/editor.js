import Header from '@editorjs/header';
import Code from '@editorjs/code';
import ToolMock from '../fixtures/tools/ToolMock';
import SelectTool from '../fixtures/tools/SelectTool';
import CompositeSelectTool from '../fixtures/tools/CompositeSelectTool';
import Delimiter from '@editorjs/delimiter';
import { BlockAddedMutationType } from '../../../types/events/block/BlockAdded';
import { BlockChangedMutationType } from '../../../types/events/block/BlockChanged';
import { BlockRemovedMutationType } from '../../../types/events/block/BlockRemoved';
import { BlockMovedMutationType } from '../../../types/events/block/BlockMoved';
import type EditorJS from '../../../types/index';
import { modificationsObserverBatchTimeout } from '../../../src/components/constants';

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

  describe('native select changes', () => {
    /**
     * Block listeners are installed in requestIdleCallback after rendering.
     */
    function waitForBlockListeners(): void {
      cy.window().then(win => {
        return new Cypress.Promise<void>(resolve => win.requestIdleCallback(() => resolve()));
      });
    }

    /**
     * Create a select block after a paragraph to verify the event's block index.
     */
    function createEditorWithSelect(): void {
      cy.createEditor({
        tools: { select: SelectTool },
        onChange: cy.stub().as('onChange'),
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: { text: 'First block' },
            },
            {
              type: 'select',
              data: {},
            },
          ],
        },
      }).as('editorInstance');

      waitForBlockListeners();
      cy.clock(Date.now(), ['setTimeout', 'clearTimeout']);
      cy.tick(modificationsObserverBatchTimeout);
      cy.get('@onChange').should('not.be.called');
    }

    it('should notify once and save the selected value', () => {
      createEditorWithSelect();

      cy.get('[data-cy=editorjs] select').select('second');
      cy.tick(modificationsObserverBatchTimeout);

      cy.get('@onChange').should('be.calledOnce');
      cy.get('@onChange').should('be.calledWithMatch', EditorJSApiMock, Cypress.sinon.match({
        type: BlockChangedMutationType,
        detail: {
          index: 1,
          target: { name: 'select' },
        },
      }));

      cy.get<EditorJS>('@editorInstance').then(async editor => {
        const saved = await editor.save();

        expect(saved.blocks[1].data).to.deep.equal({ value: 'second' });
      });

      cy.tick(modificationsObserverBatchTimeout);
      cy.get('@onChange').should('be.calledOnce');
    });

    it('should observe every select in a composite Tool', () => {
      cy.createEditor({
        tools: { compositeSelect: CompositeSelectTool },
        onChange: cy.stub().as('onChange'),
        data: {
          blocks: [ {
            type: 'compositeSelect',
            data: {},
          } ],
        },
      }).as('editorInstance');

      waitForBlockListeners();
      cy.clock(Date.now(), ['setTimeout', 'clearTimeout']);
      cy.tick(modificationsObserverBatchTimeout);
      cy.get('@onChange').should('not.be.called');

      cy.get('[data-cy=first-select]').select('second');
      cy.tick(modificationsObserverBatchTimeout);
      cy.get('@onChange').should('be.calledOnce');

      cy.get('[data-cy=second-select]').select('second');
      cy.tick(modificationsObserverBatchTimeout);
      cy.get('@onChange').should('be.calledTwice');

      cy.get<EditorJS>('@editorInstance').then(async editor => {
        const saved = await editor.save();

        expect(saved.blocks[0].data).to.deep.equal({
          first: 'second',
          second: 'second',
        });
      });
    });

    it('should call updated after the Tool handles the select change', () => {
      const updated = cy.stub().as('updated');
      let value = 'first';

      /**
       * Keep Tool state in sync through its own native change handler.
       */
      class SelectWithChangeHandler extends SelectTool {
        /**
         * Register the Tool's own change handler on its select.
         */
        public render(): HTMLSelectElement {
          const select = super.render();

          select.addEventListener('change', () => {
            value = select.value;
          });

          return select;
        }

        /**
         * Observe Tool state when the lifecycle hook runs.
         */
        public updated(): void {
          updated(value);
        }
      }

      cy.createEditor({
        tools: { select: SelectWithChangeHandler },
        data: {
          blocks: [ {
            type: 'select',
            data: {},
          } ],
        },
      });

      waitForBlockListeners();
      cy.get('[data-cy=editorjs] select').select('second');
      cy.get('@updated').should('be.calledOnceWithExactly', 'second');
    });

    it('should observe a replacement select nested in a new Tool root', () => {
      createEditorWithSelect();

      cy.get('[data-cy=editorjs] select').then(([ select ]) => {
        return new Cypress.Promise<void>(resolve => {
          const observer = new select.ownerDocument.defaultView.MutationObserver(() => {
            observer.disconnect();
            resolve();
          });

          observer.observe(select.parentElement, { childList: true });

          const wrapper = select.ownerDocument.createElement('div');

          wrapper.appendChild(select.cloneNode(true));
          select.replaceWith(wrapper);
        });
      });

      // Let the DOM replacement notification finish before changing the value.
      cy.tick(modificationsObserverBatchTimeout);
      cy.get('@onChange').should('be.calledOnce');
      cy.get('@onChange').invoke('resetHistory');
      cy.get('[data-cy=editorjs] select').select('second');
      cy.tick(modificationsObserverBatchTimeout);

      cy.get('@onChange').should('be.calledOnce');
      cy.get<EditorJS>('@editorInstance').then(async editor => {
        const saved = await editor.save();

        expect(saved.blocks[1].data).to.deep.equal({ value: 'second' });
      });
    });

    it('should remove the select change listener when the editor is destroyed', () => {
      const updated = cy.stub().as('updated');

      /**
       * Observe the Tool hook even after Block event subscriptions are removed.
       */
      class SelectWithUpdatedHook extends SelectTool {
        public updated = updated;
      }

      cy.createEditor({
        tools: { select: SelectWithUpdatedHook },
        data: {
          blocks: [ {
            type: 'select',
            data: {},
          } ],
        },
      }).as('editorInstance');

      waitForBlockListeners();
      cy.get('[data-cy=editorjs] select').select('second');
      cy.get('@updated').should('be.calledOnce');
      cy.get('[data-cy=editorjs] select').then(([ select ]) => {
        cy.get<EditorJS>('@editorInstance').then(editor => {
          editor.destroy();
          updated.resetHistory();
          select.dispatchEvent(new select.ownerDocument.defaultView.Event('change', { bubbles: true }));
          expect(updated).not.to.be.called;
        });
      });
    });

    it('should not treat other bubbling change events as select changes', () => {
      createEditorWithSelect();

      cy.get('[data-cy=editorjs] .ce-paragraph').trigger('change');
      cy.tick(modificationsObserverBatchTimeout);

      cy.get('@onChange').should('not.be.called');
    });

    it('should not rebind select changes when destroyed before deferred initialization', () => {
      const updated = cy.stub().as('updated');

      /**
       * Observe the Tool hook independently of Block Manager subscriptions.
       */
      class SelectWithUpdatedHook extends SelectTool {
        public updated = updated;
      }

      cy.createEditor({
        tools: { select: SelectWithUpdatedHook },
      }).as('editorInstance');
      waitForBlockListeners();

      cy.window().then(win => {
        cy.get<EditorJS>('@editorInstance').then(editor => {
          const pendingCallbacks: Array<() => void> = [];

          cy.stub(win, 'requestIdleCallback').callsFake((callback: IdleRequestCallback) => {
            pendingCallbacks.push(() => callback({
              didTimeout: false,
              timeRemaining: () => 50,
            }));

            return pendingCallbacks.length;
          });

          const block = editor.blocks.insert('select', {}, undefined, undefined, false);
          const select = block.holder.querySelector('select') as HTMLSelectElement;

          editor.destroy();
          pendingCallbacks.forEach(callback => callback());
          updated.resetHistory();

          select.value = 'second';
          select.dispatchEvent(new win.Event('change', { bubbles: true }));
          expect(updated).not.to.be.called;
        });
      });
    });
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

    cy.wait(modificationsObserverBatchTimeout).then(() => {
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
    cy.wait(modificationsObserverBatchTimeout).then(() => {
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
    cy.wait(modificationsObserverBatchTimeout).then(() => {
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
    cy.wait(modificationsObserverBatchTimeout).then(() => {
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

    cy.wait(modificationsObserverBatchTimeout);

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

  it('should not be called when editor is initialized with readOnly mode', () => {
    const config = {
      readOnly: true,
      onChange: (api, event): void => {
        console.log('something changed', event);
      },
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'The first paragraph',
            },
          },
        ],
      },
    };

    cy.spy(config, 'onChange').as('onChange');

    cy.createEditor(config);

    cy.wait(modificationsObserverBatchTimeout);

    cy.get('@onChange').should('have.callCount', 0);
  });

  it('should not be called when editor is switched to/from readOnly mode', () => {
    createEditor([
      {
        type: 'paragraph',
        data: {
          text: 'The first paragraph',
        },
      },
    ]);

    cy.get<EditorJS>('@editorInstance')
      .then(async editor => {
        editor.readOnly.toggle(true);
      });

    cy.wait(modificationsObserverBatchTimeout);

    cy.get('@onChange').should('have.callCount', 0);

    cy.get<EditorJS>('@editorInstance')
      .then(async editor => {
        editor.readOnly.toggle(false);
      });

    cy.wait(modificationsObserverBatchTimeout);

    cy.get('@onChange').should('have.callCount', 0);
  });
});
