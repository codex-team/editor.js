/**
 * Codex Editor Util
 */
module.exports = class Util {

    /**
     * Fires a promise sequence asyncronically
     *
     * @param chain
     * @param success
     * @param fallback
     * @return {Promise}
     */
    static sequence(chain, success, fallback) {

        return new Promise(function (resolve, reject) {

            if (chain.length === 0) {

                resolve();

            } else {

                /**
                 * pluck each element from queue
                 * First, send resolved Promise as previous value
                 * Each plugins "prepare" method returns a Promise, that's why
                 * reduce current element will not be able to continue while can't get
                 * a resolved Promise
                 */
                chain.reduce(function (previousBlock, currentBlock, iteration) {

                    return previousBlock
                        .then(() => waitNextBlock(currentBlock, success, fallback))
                        .then(() => {

                            // finished
                            if (iteration == chain.length - 1) {

                                resolve();

                            }

                        });

                }, Promise.resolve());

            }

        });

        /**
         * Decorator
         *
         * @param {Function} block
         * @param {Function} success
         * @param {Function} fallback
         *
         * @return {Promise}
         */
        function waitNextBlock(block, success, fallback) {

            return new Promise(function (resolve, reject) {

                block()
                    .then(() => {

                        success.call(null, block);

                    })
                    .then(resolve)
                    .catch(function (error) {

                        fallback(error);

                        // anyway, go ahead even plugin is not available
                        resolve();

                    });

            });

        }

    }

};