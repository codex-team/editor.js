<a href="https://editorjs.io/"><p align="center"><img src="https://capella.pics/79ce946a-d636-41cd-aa96-d3bc5ecfde03.jpg"></p></a>

[![](https://flat.badgen.net/npm/v/@editorjs/editorjs?icon=npm)](https://www.npmjs.com/package/@editorjs/editorjs)
[![](https://flat.badgen.net/bundlephobia/min/@editorjs/editorjs?color=cyan)](https://www.npmjs.com/package/@editorjs/editorjs)
[![](https://flat.badgen.net/bundlephobia/minzip/@editorjs/editorjs?color=green)](https://www.npmjs.com/package/@editorjs/editorjs)
[![Backers on Open Collective](https://opencollective.com/editorjs/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/editorjs/sponsors/badge.svg)](#sponsors)
[![](https://img.shields.io/npm/l/@editorjs/editorjs?style=flat-square)](https://www.npmjs.com/package/@editorjs/editorjs)
[![Join the chat at https://gitter.im/codex-team/editor.js](https://badges.gitter.im/codex-team/editor.js.svg)](https://gitter.im/codex-team/editor.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

| | | | | | |
| --------- | --------- | --------- | --------- | --------- | --------- |
| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="16px" height="16px" /> Edge 12+ | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="16px" height="16px" /> Firefox 18+ | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="16px" height="16px" /> Chrome 49+ | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="16px" height="16px" /> Safari 10+ | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="16px" height="16px" /> iOS Safari 10+ | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="16px" height="16px" /> Opera 36+



## Roadmap

<img align="right" width="342" src="https://user-images.githubusercontent.com/3684889/152149321-3f9c585d-7d87-4dad-ab14-def0d526e71c.png" hspace="50">

- Collaborative editing
  - [ ] Implement Inline Tools JSON format `In progress` [#1801](https://github.com/codex-team/editor.js/pull/1801)
  - [ ] Implement Operations creation and transformations
  - [ ] Implement Tools API changes
  - [ ] Implement Server and communication
  - [ ] Update basic tools to fit the new API

- Unified Toolbox
  - [x] Block Tunes moved left [#1815](https://github.com/codex-team/editor.js/pull/1815)
  - [x] Toolbox become vertical [#2014](https://github.com/codex-team/editor.js/pull/2014)
  - [x] Ability to display several Toolbox buttons by the single Tool [#2050](https://github.com/codex-team/editor.js/pull/2050)
  - [ ] Conversion Toolbar uses Unified Toolbox `In progress`
  - [ ] Block Tunes become vertical
  - [ ] Conversion Toolbar added to the Block Tunes
- Ecosystem improvements

<a href="https://opencollective.com/editorjs/donate" target="_blank">
  <img width="432" alt="image" src="https://user-images.githubusercontent.com/3684889/166146666-e6f5fcc3-bccf-43b0-b48c-e8f1b25b2896.png">
</a>

##


## If you like a project 💗💗💗

If you like Editor.js you can support project improvements and development of new features with a donation to our collective.

 👉  [https://opencollective.com/editorjs](https://opencollective.com/editorjs)

### Sponsors

Support us by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/editorjs/contribute/sir-8679/checkout)]

<a href="https://humm.earth/" target="_blank"><img src="https://images.opencollective.com/hummearth/2a8406a/logo/256.png" width="64"></a>
<a href="https://tesen.com/" target="_blank"><img src="https://images.opencollective.com/tesen-media-inc/b90cf6a/logo/256.png" width="64"></a>
<a href="https://slid.cc/" target="_blank"><img src="https://images.opencollective.com/slid_team/ff564d7/logo/256.png" width="64"></a>


 ### Backers

 Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/editorjs/contribute/backer-8632/checkout)]

 <a href="https://opencollective.com/editorjs#backers" target="_blank"><img src="https://opencollective.com/editorjs/backers.svg?width=890"></a>

### Contributors

This project exists thanks to all the people who contribute. <img src="https://opencollective.com/editorjs/contributors.svg?width=890&button=false" />

We really welcome new contributors. If you want to make some code with us, please take a look at the [Good First Tasks](https://github.com/codex-team/editor.js/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+task%22). You can write to us on `team@codex.so` or via special [Telegram chat](https://t.me/editorjsdev), or any other way.

## Documentation

Please visit [https://editorjs.io/](https://editorjs.io) to view all documentation articles.

- [Base concepts](https://editorjs.io/base-concepts)
- [Getting started](https://editorjs.io/getting-started)
- [Configuration](https://editorjs.io/configuration)
- [How to create a Block Tool Plugin](https://editorjs.io/creating-a-block-tool)
- [How to create an Inline Tool Plugin](https://editorjs.io/creating-an-inline-tool)
- [API for Tools](https://editorjs.io/tools-api)

You can join a [Gitter-channel](https://gitter.im/codex-team/editor.js) or [Telegram-chat](//t.me/codex_editor) and ask a question.

## Changelog

See the whole [Changelog](/docs/CHANGELOG.md)

If you want to follow Editor.js updates, [subscribe to our Newsletter](http://digest.editorjs.io/).

## How to use Editor.js

### Basics

Editor.js is a Block-Styled editor. Blocks are structural units, of which the Entry is composed.
For example, `Paragraph`, `Heading`, `Image`, `Video`, `List` are Blocks. Each Block is represented by Plugin.
We have [many](http://github.com/editor-js/) ready-to-use Plugins and a [simple API](https://editorjs.io/tools-api) for creating new ones.

How to use the Editor after [Installation](https://editorjs.io/getting-started).

- Create new Blocks by pressing Enter or clicking the Plus Button
- Press `TAB` or click on the Plus Button to view the Toolbox
- Press `TAB` again to leaf Toolbox and select a Block you need. Then press Enter.


 ![](https://github.com/editor-js/list/raw/master/assets/example.gif)

- Select a text fragment and apply a style or insert a link from the Inline Toolbar

![](https://capella.pics/7ccbcfcd-1c49-4674-bea7-71021468a1bd.jpg)

- Use the «three-dots» button on the right to open Block Settings. From here, you can move and delete a Block
or apply a Tool's settings, if it provided. For example, you can set a Heading level or List style.

![](https://capella.pics/01a55381-46cd-47c7-b92e-34765434f2ca.jpg)

### Shortcuts

A few shortcuts are preset as available.

Shortcut | Action | Restrictions
-- | -- | --
`TAB` | Show/leaf a Toolbox. | On empty block
`SHIFT+TAB` | Leaf back a Toolbox. | While Toolbox is opened
`ENTER` | Create a Block | While Toolbox is opened and some Tool is selected
`CMD+B` | Bold style | On selection
`CMD+I` | Italic style | On selection
`CMD+K` | Insert a link | On selection

Each Tool can also have its own shortcuts. These are specified in the configuration of the Tool, for example:

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


## Installation Guide

There are few steps to run Editor.js on your site.

1. [Load Editor's core](#load-editors-core)
2. [Load Tools](#load-tools)
3. [Initialize Editor's instance](#create-editor-instance)

### Step 1. Load Editor's core

Get Editor.js itself. It is a [minified script](dist/editor.js) with Editor's core and some default must-have tools.

Choose the most usable method of getting Editor for you.

- Node package
- Source from CDN

##### Option A. NPM install

Install the package via NPM or Yarn

```shell
npm i @editorjs/editorjs
```

Include module in your application

```javascript
import EditorJS from '@editorjs/editorjs';
```

##### Option B. Use a CDN

You can load EditorJS directly from from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/@editorjs/editorjs).

`https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest`

For example, place this in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
```

Or download the bundle file and use it from your server.

```html
<script src="editor.js"></script>
```

### Step 2. Load the Tools that you want to make available

Each Block is represented by a [Tool](docs/tools.md). Tools are simple external scripts with their own logic. For example, there is a [Header](https://github.com/editor-js/header) Tool into which you type your heading text. If you want to be able to use this, install the Header Tool the same way as the Editor (Node.js, CDN, local file).

**Example:** use Header from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/codex.editor.header@2.0.4/dist/bundle.js"></script>
```

Check [Editor.js's community](https://github.com/editor-js/) to see more ready-to-use Tools.

### Step 3. Create Editor instance

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

### Saving Data

Call `editor.save()` and handle returned Promise with saved data.

```javascript
editor.save()
  .then((savedData) => {
    console.log(savedData);
  });
```

### Example

Take a look at the [example.html](example/example.html) to view more detailed examples.

## Credits and references

- We use [HTMLJanitor](https://github.com/guardian/html-janitor) module in our Sanitizer module.

# About CodeX

<img align="right" width="120" height="120" src="https://codex.so/public/app/img/codex-logo.svg" hspace="50">

CodeX is a team of digital specialists around the world interested in building high-quality open source products on a global market. We are [open](https://codex.so/join) for young people who want to constantly improve their skills and grow professionally with experiments in cutting-edge technologies.

| 🌐 | Join  👋  | Twitter | Instagram |
| -- | -- | -- | -- |
| [codex.so](https://codex.so) | [codex.so/join](https://codex.so/join) |[@codex_team](http://twitter.com/codex_team) | [@codex_team](http://instagram.com/codex_team/) |
