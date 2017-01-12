define([ 'html-janitor' ], function (HTMLJanitor) {

  describe('janitor', function () {
    var janitor;
    var config = {
      tags: {
        a: {
          href: true
        },
        b: {},
        i: {},
        strong: {},
        em: {},
        sub: {},
        sup: {},
        strike: {},

        p: { foo: true, bar: 'baz' },
        ul: {},
        li: {},
        small: true,
        div: {},
        figure: false,
        u: function(el){
          // Remove empty underline tags.
          var shouldKeepEl = el.innerHTML !== '';
          return shouldKeepEl;
        },
        img: {
          height: function(value){
            // Only allow if height is less than 10.
            return parseInt(value) < 10;
          },
          width: function(value, el){
            // Only allow if height also specified.
            return el.hasAttribute('height');
          }
        },
        blockquote: function(el) {
          // If blockquote has class 'indent', also allow style.
          if (el.classList.contains('indent')){
            return { 'class': true, 'style': true };
          } else {
            return {};
          }
        }
      }


    };

    beforeEach(function () {
      janitor = new HTMLJanitor(config);
    });

    it('should clean attributes not in the whitelist', function () {
      var p = document.createElement('p');
      p.setAttribute('style', 'font-size: 16px;');
      p.setAttribute('bar', 'not baz');
      expect(janitor.clean(p.outerHTML)).toBe('<p></p>');
    });

    it('should not clean attributes in the whitelist', function () {
      var p = document.createElement('p');
      p.setAttribute('foo', 'true');
      p.setAttribute('bar', 'baz');
      var cleanP = janitor.clean(p.outerHTML);
      expect(cleanP).toMatch(/foo="true"/);
      expect(cleanP).toMatch(/bar="baz"/);
    });

    it('should remove elements not in the whitelist', function () {
      var aside = document.createElement('aside');
      var p = document.createElement('p');
      aside.appendChild(p);
      expect(janitor.clean(aside.outerHTML)).toBe('<p></p>');
    });

    it('should not keep the inner text of a script element', function () {
      var script = document.createElement('script');
      script.innerText = 'window.alert(\'foo\');';
      expect(janitor.clean(script.outerHTML)).toBe('');
    });

    it('should not keep the inner text of a style element', function () {
      var style = document.createElement('style');
      style.innerText = '.foo {}';
      expect(janitor.clean(style.outerHTML)).toBe('');
    });

    it('should clean invalid markup', function () {
      var b = document.createElement('b');
      var p = document.createElement('p');
      b.appendChild(p);
      expect(janitor.clean(b.outerHTML)).toBe('<p></p>');
    });

    it('should clean paragraphs in lists', function () {
      var ul = document.createElement('ul');
      ul.innerHTML = '<li><p>Some text</p></li>';
      expect(janitor.clean(ul.outerHTML)).toBe('<ul><li>Some text</li></ul>');
    });

    it('should remove comments', function () {
      var p = document.createElement('p');
      p.innerHTML = 'Hello <b>world</b> <!-- a salutation -->!';
      expect(janitor.clean(p.outerHTML)).toBe('<p>Hello <b>world</b> !</p>');
    });

    it('should remove text nodes in-between block elements', function () {
      var html = '<p></p>\n<p></p>';
      expect(janitor.clean(html)).toBe('<p></p><p></p>');
    });

    it('should remove text nodes before block elements', function () {
      var html = '\n<p></p>';
      expect(janitor.clean(html)).toBe('<p></p>');
    });

    it('should remove text nodes after block elements', function () {
      var html = '<p></p>\n';
      expect(janitor.clean(html)).toBe('<p></p>');
    });
    it('should remove nested span elements', function() {
      var html ='<p><span>Hello <span>world</span></span></p>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');
    });

    it('should not allow nested block elements by default', function() {
      var html = '<div>Hello <div>world</div></div>';
      expect(janitor.clean(html)).toBe('<div>Hello world</div>');
    });

    it('should not allow nested block elements inside inline elements', function() {
      var html = '<strong><p>Hello world</p></strong>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<b><p>Hello world</p></b>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<em><p>Hello world</p></em>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<i><p>Hello world</p></i>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<sub><p>Hello world</p></sub>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<sup><p>Hello world</p></sup>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<u><p>Hello world</p></u>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<strike><p>Hello world</p></strike>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');

      html = '<a href="test"><p>Hello world</p></a>';
      expect(janitor.clean(html)).toBe('<p>Hello world</p>');
    });

    it('should allow inline elements inside block elements', function() {
      var html = '<p>Hello <strong>world</strong></p>';
      expect(janitor.clean(html)).toBe('<p>Hello <strong>world</strong></p>');
    });


    it('should allow all attributes for elements with catch-all whitelist', function () {
      var el = document.createElement('small');
      el.setAttribute('data-test', 'true');
      el.setAttribute('title', 'test');

      var outputEl = document.createElement('div');
      outputEl.innerHTML = janitor.clean(el.outerHTML);

      var output = outputEl.children[0];

      expect(output.tagName).toBe('SMALL');

      var attributes = output.attributes;

      expect(attributes.getNamedItem('data-test').name).toBe('data-test');
      expect(attributes.getNamedItem('data-test').value).toBe('true');

      expect(attributes.getNamedItem('title').name).toBe('title');
      expect(attributes.getNamedItem('title').value).toBe('test');

    });

    it('should remove an element if blacklisted', function() {
        var el = document.createElement('figure');
        el.setAttribute('class', 'test');

        var output = janitor.clean(el.outerHTML);

        expect(output).toBe('');
    });

    it('should handle functions as options', function () {
      var html = '<div><u>content</u></div>';
      expect(janitor.clean(html)).toBe('<div><u>content</u></div>');

      html = '<div><u></u></div>';
      expect(janitor.clean(html)).toBe('<div></div>');
    });

    it('should handle functions as options for attributes', function () {
      var html = '<img height="11">';
      expect(janitor.clean(html)).toBe('<img>');

      html = '<img height="9">';
      expect(janitor.clean(html)).toBe('<img height="9">');
    });

    it('should also handle functions for attributes that take an element', function () {
      var html = '<img width="1">';
      expect(janitor.clean(html)).toBe('<img>');

      html = '<img height="9" width="1">';
      expect(janitor.clean(html)).toBe('<img height="9" width="1">');
    });

    it('should allow certain attributes', function() {
      var html = '<blockquote class="indent" style="display:inline" notallowedattr="1"></blockquote>';
      expect(janitor.clean(html)).toBe('<blockquote class="indent" style="display:inline"></blockquote>');

      html = '<blockquote style="display:inline"></blockquote>';
      expect(janitor.clean(html)).toBe('<blockquote></blockquote>');
    });

  });

  describe('janitor that allows nested block elements', function () {
    var janitor;
    var config = {
      tags: {
        div: {}
      },
      keepNestedBlockElements: true
    };

    beforeEach(function () {
      janitor = new HTMLJanitor(config);
    });


    it('should allow nested block elements', function() {
      var html = '<div>Hello <div>world</div></div>';
      expect(janitor.clean(html)).toBe('<div>Hello <div>world</div></div>');
    });

  });

  describe('janitor with invalid configuration', function() {

    var config = {
      tags: {
        strong: 53
      }
    };

    it('should throw an Error on invalid configuration', function() {
      expect(function() {new HTMLJanitor(config)}).toThrow(new Error('The configuration was invalid'));
    });

  });

});
