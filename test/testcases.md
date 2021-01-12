# Editor.js specs

This document will describe various test cases of editor.js functionality. Features will be organized by modules. Cases covered by tests should be marked by the checkmark.

## Configuration

- [ ] Zero configuration
  - [ ] Editor.js should be initialized on element with the default `editorjs` id.
  - [ ] Editor.js should throw an error in case when there is no element with `editorjs` id.
  - [ ] Editor.js should be initialized with the Paragraph tool only
  - [ ] The Inline Toolbar of the Paragraph tool should contain all default Inline Tools - `bold`, `italic`, `link`

- [ ] `holder` property
  - [ ] Editor.js should be initialized on the element with passed via `holder` property
  - [ ] Editor.js should throw an error if passed `holder` value is not an Element node

- [ ] `autofocus` property
  - [ ] With the empty editor
    - [ ] If `true` passed, the caret should be placed to the first empty block
    - [ ] If `false` passed, the caret shouldn't be placed anywhere
    - [ ] If omitted the caret shouldn't be placed anywhere
  - [ ] With the not-empty editor
    - [ ] If `true` passed, the caret should be placed to the end of the last block
    - [ ] If `false` passed, the caret shouldn't be placed anywhere
    - [ ] If omitted the caret shouldn't be placed anywhere

- [ ] `placeholder` property

- [ ] `sanitizer` property

- [ ] `hideToolbar` property

- [ ] `minHeight` property

- [ ] `logLevel` property

- [ ] `tools` property

- [ ] `defaultBlock` property
