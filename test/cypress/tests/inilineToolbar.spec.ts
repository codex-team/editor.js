import Header from './../../../example/tools/header/dist/bundle.js';
import SimpleImage from './../../../example/tools/simple-image/dist/bundle.js';
import List from './../../../example/tools/list/dist/bundle.js';
import Checklist from './../../../example/tools/checklist/dist/bundle.js';
import Quote from './../../../example/tools/quote/dist/bundle.js';
import Warning from './../../../example/tools/warning/dist/bundle.js';
import Marker from './../../../example/tools/marker/dist/bundle.js';
import CodeTool from './../../../example/tools/code/dist/bundle.js';
import Delimiter from './../../../example/tools/delimiter/dist/bundle.js';
import InlineCode from './../../../example/tools/inline-code/dist/bundle.js';
import LinkTool from './../../../example/tools/link/dist/bundle.js';
import RawTool from './../../../example/tools/raw/dist/bundle.js';
import Embed from './../../../example/tools/embed/dist/bundle.js';
import Table from './../../../example/tools/table/dist/bundle.js';


describe('inlineToolbar property', () => {
  const editorConfig = {
    tools: {
      header: Header,
      image: SimpleImage,
      list: List,
      checklist: Checklist,
      quote: Quote,
      warning: Warning,
      marker: Marker,
      code: CodeTool,
      delimiter: Delimiter,
      inlineCode: InlineCode,
      linkTool: LinkTool,
      raw: RawTool,
      embed: Embed,
      table: Table,
    },
  };


  describe('default configuration', () => {
    beforeEach(() => {
      if (this.editorInstance) {
        this.editorInstance.destroy();
      } else {
        cy.createEditor(editorConfig).as('editorInstance');
      }
    });

    it('should show only enabled tools with proper order', () => {
      cy.get('[data-cy=editorjs]')
        .get('div.codex-editor')
        .should('be.visible');
    });
  });

  describe('boolean configuration (True/False)', () => {
    it('should show only enabled tools with proper order', () => {

    });
  });

  describe('tools array configuration', () => {
    it('should show only enabled tools with proper order', () => {

    });
  });
});