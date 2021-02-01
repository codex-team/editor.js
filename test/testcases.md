# Editor.js specs

This document will describe various test cases of the editor.js functionality. Features will be organized by modules. Cases covered by tests should be marked by the check mark.

## Configuration

- [ ] Zero configuration
  - [ ] Editor.js should be initialized on element with the default `editorjs` id.
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
    - [ ] If omitted the caret shouldn't be placed anywhere.
  - [ ] With the not-empty editor
    - [ ] If `true` passed, the caret should be placed to the end of the last block.
    - [ ] If `false` passed, the caret shouldn't be placed anywhere.
    - [ ] If omitted the caret shouldn't be placed anywhere.

- [ ] `placeholder` property
  - [ ] With the empty editor
    - [ ] If `string` passed, the string should be placed as a placeholder to the first empty block only.
    - [ ] If `false` passed, the first empty block should be placed without placeholder.
    - [ ] If omitted the first empty block should be placed without placeholder.

- [ ] `minHeight` property
    - [ ] If `number` passed, the height of the editor's bottom area from the last Block should be the `number`.
    - [ ] If omitted the height of editor's bottom area from the last Block should be the default `300`.

- [ ] `logLevel` property
  - [ ] If `VERBOSE` passed, the editor should output all messages to the console.
  - [ ] If `INFO` passed, the editor should output info and debug messages to the console.
  - [ ] If `WARN` passed, the editor should output only warning messages to the console.
  - [ ] If `ERROR` passed, the editor should output only error messages to the console.
  - [ ] If omitted the editor should output all messages to the console.

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
  - [ ] If `object` passed
    - [ ] Editor.js should be initialized with the Passed tools only.
    - [ ] If `name` property
      - [ ] Editor.js JSON formate should includes `name` as `type` in block data for mentioned `tool`.
      - [ ] If `class` property
        - [ ] Editor.js should initialized the `tool` with it's default Settings.
      - [ ] If `object` property
        - [ ] If `class` property
          - [ ] If `class` passed
            - [ ] Editor.js should initialize `tool` with `class`.
          - [ ] If omitted
            - [ ] Editor.js should throw the `Error`.
        - [ ] If `config` property
          - [ ] If `object` passed
            - [ ] Editor.js should initialize `tool` with `config`.
          - [ ] If ommited
            - [ ] Editor.js should initialize `tool` with default `config`.
        - [ ] If `shortcut` property
          - [ ] If `String` passed
            - [ ] Editor.js should append the `tool` when `String` based shortcut pressed.
          - [ ] If ommited
            - [ ] Editor.js should initialize `tool` without any `shortcut`.
        - [ ] If `inilineToolbar` property
          - [ ] If `true`
            - [ ] Editor.js should initialize `tool` with default `inilineToolbar`.
          - [ ] If `false`
            - [ ] Editor.js should initialize `tool` without `inilineToolbar`.
          - [ ] If `array`
            - [ ] Editor.js should initialize `tool` by overriding default `inlineToolbar`.
          - [ ] If ommited
            - [ ] Editor.js should initialize `tool` without `inilineToolbar`.
  - [ ] If omitted 
    - [ ] Editor.js should be initialized with the Paragraph tool only.
