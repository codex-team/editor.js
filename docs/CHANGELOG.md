# Changelog

### 2.2.23 changelog

- `New` *Shortcuts — copy and cut Blocks selected by CMD+A

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

See a whole [Changelog](/docs/)

### 2.1-beta changelog

- `New` *Tools API* — support pasted content via drag-n-drop or from the Buffer. See [documentation](https://github.com/codex-team/codex.editor/blob/master/docs/tools.md#paste-handling) and [example](https://github.com/codex-editor/simple-image/blob/master/src/index.js#L177) at the Simple Image Tool.
- `New` *Tools API* — new `sanitize` getter for Tools for automatic HTML sanitizing of returned data. See [documentation](https://github.com/codex-team/codex.editor/blob/master/docs/tools.md#sanitize) and [example](https://github.com/codex-editor/paragraph/blob/master/src/index.js#L121) at the Paragraph Tool
- `New` Added `onChange`-callback, fired after any modifications at the Editor. See [documentation](https://github.com/codex-team/codex.editor/blob/master/docs/installation.md#features).
- `New` New Inline Tool example — [Marker](https://github.com/codex-editor/marker)
- `New` New Inline Tool example — [Code](https://github.com/codex-editor/code)
- `New` New [CodeX Editor PHP](http://github.com/codex-team/codex.editor.backend) — example of server-side implementation with HTML purifying and data validation.
- `Improvements` - Improvements of Toolbar's position calculation.
- `Improvements` — Improved zero-configuration initialization.
- and many little improvements.
