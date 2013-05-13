var assert = require('assert');
var helpers = require('./helpers');
var redblack = require('../redblack.js');

function mkVal(x) {
    return {value: x};
}

function cmpVal(left, right) {
    return left.value - right.value;
}

describe('Tree', function() {
    var n = 10000;
    var tree;
    
    beforeEach(function() {
        tree = redblack.tree();
        helpers.loop(n, function(i) {
            tree.insert(i, i);
        });

	tree2 = redblack.tree(cmpVal);
	helpers.loop(n, function(i) {
	    tree2.insert(mkVal(i), i);
	});
    });
    
    it('maps key/value pairs', function() {;
        helpers.loop(n, function(i) {
            assert.equal(tree.get(i), i);
        });

	helpers.loop(n, function(i) {
	    assert.equal(tree2.get(mkVal(i)), i);
	});
    });
    
    it('deletes key/value pairs', function() {
        var deleted = helpers.deleteRandom(n, tree);
        
        helpers.loop(n, function(i) {
            assert.equal(tree.get(i), deleted[i] ? null : i);
        });

	deleted = helpers.deleteRandom(n, tree2, mkVal);

	helpers.loop(n, function(i) {
	    assert.equal(tree2.get(mkVal(i)), deleted[i] ? null : i);
	});
    });
    
    it('remains balanced', function() {
        helpers.assertBalanced(tree);
        helpers.deleteRandom(n, tree);
        helpers.assertBalanced(tree);

	helpers.assertBalanced(tree2);
	helpers.deleteRandom(n, tree2, mkVal);
	helpers.assertBalanced(tree2);
    });
    
    it('traverses nodes in order', function() {
        var i = 0;
        
        tree.forEach(function(value, key) {
            assert.equal(key, i++);
        });
        
        assert.equal(i, n);

	i = 0;

	tree2.forEach(function(value, key) {
	    assert.equal(key.value, i++);
	});

	assert.equal(i, n);
    });
    
    it('maps nodes in order', function() {
        var mapped = tree.map(function(value, key) {
            return key;
        });
        
        helpers.loop(n, function(i) {
            assert.equal(mapped[i], i);
        });

	mapped = tree2.map(function(value, key) {
	    return key.value;
	});

        helpers.loop(n, function(i) {
            assert.equal(mapped[i], i);
        });
    });
    
    it('walks node ranges in order', function() {
        // Start and end
        var i = 123;
        tree.range(123, 4567).forEach(function(value, key) {
            assert.equal(key, i++);
        });
        assert.equal(i, 4568);
        
        // Start
        i = 123;
        tree.range(123).forEach(function(value, key) {
            assert.equal(key, i++);
        });
        assert.equal(i, n);
        
        // End
        i = 0;
        tree.range(undefined, 4567).forEach(function(value, key) {
            assert.equal(key, i++);
        });
        assert.equal(i, 4568);
    });
});
