<a href="https://editorjs.io/"><p align="center"><img src="https://capella.pics/79ce946a-d636-41cd-aa96-d3bc5ecfde03.jpg"></p></a>

[![](https://flat.badgen.net/npm/v/@editorjs/editorjs?icon=npm)](https://www.npmjs.com/package/@editorjs/editorjs)
[![](https://flat.badgen.net/bundlephobia/min/@editorjs/editorjs?color=cyan)](https://www.npmjs.com/package/@editorjs/editorjs)
[![](https://flat.badgen.net/bundlephobia/minzip/@editorjs/editorjs?color=green)](https://www.npmjs.com/package/@editorjs/editorjs)
[![Backers on Open Collective](https://opencollective.com/editorjs/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/editorjs/sponsors/badge.svg)](#sponsors) 
[![](https://flat.badgen.net/npm/license/@editorjs/editorjs)](https://www.npmjs.com/package/@editorjs/editorjs)
[![Join the chat at https://gitter.im/codex-team/editor.js](https://badges.gitter.im/codex-team/editor.js.svg)](https://gitter.im/codex-team/editor.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Version 2.0 is here!

We are glad to introduce the next version of Editor.js. Totally new core, structure and plugins — that was an impressive adventure 🤓.

Join [public Telegram-chat](//t.me/codex_editor) or [Gitter-channel](https://gitter.im/codex-team/editor.js) where you can always find a support.

### Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- |
| Edge 12+ | Firefox 18+ | Chrome 49+ | Safari 10+ | Safari 10+ | Opera 36+

## ⭐️ If you like a project

If you like Editor.js you can support project improvements and development of new features with a small donation on [Open Collective](https://opencollective.com/editorjs) or [Patreon](https://www.patreon.com/editorjs) 

## Documentation

Please, visit [https://editorjs.io/](https://editorjs.io) to view all documentation articles.

- [Base concepts](https://editorjs.io/base-concepts)
- [Getting started](https://editorjs.io/getting-started)
- [Configuration](https://editorjs.io/configuration)
- [How to create a Block Tool Plugin](https://editorjs.io/creating-a-block-tool)
- [How to create an Inline Tool Plugin](https://editorjs.io/creating-an-inline-tool)
- [API for Tools](https://editorjs.io/tools-api)

You can join a [Gitter-channel](https://gitter.im/codex-team/editor.js) or [Telegram-chat](//t.me/codex_editor) and ask a question.

---

## Changelog

See a whole [Changelog](/docs/CHANGELOG.md)

# So how to use Editor.js

## Basics

Editor.js is a Block-Styled editor. Blocks are structural units, of which the Entry is composed.
For example, `Paragraph`, `Heading`, `Image`, `Video`, `List` are Blocks. Each Block is represented by Plugin.
We have [many](http://github.com/editor-js/) ready-to-use Plugins and a [simple API](https://editorjs.io/tools-api) for creating new ones.

So how to use the Editor after [Installation](https://editorjs.io/getting-started).

- Create new Blocks by Enter or with the Plus Button
- Press `TAB` or click on the Plus Button to view the Toolbox
- Press `TAB` again to leaf Toolbox and select a Block you need. Then press Enter.


 ![](https://github.com/editor-js/list/raw/master/assets/example.gif)

- Select text fragment and apply a style or insert a link from the Inline Toolbar

![](https://capella.pics/7ccbcfcd-1c49-4674-bea7-71021468a1bd.jpg)

- Use «three-dots» button on the right to open Block Settings. From here, you can move and delete a Block
or apply Tool's settings, if it provided. For example, set a Heading level or List style.

![](https://capella.pics/01a55381-46cd-47c7-b92e-34765434f2ca.jpg)

## Shortcuts

We really appreciate shortcuts. So there are few presets.

Shortcut | Action | Restrictions
-- | -- | --
`TAB` | Show/leaf a Toolbox. | On empty block
`SHIFT+TAB` | Leaf back a Toolbox. | While Toolbox is opened
`ENTER` | Create a Block | While Toolbox is opened and some Tool is selected
`CMD+B` | Bold style | On selection
`CMD+I` | Italic style | On selection
`CMD+K` | Insert a link | On selection

Also we support shortcuts on the all type of Tools. Specify a shortcut with the Tools configuration. For example:

```js
var editor = new EditorJS({
  //...
  tools: {
    header: {
      class: Header,
      shortcut: 'CMD+SHIFT+H'
    },
    list: {
      class: List,
      shortcut: 'CMD+SHIFT+L'
    }
  }
  //...
 });

```


# Installation Guide

There are few steps to run Editor.js on your site.

1. [Load Editor's core](#load-editors-core)
2. [Load Tools](#load-tools)
3. [Initialize Editor's instance](#create-editor-instance)

## Load Editor's core

Firstly you need to get Editor.js itself. It is a [minified script](dist/editor.js) with Editor's core and some default must-have tools.

Choose the most usable method of getting Editor for you.

- Node package
- Source from CDN
- Local file from project

### Node.js

Install the package via NPM or Yarn

```shell
npm i @editorjs/editorjs
```

Include module in your application

```javascript
const EditorJS = require('@editorjs/editorjs');
```

### Use from CDN

You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/editorjs).

`https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest`

Then require this script.

```html
<script src="..."></script>
```

### Save sources to project

Copy [editor.js](build/editor.js) file to your project and load it.

```html
<script src="editor.js"></script>
```

## Load Tools

Each Block at the Editor.js represented by [Tools](docs/tools.md). There are simple external scripts with own logic. Probably you want to use several Block Tools that should be connected.

For example check out our [Header](https://github.com/editor-js/header) Tool that represents heading blocks.

You can install Header Tool by the same way as the Editor (Node.js, CDN, local file).

Check [Editor.js's community](https://github.com/editor-js/) to see more ready-to-use Tools.

**Example:** use Header from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/codex.editor.header@2.0.4/dist/bundle.js"></script>
```

## Create Editor instance

Create an instance of Editor.js and pass [Configuration Object](types/configs/editor-config.d.ts) with `holderId` and tools list.

```html
<div id="editorjs"></div>
```

You can create a simple Editor with only default Paragraph Tool by passing a string with element's Id (wrapper for Editor) as a configuration param. Or use the default `editorjs` id for wrapper.

```javascript
var editor = new EditorJS(); /** Zero-configuration */

// equals

var editor = new EditorJS('editorjs');
````

Or pass a whole settings object.

```javascript
var editor = new EditorJS({
    /**
     * Create a holder for the Editor and pass its ID
     */
    holder : 'editorjs',

    /**
     * Available Tools list.
     * Pass Tool's class or Settings object for each Tool you want to use
     */
    tools: {
        header: {
          class: Header,
          inlineToolbar : true
        },
        // ...
    },

    /**
     * Previously saved data that should be rendered
     */
    data: {}
});
```

## Saving Data

Call `editor.save()` and handle returned Promise with saved data.

```javascript
editor.save()
  .then((savedData) => {
    console.log(savedData);
  });
```

## Example

Take a look at the [example.html](example/example.html) to view more detailed examples.

## Credits and references

- We use [HTMLJanitor](https://github.com/guardian/html-janitor) module in our Sanitizer module. 

# Support project improvements

Love Editor.js? Please consider supporting our collective:

 👉  [https://opencollective.com/editorjs](https://opencollective.com/editorjs)
 
 👉  [Patreon](https://www.patreon.com/editorjs)
 
## Contributors

This project exists thanks to all the people who contribute. <img src="https://opencollective.com/editorjs/contributors.svg?width=890&button=false" />

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/editorjs#backer)]

<a href="https://opencollective.com/editorjs#backers" target="_blank"><img src="https://opencollective.com/editorjs/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/editorjs#sponsor)]

<a href="https://opencollective.com/editorjs/sponsor/0/website" target="_blank"><img src="https://opencollective.com/editorjs/sponsor/0/avatar.svg"></a>

# About team

We are CodeX and we build products for developers and makers. 

Follow us on Twitter: [twitter.com/codex_team](https://twitter.com/codex_team)

Feel free to contact: <a href="mailto:team@codex.so?subject=Editor.js feedback">team@codex.so</a>

[codex.so](https://codex.so)
