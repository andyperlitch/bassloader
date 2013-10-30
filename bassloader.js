var _ = require('underscore');
var Backbone = require('backbone');
var BassView = require('bassview');
var BassLoader = BassView.extend({
    
    initialize: function(options) {
        
        // Ensure an options object
        options = options || {};
        
        // Set up injections
        this.setInjections(options.inject || {});
        
        // Create a router
        this.router = new Backbone.Router();
        
        // Check for specified inner css class
        this.contentClass = options.contentClass || 'bassloader-content';
        this.contentEl = options.contentEl || 'div';
        
        // Listen to the router for changes
        this.listenTo(this.router, 'route', this.onRoute);
    },
    
    setInjections: function(inject) {
        
        // Set up injection object
        this.injections = _.extend({}, inject);
    },
    
    page: function(id, page) {
        
        // Create pages hash if not already there
        this.pages = this.pages || {};
        
        // Setup pages to add
        var pages;
        
        // Check for two arguments
        if (page) {
            pages = {};
            pages[id] = page;
        }
        // Check for single arg
        else if (typeof id === 'object') {
            pages = id;
        }
        // Check for get function
        else if (typeof id === 'string') {
            return this.pages[id];
        }
        
        // Create route for each item in a page's 'routes' array
        _.each(pages, function(page, name) {
            _.each(page.routes, function(fragment) {
                this.router.route(fragment, name);
            }, this);
        }, this);
        
        // Extend the pages
        _.extend(this.pages, pages);
    },
    
    onRoute: function(route, params) {
        
        // Check if this route even applies
        if (!this.pages.hasOwnProperty(route)) {
            return;
        }
        
        // Check if there is a current page set
        if (this.current) {
            
            // Do nothing if it is the same page
            if (route === this.current) {
                return;
            }
            
            // Different page
            this.trigger('clean_up');
        }
        
        // Get the page object
        var page = this.pages[route];
        
        // Build the injection object
        var injections = {};
        _.each(this.injections, function(val,key) {
            injections[key] = _.result(this.injections, key);
        }, this);
        
        // Set the "current" subview to an instance of the view
        this.subview( 'current' , new page.view(injections), this.contentEl + '.' + this.contentClass );
        
        // Set the new current page
        this.current = route;
        
        this.render();
    },
    
    render: function() {

        // Base markup for the loaded view
        var html = '<' + this.contentEl + ' class="' + this.contentClass + '"></' + this.contentEl + '>';
        
        // Sets the html of the loader
        this.$el.html(html);
        
        // Assigns pre-assigned "current" view
        this.assign();
        
        // Chainable
        return this;
    }
    
});
exports = module.exports = BassLoader;