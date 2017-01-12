# html-janitor

Cleans up your markup and allows you to take control of your HTML.

HTMLJanitor uses a defined whitelist to limit HTML it is given to a defined subset.

![](https://circleci.com/gh/guardian/html-janitor.png?circle-token=bd24300ee650966837a73bfe03386828f0192c06)

## Usage

```
var janitor = new HTMLJanitor(options);

var sanitisedHtml = janitor.clean(html);

```

### Options

A configuration object.

`tags` defines a whitelist of elements that are allowed in the sanitised output. Each entry in the map should be the name of the element and the attributes that a valid for the element.

E.g. `{tags: { p:{}, a: { href: true} }}` would limit the valid HTML subset to just paragraphs and anchor tags. Paragraph tags would have all attributes stripped, and the anchor tags would only have the `href` attribute preserved.

#### Blacklisting and whitelisting all attributes

You can set an element to be `true` to allow all attributes on an element and `false` to remove all attributes.

#### Using logic

If you need to apply logic when determining whether to whitelist an element or an attribute, you can pass a function.

Here's an example that removes all `<u>` elements that are empty.

```
    u: function(el){
      // Remove empty underline tags.
      var shouldKeep = el.textContent !== '';
      return shouldKeep;
    },
```

A function can also be used for attributes, only the attribute's value and the element are passed as the function arguments:

```
     img: {
      height: function(value){
        // Only allow if height is less than 10.
        return parseInt(value) < 10;
      },
      width: function(value, el){
        // Only allow if height also specified.
        return el.hasAttribute('height');
      }
    }
```

Functions may return any value that's accepted as a regular value, including an object:

```
     blockquote: function(el) {
      if (el.classList.contains('indent')){
        return { 'class': true, 'style': true }; // If blockquote has class 'indent', also allow style.
      } else {
        return {}; // Strip everything
      }
    }

```


## Distribution

Uses UMD for support in AMD and Common JS environments.

### Not suitable for Node

This library is designed for use in a browser and requires access to [document](https://developer.mozilla.org/en/docs/Web/API/Document) and [createTreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker) to work.

## Installation

```
bower install html-janitor
# or
npm install html-janitor
```

## Development

To run unit tests:

```
npm install
npm run test
```
