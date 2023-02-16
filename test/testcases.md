# Editor.js specs

This document will describe various test cases of the editor.js functionality. Features will be organized by modules. Cases covered by tests should be marked by the checkmark.

## Configuration

- [ ] Zero configuration
  - [ ] Editor.js should be initialized on the element with the default `editorjs` id.
  - [ ] Editor.js should throw an error in case when there is no element with `editorjs` id.
  - [ ] Editor.js should be initialized with the Paragraph tool only.
  - [ ] The Inline Toolbar of the Paragraph tool should contain all default Inline Tools - `bold`, `italic`, `link`.

- [ ] `holder` property
  - [ ] Editor.js should be initialized on the element with passed via `holder` property.
  - [ ] Editor.js should throw an error if passed `holder` value is not an Element node.

- [ ] `autofocus` property
  - [ ] With the empty editor
    - [ ] If `true` passed, the caret should be placed to the first empty block.
    - [ ] If `false` passed, the caret shouldn't be placed anywhere.
    - [ ] If omitted, the caret shouldn't be placed anywhere.
  - [ ] With the not-empty editor
    - [ ] If `true` passed, the caret should be placed to the end of the last block.
    - [ ] If `false` passed, the caret shouldn't be placed anywhere.
    - [ ] If omitted, the caret shouldn't be placed anywhere.

- [ ] `placeholder` property
  - [ ] With the empty editor
    - [ ] If `string` passed, the string should be placed as a placeholder to the first empty block only.
    - [ ] If `false` passed, the first empty block should be placed without a placeholder.
    - [ ] If omitted, the first empty block should be placed without a placeholder.

- [ ] `minHeight` property
  - [ ] If `number` passed, the height of the editor's bottom area from the last Block should be the `number`.
  - [ ] If omitted the height of editor's bottom area from the last Block should be the default `300`.

- [ ] `logLevel` property
  - [ ] If `VERBOSE` passed, the editor should output all messages to the console.
  - [ ] If `INFO` passed, the editor should output info and debug messages to the console.
  - [ ] If `WARN` passed, the editor should output only warning messages to the console.
  - [ ] If `ERROR` passed, the editor should output only error messages to the console.
  - [ ] If omitted, the editor should output all messages to the console.

- [ ] `defaultBlock` property
  - [ ] If `string` passed
    - [ ] If passed `string` in the `tools` option, the passed tool should be used as the default tool.
    - [ ] If passed `string` not in the `tools` option, the Paragraph tool should be used as the default tool.
  - [ ] If omitted the Paragraph tool should be used as default tool.

- [ ] `sanitizer` property
  - [ ] If `object` passed
    - [ ] The Editor.js should clean the HTML tags according to mentioned configuration.
  - [ ] If omitted the Editor.js should be initialized with the default `sanitizer` configuration, which allows the tags like `paragraph`, `anchor`, and `bold` for cleaning HTML.

- [ ] `tools` property
  - [ ] If omitted,the Editor.js should be initialized with the Paragraph tool only.
  - [ ] If `object` passed
    - [ ] Editor.js should be initialized with all the passed tools.
    - [ ] The keys of the object should be represented as `type` fields for corresponded blocks in output JSON
    - [ ] If value is a JavaScript class, the class should be used as a tool
    - [ ] If value is an `object`
      - [ ] Checking the `class` property
        - [ ] If omitted, the tool should be skipped with a warning in a console.
        - [ ] If existed, the value of the `class` property should be used as a tool
      - [ ] Checking the `config` property
        - [ ] If `object` passed Editor.js should initialize `tool` and pass this object as `config` parameter of the tool's constructor
      - [ ] Checking the `shortcut` property
        - [ ] If `string` passed Editor.js should append the `tool` when such keys combination executed.
      - [ ] Checking the `inilineToolbar` property
        - [ ] If `true` passed, the Editor.js should show the Inline Toolbar for this tool with [common](https://editorjs.io/configuration#inline-toolbar-order) settings.
        - [ ] If `false` passed, the Editor.js should not show the Inline Toolbar for this tool.
        - [ ] If `array` passed, the Editor.js should show the Inline Toolbar for this tool with a passed list of tools and their order.
        - [ ] If omitted, the Editor.js should not show the Inline Toolbar for this tool.
      - [ ] Checking the `toolbox` property
        - [ ] If it contains `title`, this title should be used as a tool title
        - [ ] If it contains `icon`, this HTML code (maybe SVG) should be used as a tool icon

- [ ] `onReady` property
  - [ ] If `function` passed, the Editor.js should call the `function` when it's ready to work.
  - [ ] If omitted, the Editor.js should be initialized with the `tools` only.

- [ ] `onChange` property
  - [ ] If `function` passed,the Editor.js should call the `function` when something changed in Editor.js DOM.
  - [ ] If omitted, the Editor.js should be initialized with the `tools` only.

- [ ] `data` property
  - [ ] If omitted
    - [ ] the Editor.js should be initialized with the `tools` only.
    - [ ] the Editor.js should be empty.
  - [ ] If `object` passed
    - [ ] Checking the `blocks` property
      - [ ] If `array` of `object` passed,
        - [ ] for each `object` 
          - [ ] Checking the `type` and `data` property
            - [ ] the Editor.js should be initialize with `block` of class `type`
            - [ ] If `type` not present in `tools`, the Editor.js should throw an error.
      - [ ] If omitted
        - [ ] the Editor.js should be initialized with the `tools` only.
        - [ ] the Editor.js should be empty.

- [ ] `readOnly` property
  - [ ] If `true` passed,
    - [ ] If any `tool` have not readOnly getter defined,The Editor.js should throw an error.
    - [ ] otherwise, the Editor.js should be initialize with readOnly mode. 
  - [ ] If `false` passed,the Editor.js should be initialized with the `tools` only.
  - [ ] If omitted,the Editor.js should be initialized with the `tools` only.

- [ ] `i18n` property