/**
 * Storage plugin
 *
 * Saves editor data to browser local storage.
 * And uploads data from local storage if there is newer version
 */
var storage = function () {

    var editor  = codex.editor,
        interval   = null,
        config_ = {
            saveInterval: 1000
        };

    var prepare = function (config) {

        if (!window.localStorage) {

            editor.notifications.notification({message:'LocalStorage не поддерживается в вашем браузере', type:'warn'});
            return;

        }

        config_ = config || config_;

        if (get() && editor.state.blocks.savingDate < get().savingDate) {

            editor.notifications.notification({
                type        : 'confirm',
                message     : 'В вашем браузере сохранена более актаульная версия материала',
                okMsg       : 'Показать',
                cancelMsg   : 'Отмена',
                confirm     : function () {

                    editor.state.blocks = get();
                    editor.renderer.rerender();
                    init(config_.saveInterval);

                },
                cancel      : function () {

                    init(config_.saveInterval);

                }

            });

        }

        return Promise.resolve();

    };

    var init = function (saveInterval) {

        interval = window.setInterval(save, saveInterval);

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

            window.localStorage['codex.editor.savedData'] = JSON.stringify(data);

        }, 500);

    };

    var get = function () {

        if (!window.localStorage['codex.editor.savedData'])
            return;

        var data = JSON.parse(window.localStorage['codex.editor.savedData']);

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