# CodeX Editor Sanitizer Module

The `Sanitizer` module represents a set of methods that clears taint strings.
Uses lightweight npm package with simple API [html-janitor](https://www.npmjs.com/package/html-janitor)
 
Sanitizer class implements basic Module class that holds User configuration
and default CodeX Editor instances

You can read more about Module class [here]()

## Properties

Default Editor Sanitizer configuration according to the html-janitor API
```javascript
defaultConfig
```

Custom User configuration which passed on Editor initialization. Data type must be according to the html-janitor API
```javascript
sanitizerConfig
```


Property that holds an instance used in Module
```javascript
sanitizerInstance
```

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

