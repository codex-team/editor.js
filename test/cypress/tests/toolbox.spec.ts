import Header from '@editorjs/header';

const ICON = '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>';

describe('Toolbox', () => {
  it('should render several toolbox entries for one tool if configured', () => {
    const toolboxConfig = [
      {
        title: 'Entry 1',
        icon: ICON,
      },
      {
        title: 'Entry 2',
        icon: ICON,
      },
    ];

    cy.createEditor({
      tools: {
        header: {
          class: Header,
          toolbox: toolboxConfig,
        },
      },
    }).as('editorInstance');

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-popover__item[data-item-name=header]')
      .should('have.length', 2);

    cy.get('[data-cy=editorjs]')
      .get('div.ce-popover__item[data-item-name=header]')
      .first()
      .should('contain.text', toolboxConfig[0].title);

    cy.get('[data-cy=editorjs]')
      .get('div.ce-popover__item[data-item-name=header]')
      .last()
      .should('contain.text', toolboxConfig[1].title);
  });

  it('should insert block with overriden data on entry click in case toolbox entry provides data overrides', () => {
    const text = 'Text';
    const data = {
      level: 1,
    };
    const config = {
      tools: {
        header: {
          class: Header,
          toolbox: [ {
            title: 'Header 1',
            icon: ICON,
            data,
          } ],
        },
      },
    };

    cy.createEditor(config).as('editorInstance');

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-popover__item[data-item-name=header]')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .last()
      .click()
      .type(text);

    cy.get('@editorInstance')
      .then(async (editor: any) => {
        const editorData = await editor.save();

        expect(editorData.blocks[0].data).to.be.deep.eq({
          ...data,
          text,
        });
      });
  });

  it('should skip toolbox entries that have no icon', () => {
    const skippedEntryTitle = 'Entry 2';

    cy.createEditor({
      tools: {
        header: {
          class: Header,
          toolbox: [
            {
              title: 'Entry 1',
              icon: ICON,
            },
            {
              title: skippedEntryTitle,
            },
          ],
        },
      },
    }).as('editorInstance');

    cy.get('[data-cy=editorjs]')
      .get('div.ce-block')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-toolbar__plus')
      .click();

    cy.get('[data-cy=editorjs]')
      .get('div.ce-popover__item[data-item-name=header]')
      .should('have.length', 1)
      .should('not.contain', skippedEntryTitle);
  });
});