var Backbone = require('backbone');
Backbone.$ = window.$;
var bassloader = require('../');

describe('Bassloader', function() {
    
    var ldr, sandbox;
        
    before(function() {
        Backbone.history.start();
    });
        
    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        sandbox.spy(Backbone.View.prototype, 'initialize');
        sandbox.spy(Backbone.history, 'start');
        sandbox.spy(Backbone.Router.prototype, 'route');
        ldr = new bassloader();
    });
    
    afterEach(function() {
        ldr = undefined;
        sandbox.restore();
    });
    
    it('should create a router', function() {
        expect(ldr.router).to.be.instanceof(Backbone.Router);
    });
    
    it('should create a pages property when page() is called', function() {
        var page = {
            routes: ['/'],
            view: Backbone.View
        };
        ldr.page('myPage', page)
        expect(ldr).to.have.ownProperty('pages');
    });
    
    it('should add the page to the pages hash when page() is called with two args', function() {
        var page = {
            routes: ['/'],
            view: Backbone.View
        };
        ldr.page('myPage', page)
        expect(ldr.pages['myPage']).to.equal(page);
    });
    
    it('should add multiple pages when page() is called with one arg, a map', function() {
        var view1 = Backbone.View.extend({});
        var view2 = Backbone.View.extend({});
        var pages = {
            'page1' : {
                routes: ['route1', 'altroute1'],
                view: view1
            },
            'page2' : {
                routes: ['route2', 'altroute2'],
                view: view2
            }
        }
        ldr.page(pages);
        expect(ldr.pages).to.deep.equal(pages);
    });
    
    it('should return a page object when page() is called with one arg, a string', function() {
        var view1 = Backbone.View.extend({});
        var view2 = Backbone.View.extend({});
        var pages = {
            'page1' : {
                routes: ['route1', 'altroute1'],
                view: view1
            },
            'page2' : {
                routes: ['route2', 'altroute2'],
                view: view2
            }
        }
        ldr.page(pages);
        expect(ldr.page('page1')).to.equal(pages['page1']);
    });
    
    it('should set the routes using the router\'s route method', function() {
        var view1 = Backbone.View.extend({});
        var view2 = Backbone.View.extend({});
        var pages = {
            'page1' : {
                routes: ['route1', 'altroute1'],
                view: view1
            },
            'page2' : {
                routes: ['route2', 'altroute2'],
                view: view2
            }
        }
        ldr.page(pages);
        expect(Backbone.Router.prototype.route.callCount).to.equal(4);
    });
    
    it('should render a page\'s view when one of its routes is triggered', function() {
        var init_spy = sandbox.spy();
        var render_spy = sandbox.spy();
        var remove_spy = sandbox.spy();
        var init_spy2 = sandbox.spy();
        var render_spy2 = sandbox.spy();
        var remove_spy2 = sandbox.spy();
        var view1 = Backbone.View.extend({
            initialize: function() {
                init_spy();
                return Backbone.View.prototype.initialize.call(this);
            },
            render: function() {
                render_spy();
                return Backbone.View.prototype.render.call(this);
            },
            remove: function() {
                remove_spy();
                return Backbone.View.prototype.remove.call(this);
            }
        });
        var view2 = Backbone.View.extend({
            initialize: function() {
                init_spy2();
                return Backbone.View.prototype.initialize.call(this);
            },
            render: function() {
                render_spy2();
                return Backbone.View.prototype.render.call(this);
            },
            remove: function() {
                remove_spy2();
                return Backbone.View.prototype.remove.call(this);
            }
        });
        var pages = {
            'page1' : {
                routes: ['route1', 'altroute1'],
                view: view1
            },
            'page2' : {
                routes: ['route2', 'altroute2'],
                view: view2
            }
        }
        ldr.page(pages);
        ldr.router.navigate('/route1', { trigger: true} );
        expect(init_spy).to.have.been.calledOnce;
        expect(render_spy).to.have.been.calledOnce;
        ldr.router.navigate('/route2', { trigger: true} );
        expect(remove_spy).to.have.been.calledOnce;
        expect(init_spy2).to.have.been.calledOnce;
        expect(render_spy2).to.have.been.calledOnce;
        ldr.router.navigate('/altroute1', { trigger: true} );
        expect(remove_spy2).to.have.been.calledOnce;
    });
    
    it('should allow custom class and element options', function() {
        var ldr = new bassloader({
            contentClass: 'other-class',
            contentEl: 'article'
        });
        var view1 = Backbone.View.extend({});
        var view2 = Backbone.View.extend({});
        var pages = {
            'page1' : {
                routes: ['route1', 'altroute1'],
                view: view1
            },
            'page2' : {
                routes: ['route2', 'altroute2'],
                view: view2
            }
        }
        ldr.page(pages);
        ldr.router.navigate('/route1', { trigger: true} );
        expect( ldr.subview('current').el.outerHTML ).to.equal('<article class="other-class"></article>');
    });
    
    it('should pass the inject object as options to each page, and evaluate if it is a function', function() {
        var spy = sandbox.spy();
        var thing1 = {};
        var thing2 = {};
        var injections = {
            thing1: thing1,
            thing2: function() {
                return thing2
            }
        };
        var ldr = new bassloader({
            inject: injections
        });
        var view1 = Backbone.View.extend({
            initialize: spy
        });
        var view2 = Backbone.View.extend({});
        sandbox.spy(view1.prototype.initialize);
        var pages = {
            'page1' : {
                routes: ['route1', 'altroute1'],
                view: view1
            },
            'page2' : {
                routes: ['route2', 'altroute2'],
                view: view2
            }
        }
        ldr.page(pages);
        ldr.router.navigate('route1', { trigger: true} );
        expect(spy).to.have.been.calledOnce; 
    });
    
});