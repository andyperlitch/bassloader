# Bassloader

Pronounced "Base Loader."

Loads "pages" that get loaded and unloaded based on route changes. 
This is actually just a backbone view whose element should be set 
to the content area that pages should be set to.


[![build status](https://secure.travis-ci.org/andyperlitch/bassloader.png)](http://travis-ci.org/andyperlitch/bassloader)

## Methods

### page

#### Usage 1 - loader.page( String `page_key`, Object `page_object` )

Registers a page. When any of the routes listed in the `routes` array of the `page_object` are triggered, this page will be loaded. See the Page Object section below for more details.

Example:
	
	// Create the loader
	var loader = new Bassloader({
		el: document.getElementById("content")
	});
	
	// Define a page
	var HomeView = Backbone.View.extend({});
	var page = {
		"routes": ["","/","home"],
		"view": HomeView
	};
	
	// Register the page
	loader.page("home", page);
	
#### Usage 2 - loader.page( Object `pages` )

Registers multiple pages at a time. Same as above, but using a map, allowing for more than one page to be registered at once:

	// Create the loader
	var loader = new Bassloader({ el: document.getElementById("content")});

	// Define the pages
	var pages = {
		
		"home": {
			"routes": ["","/","home"],
			"view": HomeView
		},
		
		"contact": {
			"routes": ["contact","contact/:method"],
			"view": ContactView
		}
		
	};
	
	// Register the pages
	loader.page(pages);
	
#### Usage 3 : loader.page( String `page_key` )

Retrieves the page object with the `page_key` identifier.


## Page Object

### Structure

	{
		"routes": ["/route1/:param1", "/alternate_route/:param1"],
		"view": Backbone.View,
		"paramList": ["p1"]
	}