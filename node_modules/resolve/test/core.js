var test = require('tape');
var resolve = require('../');

test('core modules', function (t) {
    t.test('isCore()', function (st) {
        st.ok(resolve.isCore('fs'));
        st.ok(resolve.isCore('net'));
        st.ok(resolve.isCore('http'));

        st.ok(!resolve.isCore('seq'));
        st.ok(!resolve.isCore('../'));
        st.end();
    });

    t.test('core list', function (st) {
        st.plan(resolve.core.length);

        for (var i = 0; i < resolve.core.length; ++i) {
            st.doesNotThrow(
                function () { require(resolve.core[i]); },
                'requiring ' + resolve.core[i] + ' does not throw'
            );
        }

        st.end();
    });

    t.end();
});
