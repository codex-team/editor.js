/**
* Module working with plugins
*/
module.exports = (function () {

    let editor = codex.editor;

    /**
     * Initialize plugins before using
     * Ex. Load scripts or call some internal methods
     * @return Promise
     */
    function prepare() {

        return new Promise(function (resolve_, reject_) {

            Promise.resolve()

                /**
                * Compose a sequence of plugins that requires preparation
                */
                .then(function () {

                    let pluginsRequiresPreparation = [],
                        allPlugins = editor.tools;

                    for ( let pluginName in allPlugins ) {

                        let plugin = allPlugins[pluginName];

                        if (plugin.prepare && typeof plugin.prepare != 'function' || !plugin.prepare) {

                            continue;

                        }

                        pluginsRequiresPreparation.push(plugin);

                    }

                    /**
                    * If no one passed plugins requires preparation, finish prepare() and go ahead
                    */
                    if (!pluginsRequiresPreparation.length) {

                        resolve_();

                    }

                    return pluginsRequiresPreparation;

                })

                /** Wait plugins while they prepares */
                .then(waitAllPluginsPreparation_)

                .then(function () {

                    editor.core.log('Plugins loaded', 'info');
                    resolve_();

                }).catch(function (error) {

                    reject_(error);

                });

        });

    }

    /**
    * @param {array} plugins - list of tools that requires preparation
    * @return {Promise} resolved while all plugins will be ready or failed
    */
    function waitAllPluginsPreparation_(plugins) {

        /**
        * @calls allPluginsProcessed__ when all plugins prepared or failed
        */
        return new Promise (function (allPluginsProcessed__) {

            /**
             * pluck each element from queue
             * First, send resolved Promise as previous value
             * Each plugins "prepare" method returns a Promise, that's why
             * reduce current element will not be able to continue while can't get
             * a resolved Promise
             *
             * If last plugin is "prepared" then go to the next stage of initialization
             */
            plugins.reduce(function (previousValue, plugin, iteration) {

                return previousValue.then(function () {

                    /**
                    * Wait till plugins prepared
                    * @calls pluginIsReady__ when plugin is ready or failed
                    */
                    return new Promise ( function (pluginIsReady__) {

                        callPluginsPrepareMethod_( plugin )

                            .then( pluginIsReady__ )
                            .then( function () {

                                plugin.available = true;

                            })

                            .catch(function (error) {

                                editor.core.log(`Plugin «${plugin.type}» was not loaded. Preparation failed because %o`, 'warn', error);
                                plugin.available = false;
                                plugin.loadingMessage = error;

                                /** Go ahead even some plugin has problems */
                                pluginIsReady__();

                            })

                            .then(function () {

                                /** If last plugin has problems then just ignore and continue */
                                if (iteration == plugins.length - 1) {

                                    allPluginsProcessed__();

                                }

                            });

                    });

                });

            }, Promise.resolve() );

        });

    }

    var callPluginsPrepareMethod_ = function (plugin) {

        return plugin.prepare( plugin.config || {} );

    };

    return {
        prepare: prepare
    };

}());