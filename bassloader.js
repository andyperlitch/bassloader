var Router = require('backbone').Router;
var BassView = require('bassview');
var BassLoader = BassView.extend({
    
    initialize: function() {
        
        // Create a router
        this.router = new Router();
        
    },
    
    page: function(id, page) {
        
        
        
    }
    
});
exports = module.exports = BassLoader;