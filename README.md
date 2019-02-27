<p align="center"><img src="https://capella.pics/3c0b525b-50d9-4720-8aad-9148114cfa6e.jpg"></p>

[![](https://flat.badgen.net/npm/v/codex.editor?icon=npm)](https://www.npmjs.com/package/codex.editor)
[![](https://flat.badgen.net/bundlephobia/min/codex.editor?color=cyan)](https://www.npmjs.com/package/codex.editor)
[![](https://flat.badgen.net/bundlephobia/minzip/codex.editor?color=green)](https://www.npmjs.com/package/codex.editor)
[![](https://flat.badgen.net/npm/license/codex.editor)](https://www.npmjs.com/package/codex.editor)

## Version 2.0-beta is here!

We are glad to introduce the next version of CodeX Editor. Totally new core, structure and plugins — that was an impressive adventure 🤓.

Welcome to testing stage. Please, join a [public Telegram-chat](//t.me/codex_editor) where you always find a support.

### Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- |
| Edge 12+ | Firefox 18+ | Chrome 49+ | Safari 10+ | Safari 10+ | Opera 36+

### 2.7-2.9 changelog

- `Improvements` Prevent navigating back on Firefox when Block is removing by backspace 
- `New` Blocks selected with RectangleSelection can be also removed, copied or cut
- `New` Migrate from postcss-cssnext to postcss-preset-env and disable postcss-custom-properties which conflicts with postcss-preset-env
- `New` *RectangeSelection* - Ability to select Block or several Blocks with mouse

### 2.2—2.7 changelog

- `New` *Sanitize API* — [Sanitize Config](https://github.com/codex-team/codex.editor/blob/master/docs/tools.md#automatic-sanitize) of `Block Tools` now automatically extends by tags of `Inline Tools` that is enabled by current Tool by `inlineToolbar` option. You don't need more to specify `a, b, mark, code` manually. This feature will be added to fields that supports inline markup.
- `New` *Block Selection* — Ability to select Block by `CMD+A`, and the whole Editor by double `CMD+A`. After that, you can copy (`CMD+C`), remove (`Backspace`) or clear (`Enter`) selected Blocks.
- `New` *[Styles API](https://github.com/codex-team/codex.editor/blob/master/types/api/styles.d.ts)* — Added `button` class for stylization of any buttons provided by Tools with one unified style.
- `New` *[Notifier API](https://github.com/codex-team/codex.editor/blob/master/docs/api.md#notifierapi)* — methods for showing user notifications: on success, errors, warnings, etc. 
- `New` *Block Tool* — [Table](http://github.com/codex-editor/table) constructor 💪 
- `New` If one of the Tools is unavailable on Editor initialization, its Blocks will be rendered with *Dummy Block*, describing that user can not edit content of this Block. Dummy Blocks can be moved, removed and saved as normal Blocks. So saved data won't be lost if one of the Tools is failed 
- `New` [Public TS-types](https://github.com/codex-team/codex.editor/tree/master/types) are presented.
- `Changes` *Tools API*  — options `irreplaceable` and `contentless` was removed.
- `Changes` *Tools API* — [Paste API](https://github.com/codex-team/codex.editor/blob/master/docs/tools.md#paste-handling): tags, patterns and mime-types now should be specified by Tool's `pasteConfig` static property. Custom Paste Event should be handled by `onPaste(event)` that should not be static from now.
- `Changes` *Tools API* — options `displayInToolbox ` and `toolboxIcon` was removed. Use [`toolbox`](https://github.com/codex-team/codex.editor/blob/master/docs/tools.md#internal-tool-settings) instead, that should return object with `icon` and `title` field, or `false` if Tool should not be placed at the Toolbox. Also, there are a way to override `toolbox {icon, title}` settings provided by Tool with you own settings at the Initial Config.
- `Improvements` — All Projects code now on TypeScript
- `Improvements` — NPM package size decreased from 1300kb to 422kb
- `Improvements` — Bundle size decreased from 438kb to 252kb
- `Improvements` — `Inline Toolbar`: when you add a Link to the selected fragment, Editor will highlight this fragment even when Caret is placed into the URL-input.
- `Improvements` — Block Settings won't be shown near empty Blocks of `initialType` by default. You should click on them instead.
- `Improvements` — `onChange`-callback now will be fired even with children attributes changing.
- `Improvements` — HTMLJantior package was updated due to found vulnerability
- `Improvements` — Logging improved: now all Editor's logs will be preceded by beautiful label with current Editor version.
- `Improvements` — Internal `isEmpty` checking was improved for Blocks with many children nodes (200 and more)
- `Improvements` — Paste improvements: tags that can be substituted by Tool now will matched even on deep-level of pasted DOM three.
- `Improvements` — There is no more «unavailable» sound on copying Block by `CMD+C` on macOS
- `Improvements` — Dozens of bugfixes and small improvements

See a whole [Changelog](/docs/CHANGELOG.md)

## Documentation

While we develop the new Documentation Site with all stuff, you can check some available docs at the [docs/](docs/) dir.

- [Installation](docs/installation.md)
- [How to use](docs/usage.md)
- [How to create a Block Tool Plugin](docs/tools.md)
- [How to create an Inline Tool Plugin](docs/tools-inline.md)
- [API for Tools](docs/api.md)

Sorry if we missed something. You can join a [Telegram-chat](//t.me/codex_editor) and ask a question.

---

# So how to use CodeX Editor

## Basics

CodeX Editor is a Block-Styled editor. Blocks are structural units, of which the Entry is composed.
For example, `Paragraph`, `Heading`, `Image`, `Video`, `List` are Blocks. Each Block is represented by Plugin.
We have [many](http://github.com/codex-editor) ready-to-use Plugins and the [simple API](docs/tools.md) for creation new ones.

So how to use the Editor after [Installation](docs/installation.md).

- Create new Blocks by Enter or with the Plus Button
- Press `TAB` or click on the Plus Button to view the Toolbox
- Press `TAB` again to leaf Toolbox and select a Block you need. Then press Enter.


 ![](https://github.com/codex-editor/list/raw/master/assets/example.gif)

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
var editor = CodexEditor({
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

There are few steps to run CodeX Editor on your site.

1. [Load Editor's core](#load-editors-core)
2. [Load Tools](#load-tools)
3. [Initialize Editor's instance](#create-editor-instance)

## Load Editor's core

Firstly you need to get CodeX Editor itself. It is a [minified script](build/codex-editor.js) with Editor's core and some default must-have tools.

Choose the most usable method of getting Editor for you.

- Node package
- Source from CDN
- Local file from project

### Node.js

Install the package via NPM or Yarn

```shell
npm i codex.editor --save-dev
```

Include module in your application

```javascript
const CodexEditor = require('codex.editor');
```

### Use from CDN

You can load specific version of package from [jsDelivr CDN](https://www.jsdelivr.com/package/npm/codex.editor).

`https://cdn.jsdelivr.net/npm/codex.editor@2.0.0`

Then require this script.

```html
<script src="..."></script>
```

### Save sources to project

Copy [codex-editor.js](build/codex-editor.js) file to your project and load it.

```html
<script src="codex-editor.js"></script>
```

## Load Tools

Each Block at the CodeX Editor represented by [Tools](docs/tools.md). There are simple external scripts with own logic. Probably you want to use several Block Tools that should be connected.

For example check out our [Header](https://github.com/codex-editor/header) Tool that represents heading blocks.

You can install Header Tool by the same way as the Editor (Node.js, CDN, local file).

Check [CodeX Editor's community](https://github.com/codex-editor) to see more ready-to-use Tools.

**Example:** use Header from CDN

```html
<script src="https://cdn.jsdelivr.net/npm/codex.editor.header@2.0.4/dist/bundle.js"></script>
```

## Create Editor instance

Create an instance of CodeX Editor and pass [Configuration Object](types/configs/editor-config.d.ts) with `holderId` and tools list.

```html
<div id="codex-editor"></div>
```

You can create a simple Editor with only default Paragraph Tool by passing a string with element's Id (wrapper for Editor) as a configuration param. Or use the default `codex-editor` id for wrapper.

```javascript
var editor = new CodexEditor(); /** Zero-configuration */

// equals

var editor = new CodexEditor('codex-editor');
````

Or pass a whole settings object.

```javascript
var editor = new CodexEditor({
    /**
     * Create a holder for the Editor and pass its ID
     */
    holderId : 'codex-editor',

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

Call `editor.saver.save()` and handle returned Promise with saved data.

```javascript
editor.saver.save()
  .then((savedData) => {
    console.log(savedData);
  });
```

## Example

Take a look at the [example.html](example/example.html) to view more detailed examples.

## Credits and references

- We use [HTMLJanitor](https://github.com/guardian/html-janitor) module in our Sanitizer module. 


