/* eslint-disable jsdoc/require-jsdoc, @typescript-eslint/no-non-null-assertion */
/* Selectors below are scoped by data-cy through shared constants. */
/* eslint-disable cypress/require-data-selectors */
import type EditorJS from '../../../../types';
import type { InlineTool, InlineToolConstructable, MenuConfig } from '../../../../types/tools';

const toolbar = '[data-cy=inline-toolbar] .ce-popover--inline';
const container = `${toolbar} > .ce-popover__container`;
const paragraph = '[data-cy=editorjs] .ce-paragraph';
const tool = (name: string): string => `${toolbar} [data-item-name=${name}]`;
const blocks = [
  { type: 'paragraph',
    data: { text: 'First block text' } },
  { type: 'paragraph',
    data: { text: 'Second block text' } },
];

class TextBlock {
  constructor(private readonly options: { data: { text: string } }) {}

  public render(): HTMLElement {
    const element = document.createElement('div');

    element.contentEditable = 'true';
    element.dataset.cy = 'text-block';
    element.textContent = this.options.data.text;

    return element;
  }

  public save(): { text: string } {
    return this.options.data;
  }
}

function pressKey(keyCode: number): void {
  cy.document().then(doc => {
    doc.body.dispatchEvent(new doc.defaultView!.KeyboardEvent('keydown', { keyCode,
      bubbles: true,
      cancelable: true }));
  });
}

