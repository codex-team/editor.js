require({
  baseUrl: './src'
}, [ 'html-janitor' ], function (HTMLJanitor) {
  var janitor = new HTMLJanitor({
    tags: {
      p: { foo: true, bar: 'baz' }
    }
  });

  var p = document.createElement('p');
  p.setAttribute('style', 'font-size: 16px;');
  p.setAttribute('bar', 'baz');
  p.setAttribute('foo', 'fighter');
  console.log(janitor.clean(p.outerHTML));
});
