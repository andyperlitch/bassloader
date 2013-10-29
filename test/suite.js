var bassloader = require('../');
var Backbone = require('backbone');
Backbone.$ = window.$;

describe('Bassloader', function() {
    
    it('should create a router', function() {
        var ldr = new bassloader();
        expect(ldr.router).to.be.instanceof(Backbone.Router);
    });
    
});