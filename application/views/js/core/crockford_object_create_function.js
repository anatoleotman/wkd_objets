// Make sure Object.create is available in the browser (for our prototypal inheritance)
// Courtesy of Papa Crockford
// Note this is not entirely equal to native Object.create, but compatible with our use-case

	if (typeof Object.create !== 'function') {
	    Object.create = function (o) {
		function F() {} // optionally move this outside the declaration and into a closure if you need more speed.
		F.prototype = o;
		return new F();
	    };
	}
