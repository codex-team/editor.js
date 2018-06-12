# CodeX Editor Tools

CodeX Editor is a block-oriented editor. It means that entry composed with the list of `Blocks` of different types: `Texts`, `Headers`, `Images`, `Quotes` etc. 

`Tool` — is a class that provide custom `Block` type. All Tools represented by `Plugins`.

## Tool class structure

### Constructor

### Render

### Save

### Validate

### Merge (optional)

Method that specifies how to merge two `Blocks` of the same type, for example on `Backspace` keypress. 
Method does accept data object in same format as the `Render` and it should provide logic how to combine new 
data with the currently stored value.

### Internal Tool Settings

Options that Tool can specify. All settings should be passed as static properties of Tool's class.

| Name | Type | Default Value | Description |
| -- | -- | -- | -- |
| `displayInToolbox` | _Boolean_ | `false` | Pass `true` to display this `Tool` in the Editor's `Toolbox` |
| `iconClassName` | _String_ | — | CSS class name for the `Toolbox` icon. Used when `displayInToolbox` is `true` |
| `irreplaceable` | _Boolean_ | `false` | By default, **empty** `Blocks` can be **replaced** by other `Blocks` with the `Toolbox`. Some tools with media-content may prefer another behaviour. Pass `true` and `Toolbox` will add a new block below yours.  |
| `contentless` | _Boolean_ | `false` | Pass `true` for Tool which represents decorative empty `Blocks` |

### User configuration

All Tools can be configured by users. For this reason, we provide `toolConfig` option at the Editor Initial Settings. 
Unlike Internal Tool Settings, this options can be specified outside the Tool class, 
so users can set up different configurations for the same Tool.

```js 
var editor = new CodexEditor({
  holderId : 'codex-editor',
  initialBlock : 'text',
  tools: {
    text: Text // 'Text' Tool class for Blocks with type 'text'
  }, 
  toolsConfig: {
    text: {  // user configuration for Blocks with type 'text'
      inlineToolbar : true,
    }
  }
});
```

There are few options available by CodeX Editor.

| Name | Type | Default Value | Description |
| -- | -- | -- | -- |
| `enableLineBreaks` | _Boolean_ | `false` | With this option, CodeX Editor won't handle Enter keydowns. Can be helpful for Tools like `<code>` where line breaks should be handled by default behaviour. |
| `inlineToolbar` | _Boolean|Array_ | `false` | Pass `true` to enable the Inline Toolbar with all Tools, or pass an array with specified Tools list |



### Sanitize 
