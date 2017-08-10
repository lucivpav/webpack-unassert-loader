'use strict';

var assert = require('power-assert');
var unassert = require('../index');

describe('webpack-unassert-loader', function() {
  it('should return source removed assertions', function() {
    var source = '/** comment */\nfunction add(a, b) {\n    assert(!isNaN(a));\n    return a + b;\n}';

    // set context for webpack loader
    var context = {};
    context.callback = function(err, result, map) {
      var expected = '/** comment */\nfunction add(a, b) {\n    return a + b;\n}';
      assert.equal(result, expected, 'remove assertions from the source');
    };

    unassert.call(context, source, null);
  });

  it('custom options', function () {
    var source = 'var invariant = require("invariant");\n\nfunction add(a, b) {\n    invariant(!isNaN(a));\n    return a + b;\n}';

    // set context for webpack loader
    var context = {};
    context.options = {
        assertionPatterns: [
            'invariant(value, [message])'
        ],
        requirePatterns: [
            'invariant = require("invariant")'
        ]
    };
    context.callback = function(err, result, map) {
      var expected = 'function add(a, b) {\n    return a + b;\n}';
      assert.equal(result, expected, 'remove invariants from the source');
    };

    unassert.call(context, source, null);
  });
});