describe('Inline Toolbar refresh', () => {
  it('keeps the opened container mounted while updating formatting states', () => {
    cy.createEditor({ inlineToolbar: ['bold', 'italic', 'link'],
      data: { blocks } });
    cy.get(paragraph).first()
      .selectText('First block text');
    cy.get(container).should('be.visible')
      .then(($container) => {
        const element = $container[0];
        const popover = element.parentElement!;
        const doc = element.ownerDocument;
        const removed: Node[] = [];
        const openedStates: string[] = [];
        const observer = new doc.defaultView!.MutationObserver((records) => {
          records.forEach((record) => {
            removed.push(...Array.from(record.removedNodes));
            if (record.target === popover && record.type === 'attributes' && record.oldValue !== null) {
              openedStates.push(record.oldValue);
            }
          });
        });

        observer.observe(popover.parentElement!, { childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: [ 'class' ],
          attributeOldValue: true });

        cy.get(tool('bold')).click();
        // Firefox 115 can format a whole text node without emitting selectionchange.
        cy.document().trigger('selectionchange');
        cy.get(tool('bold')).should('have.class', 'ce-popover-item--active');
        pressKey(9);
        cy.get(tool('bold')).should('have.class', 'ce-popover-item--focused');
        pressKey(9);
        cy.get(tool('italic')).find('button')
          .should('have.class', 'ce-popover-item--focused');
        pressKey(13);
        cy.get(tool('italic')).find('button')
          .should('have.class', 'ce-inline-tool--active');
        cy.get(paragraph).first()
          .find('b i')
          .should('have.text', 'First block text');

        cy.get(tool('italic')).click();
        cy.get(tool('italic')).find('button')
          .should('not.have.class', 'ce-inline-tool--active');
        cy.get(tool('bold')).click();
        cy.document().trigger('selectionchange');
        cy.get(tool('bold')).should('not.have.class', 'ce-popover-item--active');
        // Observe beyond the selectionchange debounce, including the last refresh.
        cy.wait(250);
        cy.get(container).should(($current) => {
          expect($current[0]).to.equal(element);
          expect(element.isConnected).to.be.true;
          expect(removed.some(node => node === popover || node.contains(element))).to.be.false;
          expect(openedStates.every(value => value.includes('ce-popover--opened'))).to.be.true;
          expect(doc.getSelection()!.toString()).to.equal('First block text');
        })
          .then(() => observer.disconnect());
        cy.get(paragraph).first()
          .find('b, i')
          .should('not.exist');
      });
  });

  ['opened', 'hidden'].forEach(state => {
    it(`recalculates width and position after refreshing a popover in the ${state} state`, () => {
      class HideTool implements InlineTool {
        public static isInline = true;
        public render(): MenuConfig {
          return { icon: 'X',
            closeOnActivate: true,
            onActivate: cy.stub().as('hide') };
        }
      }

      cy.createEditor({
        inlineToolbar: ['hide', 'bold', 'italic', 'link'],
        tools: { hide: HideTool as unknown as InlineToolConstructable,
          narrow: { class: TextBlock,
            inlineToolbar: [ 'italic' ] } },
        data: { blocks: [blocks[0], { type: 'narrow',
          data: { text: 'End' } } ] },
      });
      cy.get(paragraph).selectText('First block text');
      cy.get(container).should('be.visible')
        .then(($container) => {
          const element = $container[0];
          const width = element.offsetWidth;

          if (state === 'hidden') {
            cy.get(tool('hide')).click();
            cy.get('@hide').should('have.been.calledOnce');
            cy.get(toolbar).should('not.have.class', 'ce-popover--opened');
          }

          cy.get('[data-cy=text-block]').invoke('css', 'text-align', 'right');
          cy.get('[data-cy=text-block]').click()
            .selectText('End');
          cy.get(tool('bold')).should('not.exist');
          cy.get(tool('link')).should('not.exist');
          cy.get(container).should(($current) => {
            const current = $current[0];
            const rect = current.getBoundingClientRect();
            const selectionRect = element.ownerDocument.getSelection()!.getRangeAt(0)
              .getBoundingClientRect();

            expect(current.offsetWidth).to.be.lessThan(width);
            expect(rect.top).to.be.closeTo(selectionRect.bottom + 6, 1);
            const blockRight = element.ownerDocument.querySelector('[data-cy=text-block]')!.getBoundingClientRect().right;

            expect(rect.right).to.be.closeTo(blockRight, 1);
            expect(current.parentElement!.style.getPropertyValue('--inline-popover-width')).to.equal(current.offsetWidth + 'px');
            expect(current === element).to.equal(state === 'opened');
          });
          cy.get(tool('italic')).click();
          cy.get('[data-cy=text-block] i').should('have.text', 'End');
        });
    });
  });

  it('clears link actions and fake selection when refreshing for another block', () => {
    cy.createEditor({ inlineToolbar: ['bold', 'italic', 'link'],
      data: { blocks } });
    cy.get(paragraph).first()
      .selectText('First block text');
    cy.get(container).should('be.visible')
      .then(($container) => {
        cy.get(tool('link')).click();
        cy.get('[data-cy=editorjs] .ce-inline-tool-input').type('https://example.com');
        cy.get(paragraph).first()
          .find('span[style]')
          .should('exist');
        cy.get(paragraph).last()
          .selectText('Second block text');
        cy.get(paragraph).first()
          .find('span[style]')
          .should('not.exist');
        cy.get('[data-cy=editorjs] .ce-inline-tool-input').should('not.exist');
        cy.get(container).should(($current) => expect($current[0]).to.equal($container[0]));
        cy.get(tool('link')).click();
        cy.get('[data-cy=editorjs] .ce-inline-tool-input').should('have.value', '');
      });
  });

  it('restores link actions for the newly selected link', () => {
    cy.createEditor({
      inlineToolbar: ['bold', 'italic', 'link'],
      data: { blocks: [
        { type: 'paragraph',
          data: { text: '<a href="https://first.example">First link</a>' } },
        { type: 'paragraph',
          data: { text: '<a href="https://second.example">Second link</a>' } },
      ] },
    });
    cy.get(paragraph).first()
      .find('a')
      .selectText('First link');
    cy.get('[data-cy=editorjs] .ce-inline-tool-input').should('have.value', 'https://first.example');
    cy.get(container).then(($container) => {
      cy.get(paragraph).last()
        .find('a')
        .selectText('Second link');
      cy.get('[data-cy=editorjs] .ce-inline-tool-input').should('have.value', 'https://second.example');
      cy.get(container).should(($current) => expect($current[0]).to.equal($container[0]));
    });
  });

  it('closes for a collapsed selection and opens again for a valid selection', () => {
    cy.createEditor({ data: { blocks } });
    cy.get(paragraph).first()
      .selectText('First block text');
    cy.get(container).should('be.visible')
      .then(($container) => {
        cy.document().then(doc => doc.getSelection()!.collapseToEnd());
        cy.get(container).should('not.exist');
        cy.get(paragraph).last()
          .selectText('Second block text');
        cy.get(container).should('be.visible')
          .should(($current) => expect($current[0]).not.to.equal($container[0]));
      });
  });

  it('closes when the selected block has no inline tools', () => {
    cy.createEditor({
      tools: { plain: { class: TextBlock,
        inlineToolbar: false } },
      data: { blocks: [blocks[0], { type: 'plain',
        data: { text: 'No tools' } } ] },
    });
    cy.get(paragraph).selectText('First block text');
    cy.get(container).should('be.visible');
    cy.get('[data-cy=text-block]').click()
      .selectText('No tools');
    cy.get(container).should('not.exist');
  });

  describe('Pending tool renders', () => {
    let editor: EditorJS;
    let delayed: boolean;
    let pending: { resolve: () => void; reject: (error: Error) => void }[];
    let activate: ReturnType<typeof cy.stub>;
    let clear: ReturnType<typeof cy.stub>;
    let close: ReturnType<typeof cy.stub>;
    let doc: Document;
    const submenu = `${toolbar} .ce-popover--nested`;

    beforeEach(() => {
      delayed = false;
      pending = [];
      activate = cy.stub().as('activate');
      clear = cy.stub().as('clear');
      close = cy.stub().as('close');
      cy.document().then(document => {
        doc = document;
      });

      class DeferredTool implements InlineTool {
        public static isInline = true;
        public static shortcut = 'CMD+SHIFT+M';

        public render(): MenuConfig | Promise<MenuConfig> {
          const selection = doc.getSelection()!.toString();
          const item = { title: selection,
            icon: 'M',
            children: {
              onClose: close,
              items: [ { title: 'Apply',
                onActivate: (): void => activate(selection) } ],
            } };

          return delayed ? new Promise((resolve, reject) => {
            pending.push({ resolve: () => resolve(item),
              reject });
          }) : item;
        }

        public clear(): void {
          clear();
        }
      }

      // The constructor type still restricts render() to HTMLElement.
      cy.createEditor({ tools: { deferred: DeferredTool as unknown as InlineToolConstructable },
        inlineToolbar: [ 'deferred' ],
        data: { blocks } })
        .then(instance => {
          editor = instance;
        });
    });

    function startRefresh(): void {
      cy.get(paragraph).first()
        .selectText('First block text');
      cy.get(container).should('be.visible')
        .as('originalContainer', { type: 'static' });
      cy.get(tool('deferred')).click();
      cy.get(`${submenu} > .ce-popover__container`).should('be.visible');
      cy.then(() => {
        delayed = true;
      });
      cy.get(paragraph).first()
        .selectText('First');
      cy.wrap(null).should(() => expect(pending).to.have.length(1));
    }

    ['close', 'destroy'].forEach(action => {
      it(`does not reopen after ${action} during a refresh`, () => {
        startRefresh();
        cy.then(() => {
          if (action === 'destroy') {
            editor.destroy();
          } else {
            editor.inlineToolbar.close();
          }
          pending[0].resolve();
        });
        cy.wait(250);
        cy.get(container).should('not.exist');
        cy.get('@clear').should('have.callCount', action === 'destroy' ? 1 : 2);
      });
    });

    it('keeps the newest selection when an older render completes last', () => {
      startRefresh();
      cy.get(paragraph).last()
        .selectText('Second');
      cy.wrap(null).should(() => expect(pending).to.have.length(2));
      cy.then(() => pending[1].resolve());
      cy.get(tool('deferred')).should('have.text', 'MSecond');
      cy.then(() => pending[0].resolve());
      cy.wait(250);
      cy.get(tool('deferred')).should('have.text', 'MSecond');
      cy.get('@clear').should('have.been.calledTwice');
    });

    it('closes the old submenu before clearing tools and pauses interaction until replacement', () => {
      startRefresh();
      cy.get(toolbar).should('have.prop', 'inert', true);
      cy.get(submenu).should('not.exist');
      cy.get('@close').should('have.been.calledOnce');
      cy.then(() => expect(close).to.have.been.calledBefore(clear));
      cy.get(tool('deferred')).click({ force: true });
      pressKey(9);
      pressKey(13);
      cy.then(() => {
        doc.body.dispatchEvent(new doc.defaultView!.KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'M',
          keyCode: 77,
          which: 77,
          metaKey: true,
          shiftKey: true,
        }));
      });
      cy.get('@activate').should('not.have.been.called');
      cy.get(submenu).should('not.exist');
      cy.then(() => pending[0].resolve());
      cy.get(toolbar).should('have.prop', 'inert', false);
      cy.get('@originalContainer').then($original => {
        cy.get(container).should($current => expect($current[0]).to.equal($original[0]));
      });
      cy.get(tool('deferred')).should('have.text', 'MFirst')
        .click();
      cy.get(`${submenu} > .ce-popover__container`).should('be.visible');
      pressKey(9);
      pressKey(13);
      cy.get('@activate').should('have.been.calledOnceWith', 'First');
    });

    ['current', 'superseded'].forEach(state => {
      it(`reports a ${state} render rejection without leaving stale controls or removing newer ones`, () => {
        const reported = cy.stub().as('reported');

        cy.on('uncaught:exception', error => {
          if (error.message.includes('Rejected toolbar render')) {
            reported();

            return false;
          }
        });
        startRefresh();
        if (state === 'superseded') {
          cy.get(paragraph).last()
            .selectText('Second');
          cy.wrap(null).should(() => expect(pending).to.have.length(2));
          cy.then(() => pending[1].resolve());
          cy.get(tool('deferred')).should('have.text', 'MSecond');
        }
        cy.then(() => pending[0].reject(new Error('Rejected toolbar render')));
        cy.get('@reported').should('have.been.calledOnce');
        if (state === 'current') {
          cy.get(container).should('not.exist');
        } else {
          cy.get(tool('deferred')).should('have.text', 'MSecond');
          cy.get(toolbar).should('have.prop', 'inert', false);
        }
      });
    });
  });
});
