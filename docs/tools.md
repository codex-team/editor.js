# CodeX Editor Tools

CodeX Editor is a block-oriented editor. It means that entry composed with the list of `Blocks` of different types: `Texts`, `Headers`, `Images`, `Quotes` etc.

`Tool` — is a class that provide custom `Block` type. All Tools represented by `Plugins`.

Each Tool should have an installation guide. 

## Tool class structure

### constructor()

Each Tool's instance called with an params object.
 
| Param  | Type                | Description                                     |
| ------ | ------------------- | ----------------------------------------------- |
| api    | [`IAPI`][iapi-link] | CodeX Editor's API methods                      |
| config | `object`            | Special configuration params passed in «config» |
| data   | `object`            | Data to be rendered in this Tool                |

[iapi-link]: ../src/components/interfaces/api.ts

#### Example

```javascript
constructor({data, config, api}) {
  this.data = data;
  this.api = api;
  this.config = config;
  // ...
}
```

### render()

Method that returns Tool's element {HTMLElement} that will be placed into Editor.

### save()

Process Tool's element created by `render()` function in DOM and return Block's data.

### validate() _optional_

### merge() _optional_

Method that specifies how to merge two `Blocks` of the same type, for example on `Backspace` keypress.
Method does accept data object in same format as the `Render` and it should provide logic how to combine new
data with the currently stored value.

### Internal Tool Settings

Options that Tool can specify. All settings should be passed as static properties of Tool's class.

| Name | Type | Default Value | Description |
| -- | -- | -- | -- |
| `displayInToolbox` | _Boolean_ | `false` | Pass `true` to display this `Tool` in the Editor's `Toolbox` |
| `toolboxIcon` | _String_ | — | Icon for Toolbox HTML string |
| `enableLineBreaks` | _Boolean_ | `false` | With this option, CodeX Editor won't handle Enter keydowns. Can be helpful for Tools like `<code>` where line breaks should be handled by default behaviour. |
| `irreplaceable` | _Boolean_ | `false` | By default, **empty** `Blocks` can be **replaced** by other `Blocks` with the `Toolbox`. Some tools with media-content may prefer another behaviour. Pass `true` and `Toolbox` will add a new block below yours.  |
| `contentless` | _Boolean_ | `false` | Pass `true` for Tool which represents decorative empty `Blocks` |
| `isInline` | _Boolean_ | `false` | Describes Tool as a [Tool for the Inline Toolbar](tools-inline.md) |

### User configuration

All Tools can be configured by users. You can set up some of available settings along with Tool's class 
to the `tools` property of Editor Config.

```javascript
var editor = new CodexEditor({
  holderId : 'codex-editor',
  tools: {
    text: {
      class: Text,
      inlineToolbar : true,
      // other settings..
    },
    header: Header
  },
  initialBlock : 'text',
});
```

There are few options available by CodeX Editor.

| Name | Type | Default Value | Description |
| -- | -- | -- | -- |
| `inlineToolbar` | _Boolean/Array_ | `false` | Pass `true` to enable the Inline Toolbar with all Tools, or pass an array with specified Tools list |
| `config` | _Object_ | `null` | User's configuration for Plugin.

### Paste handling

CodeX Editor handles paste on Blocks and provides API for Tools to process the pasted data.

When user pastes content into Editor, pasted content is splitted into blocks.

1. If plain text has been pasted, it is split by new line characters
2. If HTML string has been pasted, it is split by block tags

Also Editor API allows you to define RegExp patterns to substitute them by your data.

To provide paste handling for your Tool you need to define static getter `onPaste` in Tool class.
`onPaste` getter should return object with fields described below.

##### HTML tags handling

To handle pasted HTML elements object returned from `onPaste` getter should contain following fields: 

| Name | Type | Description |
| -- | -- | -- |
| `handler(content: HTMLElement)` | `Function` | _Optional_. Pasted HTML elements handler. Gets one argument `content`. `content` is HTML element extracted from pasted data. Handler should return the same object as Tool's `save` method |
| `tags` | `String[]` | _Optional_. Should contain all tag names you want to be extracted from pasted data and be passed to your `handler` method |


For correct work you MUST provide `onPaste.handler` at least for `initialBlock` Tool.

> Example

Header tool can handle `H1`-`H6` tags using paste handling API

```javascript
static get onPaste() {
  return {
    tags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
    handler: (element) => ({
      type: element.tagName,
      text: element.innerHTML
    })
  }
}
```

> One tag can be handled by one Tool only.

##### Patterns handling

Your Tool can analyze text by RegExp patterns to substitute pasted string with data you want. Object returned from `onPaste` getter should contain following fields to use patterns:

| Name | Type | Description |
| -- | -- | -- |
| `patterns` | `Object` | _Optional_. `patterns` object contains RegExp patterns with their names as object's keys |
| `patternHandler(text: string, key: string)` | `Function` | _Optional_. Gets pasted string and pattern name. Should return the same object as Tool `save` method |

**Note** Editor will check pattern's full match, so don't forget to handle all available chars in there. 

Pattern will be processed only if paste was on `initialBlock` Tool and pasted string length is less than 450 characters.

> Example

You can handle youtube links and insert embeded video instead:

```javascript
static get onPaste() {
  return {
    patterns: {
      youtube: /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?‌​=]*)?/
    },
    patternHandler: (text, key) => {
      const urlData = Youtube.onPaste.patterns[key].exec(text);
      
      return {
        iframe: Youtube.makeEmbededFromURL(urlData)
      };
    }
  }
}
```

> Both `onPaste.handler` and `onPaste.patternHandler` can be `async` or return a `Promise`.

### Drag'n'drop handling

Your Tool can handle files drag'n'drop.

To handle dropped file you should provide `onDrop` static property with following fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `extensions` | `string[]` | _Optional_ Array of extensions your Tool can handle |
| `mimeTypes` | `sring[]` | _Optional_ Array of MIME types your Tool can handle |
| `handler` | `(file: File) => {data: any}` | Handler method should return the same object as `save` method |

Example

```javascript
static get onDrop() {
  return {
    mimeTypes: ['image/*'],
    extensions: ['json'],
    handler: (file) => {
      /* do smth with the file */
      
      return {
        data // Some extracted content
      }
    }
  }
}
```

### Sanitize
