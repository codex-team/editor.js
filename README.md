<p align="center">
  <a href="https://editorjs.io/">
    <picture>
      <source media="(prefers-color-scheme: dark)"  srcset="./assets/logo_night.png">
      <source media="(prefers-color-scheme: light)" srcset="./assets/logo_day.png">
      <img alt="Editor.js Logo" src="./assets/logo_day.png">
    </picture>    
  </a>
</p>

<p align="center">
  <a href="https://editorjs.io/base-concepts/">Documentation</a> |
  <a href="https://github.com/codex-team/editor.js/blob/next/docs/CHANGELOG.md">Changelog</a> |
  <a href="https://github.com/codex-team/editor.js#roadmap">Roadmap</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editorjs/editorjs">
    <img src="https://flat.badgen.net/npm/v/@editorjs/editorjs?icon=npm" alt="npm"/>
  </a>
  <a href="https://www.npmjs.com/package/@editorjs/editorjs">
    <img src="https://flat.badgen.net/bundlephobia/minzip/@editorjs/editorjs?color=green" alt="Minzipped size"/>
  </a>
  <a href="https://github.com/codex-team/editor.js#backers">
    <img src="https://opencollective.com/editorjs/backers/badge.svg" alt="Backers on Open Collective"/>
  </a>
  <a href="https://github.com/codex-team/editor.js#sponsors">
    <img src="https://opencollective.com/editorjs/sponsors/badge.svg" alt="Sponsors on Open Collective"/>
  </a>
</p>

## About

Editor.js is an open-source text editor offering a variety of features to help users create and format content efficiently. It has a modern, block-style interface that allows users to easily add and arrange different types of content, such as text, images, lists, quotes, etc. Each Block is provided via a separate plugin making Editor.js extremely flexible.

Editor.js outputs a clean JSON data instead of heavy HTML markup. Use it in Web, iOS, Android, AMP, Instant Articles, speech readers, AI chatbots — everywhere. Easy to sanitize, extend and integrate with your logic. 

- 😍  Modern UI out of the box
- 💎  Clean JSON output
- ⚙️  Well-designed API
- 🛍  Various Tools available
- 💌  Free and open source

<picture>
  <img alt="Editor.js Overview" src="./assets/overview.png">
</picture>   

## Installation

It's quite simple:

1. Install Editor.js 
2. Install tools you need
3. Initialize Editor's instance

Install using NPM, Yarn, or [CDN](https://www.jsdelivr.com/package/npm/@editorjs/editorjs):

```shell
npm i @editorjs/editorjs
```

Include module in your code:

```javascript
import EditorJS from '@editorjs/editorjs';
```

Choose and install tools:

- [Heading](https://github.com/editor-js/header)
- [Link embed](https://github.com/editor-js/link)
- [Image](https://github.com/editor-js/image) 
- [Simple Image](https://github.com/editor-js/simple-image) (without backend requirement)
- [Checklist](https://github.com/editor-js/checklist)
- [Nested List](https://github.com/editor-js/nested-list)
- [Embeds](https://github.com/editor-js/embed) (YouTube, Twitch, Vimeo, Gfycat, Instagram, Twitter, etc)
- [Quote](https://github.com/editor-js/quote)
- [Table](https://github.com/editor-js/table)
- [Delimiter](https://github.com/editor-js/delimiter)
- [Warning](https://github.com/editor-js/warning)
- [Code](https://github.com/editor-js/code)
- [Raw HTML](https://github.com/editor-js/raw)
- [Attaches](https://github.com/editor-js/attaches)
- [Marker](https://github.com/editor-js/marker)

See the [😎 Awesome Editor.js](https://github.com/editor-js/awesome-editorjs) list for more tools.

Initialize the Editor:

```html
<div id="editorjs"></div>
```

```javascript
const editor = new EditorJS({
  tools: {
   // ... your tools
  }
});
````

See details about [Installation](https://editorjs.io/getting-started/) and [Configuration](https://editorjs.io/configuration/) at the documentation.

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

## Browser compatibility


| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="16px" height="16px" /> Edge 12+ | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="16px" height="16px" /> Firefox 18+ | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="16px" height="16px" /> Chrome 49+ | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="16px" height="16px" /> Safari 10+ | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="16px" height="16px" /> iOS Safari 10+ | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="16px" height="16px" /> Opera 36+ |
|-|-|-|-|-|-|


## Roadmap

<img align="right" width="342" src="./assets/roadmap.png" hspace="50">



- Unified Toolbox
  - [x] Block Tunes moved left [#1815](https://github.com/codex-team/editor.js/pull/1815)
  - [x] Toolbox becomes vertical [#2014](https://github.com/codex-team/editor.js/pull/2014)
  - [x] Ability to display several Toolbox buttons by the single Tool [#2050](https://github.com/codex-team/editor.js/pull/2050)
  - [x] Block Tunes become vertical
  - [ ] Block Tunes support nested menus `In progress`
  - [ ] Conversion Toolbar uses Unified Toolbox
  - [ ] Conversion Toolbar added to the Block Tunes
- Collaborative editing
  - [ ] Implement Inline Tools JSON format `In progress` [#1801](https://github.com/codex-team/editor.js/pull/1801)
  - [ ] Operations Observer, Executor, Manager, Transformer
  - [ ] Implement Undo/Redo Manager
  - [ ] Implement Tools API changes
  - [ ] Implement Server and communication
  - [ ] Update basic tools to fit the new API
- Other features
  - [ ] Blocks drag'n'drop
  - [ ] New cross-block selection
  - [ ] New cross-block caret moving
- Ecosystem improvements
  - [x] CodeX Icons — the way to unify all tools and core icons
  - [x] Homepage and Docs redesign
  - [ ] Editor.js DevTools — stand for core and tools development `In progress`
  - [ ] @editorjs/create-tool for Tools bootstrapping
  - [ ] Editor.js Design System
  - [ ] Editor.js Preset Env
  - [ ] Editor.js ToolKit
  - [ ] New core bundle system
  - [ ] New documentation and guides

<a href="https://opencollective.com/editorjs/donate" target="_blank">
  <picture>
    <source width="162px" media="(prefers-color-scheme: dark)"  srcset="./assets/support_night.png">
    <source width="162px" media="(prefers-color-scheme: light)" srcset="./assets/support_day.png">
    <img width="162px" alt="Support Editor.js" src="./assets/support_day.png">
  </picture>
</a>


<br>

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



## Community
You can join a [Gitter-channel](https://gitter.im/codex-team/editor.js) or [Telegram-chat](//t.me/codex_editor) and ask a question.
# About CodeX

<img align="right" width="120" height="120" src="https://codex.so/public/app/img/codex-logo.svg" hspace="50">

CodeX is a team of digital specialists around the world interested in building high-quality open source products on a global market. We are [open](https://codex.so/join) for young people who want to constantly improve their skills and grow professionally with experiments in cutting-edge technologies.

| 🌐 | Join  👋  | Twitter | Instagram |
| -- | -- | -- | -- |
| [codex.so](https://codex.so) | [codex.so/join](https://codex.so/join) |[@codex_team](http://twitter.com/codex_team) | [@codex_team](http://instagram.com/codex_team/) |
