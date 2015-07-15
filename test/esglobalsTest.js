var expect = require('chai').expect;
var esglobals = require('../');

describe('esglobals(code)', function() {

  it('finds global variables', function() {

    function example() {
    	var x = 1;
      y.doSomethingWith(function() {
        var k = 7;
      	return z.concat(arguments);
      });
      try {
        var u = false;
        y.not(function(j) {
          x(), p();
          return j() || u({ w: function() { q.t(); } });
        });
      }
      catch (e) {
        k.ohNo(x(m));
        try {
          d.dee();
        }
        catch (e) {
          f();
        }
      }
      finally {
        var d = r();
        var f;
      }
      return function(fn) {
        try { fn() }
        catch (e) { return z + u + e.toString(); }
        return h('.pass');
      }
    }

    var globals = esglobals(example.toString());
    expect(globals).to.eql(['y', 'z', 'p', 'q', 'k', 'm', 'd', 'f', 'r', 'h']);
  });

});
