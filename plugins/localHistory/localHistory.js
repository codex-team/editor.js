/**
 * Storage plugin
 *
 * Saves editor data to browser local storage.
 * And uploads data from local storage if there is newer version
 */
var localHistoryPlugin = function () {

    var editor               = codex.editor,
        CURRENT_ARTICLE_HASH = null,
        CURRENT_STORAGE_KEY  = null,
        STORAGE_KEY          = 'codex.editor.savedData.',
        STORAGE_KEYS         = 'codex.editor.savedKeys',
        STORAGE_TIME         = null,
        interval             = null,
        config_ = {
            savingInterval: 5000, // ms
            retainDays: 4 // days
        };

    /**
    * Checks support for localStorage and sessionStorage
    * @return {bool}
    */
    function storageSupported_ () {
        return typeof(Storage) !== "undefined";
    }

    /**
    * Formats date object
    * @param {number} timestamp
    */
    function formatDate_ ( timestamp ) {

        var date  = new Date(timestamp),
            hours = date.getHours(),
            mins  = date.getMinutes(),
            secs  = date.getSeconds(),
            now   = new Date();

        hours = hours < 10 ? '0' + hours : hours;
        mins  = mins  < 10 ? '0' + mins  : mins;
        secs  = secs  < 10 ? '0' + secs  : secs;

        var localeMonth = function ( month ) {

            if ( isNaN(month) ) return false;

            var lang = navigator.language == 'ru' ? 0 : 1,
                map  = {
                    ru : ['Янв','Фев','Мар','Апр','Мая','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
                    en : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                };

            return lang ? map.en[month] : map.ru[month];

        };

        return date.getDate() + ' ' + localeMonth(date.getMonth()) + ' ' + date.getFullYear() + ' ' + hours + ':' + mins + ':' + secs;
    }

    /**
    * Calls on editor initialize
    * @param {object} config                    - settings passed form user in codex.editor.start
    * @param {Number} config.retainDays         - how many days should retain local versions
    * @param {Number} config.savingInterval     - interval for saving
    */
    var prepare = function (config) {

        if (!storageSupported_()) {

            editor.core.log('LocalStorage does not supported by your browser');
            return;

        }

        CURRENT_ARTICLE_HASH = editor.currentHash;
        CURRENT_STORAGE_KEY  = STORAGE_KEY + CURRENT_ARTICLE_HASH;

        if ( config.savingInterval ) config_.savingInterval = config.savingInterval;
        if ( config.retainDays ) config_.retainDays = config.retainDays;

        STORAGE_TIME = config_.retainDays * 24 * 60 * 60 * 1000;

        clearKeys();

        var localData = get(),
            message,
            timeStyle = 'margin-top: 0.6em; color: #6e758a;';

        if (localData && editor.state.blocks.savingDate < localData.savingDate) {

            message = 'В вашем браузере сохранена более актуальная версия материала, чем на сервере' +
                      '<div style="' + timeStyle + '">Текущая версия: ' + formatDate_(editor.state.blocks.savingDate) + '</div>' +
                      '<div style="' + timeStyle + '">Сохраненная версия: ' + formatDate_(localData.savingDate) + '</div>';

            editor.notifications.notification({
                type        : 'confirm',
                message     : message,
                okMsg       : 'Переключиться',
                cancelMsg   : 'Отмена',
                confirm     : function () {

                    editor.state.blocks = localData;
                    editor.renderer.rerender(true);
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

    /**
     * Saves current editor's data to localStorage with unique article key
     * Also saves key and expire date
     */
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

            localStorage[CURRENT_STORAGE_KEY] = JSON.stringify(data);

            saveKey(savingDate);

        }, 500);

    };

    /**
     * Returns last saved data of current article
     */
    var get = function () {

        var savedData = window.localStorage[CURRENT_STORAGE_KEY],
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

    /**
     * Returns object of articles hash and expire date {articleHash: expireDate}
     */
    var getKeys = function () {

        var savedKeys = localStorage[STORAGE_KEYS],
            keys      = {};

        if (!savedKeys) {

            return keys;

        }

        try {

            keys = JSON.parse(savedKeys);

        } catch (error) {

            editor.core.log('Invalid data format');

        }

        return keys;

    };

    /**
     * Saves current article's hash with article's expire date
     * @param savingDate
     */
    var saveKey = function (savingDate) {

        var keys = getKeys();

        keys[CURRENT_ARTICLE_HASH] = savingDate + STORAGE_TIME;

        localStorage[STORAGE_KEYS] = JSON.stringify(keys);

    };

    /**
     * Remove articles which storage time has expired
     */
    var clearKeys = function () {

        var keys = getKeys();

        for (var key in keys) {

            if (keys[key] > +new Date()) {
                continue;
            }

            localStorage.removeItem(STORAGE_KEY+key);
            delete keys[key];

        }

        localStorage[STORAGE_KEYS] = JSON.stringify(keys);

    };

    var destroy = function () {

        stop();
        localHistoryPlugin = null;

    };

    return {
        prepare: prepare,
        init   : init,
        save   : save,
        get    : get,
        stop   : stop,
        destroy: destroy,
        config : config_
    };

}();