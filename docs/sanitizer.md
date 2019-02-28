# Editor.js Sanitizer Module

The `Sanitizer` module represents a set of methods that clears taint strings.
Uses lightweight npm package with simple API [html-janitor](https://www.npmjs.com/package/html-janitor)

## Methods 

### clean

```javascript
clean(taintString, customConfig)
```

> Cleans up the passed taint string
 
#### params

| Param        | Type | Description|
| -------------|------ |:-------------:|
| taintString  | String | string that needs to be cleaned|
| customConfig | Object | Can be passed new config per usage (Default: uses default configuration)|

