var eslint = require("eslint")
var assign = require("object-assign")
var loaderUtils = require("loader-utils")
var crypto = require("crypto")
var fs = require("fs")
var findCacheDir = require("find-cache-dir")
var objectHash = require("object-hash")

var engines = {}
var cache = null
var cachePath = null

/**
 * linter
 *
 * @param {String|Buffer} input JavaScript string
 * @param {Object} config eslint configuration
 * @param {Object} webpack webpack instance
 * @return {void}
 */
function lint(input, config, webpack) {
  var resourcePath = webpack.resourcePath
  var cwd = process.cwd()

  // remove cwd from resource path in case webpack has been started from project
  // root, to allow having relative paths in .eslintignore
  if (resourcePath.indexOf(cwd) === 0) {
    resourcePath = resourcePath.substr(cwd.length + 1)
  }

  var res
  // If cache is enable and the data are the same as in the cache, just
  // use them
  if (config.cache) {
    var inputMD5 = crypto.createHash("md5").update(input).digest("hex")
    if (cache[resourcePath] && cache[resourcePath].hash === inputMD5) {
      res = cache[resourcePath].res
    }
  }

  // Re-lint the text if the cache off or miss
  if (!res) {
    var configHash = objectHash(config)
    res = engines[configHash].executeOnText(input, resourcePath, true)

    // Save new results in the cache
    if (config.cache) {
      cache[resourcePath] = {
        hash: inputMD5,
        res: res,
      }
      fs.writeFileSync(cachePath, JSON.stringify(cache))
    }
  }

  // executeOnText ensure we will have res.results[0] only

  // skip ignored file warning
  if (!(
    res.warningCount === 1 &&
    res.results[0].messages[0] &&
    res.results[0].messages[0].message &&
    res.results[0].messages[0].message.indexOf("ignore") > 1
  )) {
    // quiet filter done now
    // eslint allow rules to be specified in the input between comments
    // so we can found warnings defined in the input itself
    if (res.warningCount && config.quiet) {
      res.warningCount = 0
      res.results[0].warningCount = 0
      res.results[0].messages = res.results[0].messages
        .filter(function(message) {
          return message.severity !== 1
        })
    }

    // if enabled, use eslint auto-fixing where possible
    if (config.fix && res.results[0].output) {
      eslint.CLIEngine.outputFixes(res)
    }

    if (res.errorCount || res.warningCount) {
      // add filename for each results so formatter can have relevant filename
      res.results.forEach(function(r) {
        r.filePath = webpack.resourcePath
      })
      var messages = config.formatter(res.results)

      if (config.outputReport) {
        var reportOutput
        // if a different formatter is passed in as an option use that
        if (config.outputReport.formatter) {
          reportOutput = config.outputReport.formatter(res.results)
        }
        else {
          reportOutput = messages
        }
        webpack.emitFile(config.outputReport.filePath, reportOutput)
      }

      // default behavior: emit error only if we have errors
      var emitter = res.errorCount ? webpack.emitError : webpack.emitWarning

      // force emitError or emitWarning if user want this
      if (config.emitError) {
        emitter = webpack.emitError
      }
      else if (config.emitWarning) {
        emitter = webpack.emitWarning
      }

      if (emitter) {
        emitter(messages)
        if (config.failOnError && res.errorCount) {
          throw new Error("Module failed because of a eslint error.\n"
            + messages)
        }
        else if (config.failOnWarning && res.warningCount) {
          throw new Error("Module failed because of a eslint warning.\n"
            + messages)
        }
      }
      else {
        throw new Error(
          "Your module system doesn't support emitWarning. " +
          "Update available? \n" +
          messages
        )
      }
    }
  }
}

/**
 * webpack loader
 *
 * @param  {String|Buffer} input JavaScript string
 * @param {Object} map input source map
 * @return {void}
 */
module.exports = function(input, map) {
  var config = assign(
    // loader defaults
    {
      formatter: require("eslint/lib/formatters/stylish"),
    },
    // user defaults
    this.options.eslint || {},
    // loader query string
    loaderUtils.parseQuery(this.query)
  )
  this.cacheable()

  // Create the engine only once per config
  var configHash = objectHash(config)
  if (!engines[configHash]) {
    engines[configHash] = new eslint.CLIEngine(config)
  }

  // Read the cached information only once and if enable
  if (cache === null) {
    if (config.cache) {
      var thunk = findCacheDir({
        name: "eslint-loader",
        thunk: true,
        create: true,
      })
      cachePath = thunk("data.json")
      try {
        cache = require(cachePath)
      }
      catch (e) {
        cache = {}
      }
    }
    else {
      cache = false
    }
  }

  lint(input, config, this)
  this.callback(null, input, map)
}
