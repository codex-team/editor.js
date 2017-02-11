/**
 * Storage plugin
 *
 * Saves editor data to browser local storage.
 * And uploads data from local storage if there is newer version
 */
var storage = function () {

    var editor               = codex.editor,
        CURRENT_ARTICLE_HASH = null,
        LOCAL_STORAGE_KEY    = null,
        interval             = null,
        config_ = {
            savingInterval: 1000
        };

    /**
    * Checks support for localStorage and sessionStorage
    * @return {bool}
    */
    function storageSupported_ () {
        return typeof(Storage) !== "undefined";
    }

    /**
    * Calls on editor initialize
    * @param {object} config passed form user in codex.editor.start
    */
    var prepare = function (config) {

        if (!storageSupported_()) {

            editor.core.log('LocalStorage does not supported by your browser');
            return;

        }

        CURRENT_ARTICLE_HASH = editor.currentHash;
        LOCAL_STORAGE_KEY    = 'codex.editor.savedData.'+CURRENT_ARTICLE_HASH;

        config_ = config || config_;

        var localData = get();

        if (localData && editor.state.blocks.savingDate < localData.savingDate) {

            editor.notifications.notification({
                type        : 'confirm',
                message     : 'В вашем браузере сохранена более актаульная версия материала',
                okMsg       : 'Показать',
                cancelMsg   : 'Отмена',
                confirm     : function () {

                    editor.state.blocks = localData;
                    editor.renderer.rerender();
                    init(config_.savingInterval);

                },
                cancel      : function () {

                    init(config_.savingInterval);

                }

            });

        } else {

            init(config_.savingInterval);

        }

        return Promise.resolve();

    };

    var init = function (savingInterval) {

        interval = window.setInterval(save, savingInterval);

    };

    var save = function () {

        editor.saver.saveBlocks();

        /* Using setTimeout, cause we don't know when blocks are saved  */
        window.setTimeout(function () {

            var savedBlocks = editor.state.jsonOutput,
                savingDate   = editor.state.savingDate,
                data = {
                    items: savedBlocks,
                    savingDate : savingDate
                };

            window.localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(data);

        }, 500);

    };

    var get = function () {

        var savedData = window.localStorage[LOCAL_STORAGE_KEY],
            data;

        if (!savedData)
            return;


        try {

            data = JSON.parse(savedData);

        } catch (error) {

            editor.core.log('Invalid data format');
            return;

        }

        return data;

    };

    var stop = function () {

        window.clearInterval(interval);

    };

    return {
        prepare: prepare,
        init   : init,
        save   : save,
        get    : get,
        stop   : stop,
        config : config_
    };

}();