# CodeX Editor Tools

CodeX Editor is a block-oriented editor. It means that entry composed with the list of `Blocks` of different types: `Texts`, `Headers`, `Images`, `Quotes` etc. 

`Tool` — is a class that provide custom `Block` type. All Tools represented by `Plugins`.

## Tool class structure

### Constructor

### Save

### Render

### Available settings

| Name | Type | Default Value | Description |
| -- | -- | -- | -- |
| `displayInToolbox` | _Boolean_ | `false` | Pass `true` to display this `Tool` in the Editor's `Toolbox` |
| `iconClassName` | _String_ | — | CSS class name for the `Toolbox` icon. Used when `displayInToolbox` is `true` |
| `irreplaceable` | _Boolean_ | `false` | By default, **empty** `Blocks` can be **replaced** by other `Blocks` with the `Toolbox`. Some tools with media-content may prefer another behaviour. Pass `true` and `Toolbox` will add a new block below yours.  |
| `contentless` | _Boolean_ | `false` | Pass `true` for Tool which represents decorative empty `Blocks` |

### Sanitize 
