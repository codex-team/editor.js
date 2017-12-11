/**
 * Codex Editor Util
 */
export default class Util {

    /**
     * @typedef {Object} ChainData
     * @property {Object} data - data that will be passed to the success or fallback
     * @property {Function} function - function's that must be called asynchronically
     */

    /**
     * Fires a promise sequence asyncronically
     *
     * @param {Object[]} chains - list or ChainData's
     * @param {Function} success - success callback
     * @param {Function} fallback - callback that fires in case of errors
     *
     * @return {Promise}
     */
    static sequence(chains, success = () => {}, fallback = () => {}) {

        return new Promise(function (resolve) {

            /**
             * pluck each element from queue
             * First, send resolved Promise as previous value
             * Each plugins "prepare" method returns a Promise, that's why
             * reduce current element will not be able to continue while can't get
             * a resolved Promise
             */
            chains.reduce(function (previousValue, currentValue, iteration) {

                return previousValue
                    .then(() => waitNextBlock(currentValue, success, fallback))
                    .then(() => {

                        // finished
                        if (iteration === chains.length - 1) {

                            resolve();

                        }

                    });

            }, Promise.resolve());

        });

        /**
         * Decorator
         *
         * @param {ChainData} chainData
         *
         * @param {Function} successCallback
         * @param {Function} fallbackCallback
         *
         * @return {Promise}
         */
        function waitNextBlock(chainData, successCallback, fallbackCallback) {

            return new Promise(function (resolve) {

                chainData.function()
                    .then(() => {

                        successCallback(chainData.data);

                    })
                    .then(resolve)
                    .catch(function () {

                        fallbackCallback(chainData.data);

                        // anyway, go ahead even it falls
                        resolve();

                    });

            });

        }

    }

    /**
     * Make array from array-like collection
     *
     * @param {*} collection
     *
     * @return {Array}
     */
    static array(collection) {

        return Array.prototype.slice.call(collection);

    }

};