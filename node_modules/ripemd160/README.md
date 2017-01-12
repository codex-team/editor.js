ripemd160
=========

JavaScript component to compute the RIPEMD160 hash of strings or bytes.


Install
-------

### Node.js/Browserify

    npm install --save ripemd160


Usage
-----

### ripemd160(input)

Input either a string or `Buffer`. Output is a `Buffer`.

```js
console.log(ripemd160("hello").toString('hex')) // => 108f07b8382412612c048d07d13f814118445acd"
```



Credits
-------

Most of the code from CryptoJS https://code.google.com/p/crypto-js/





