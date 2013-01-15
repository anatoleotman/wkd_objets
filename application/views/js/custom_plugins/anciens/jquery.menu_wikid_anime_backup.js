//menu wikid animé applicable sur les ul listes imbriquées, menu et sous menu
var menu_wikid_anime0 = {
	init: function (options, elem) {
		'use strict';
		// Mix in the passed in options with the default options
		this.options = $.extend({}, this.options, options);
		// Save the element reference, both as a jQuery
		// reference and a normal reference
		this.elem = elem;
		this.$elem = $(elem);

		// return this so we can chain/use the bridge with less code.
		return this;
	},

	options: {

	},
	// àremplir
	hide_submenu_elements: function () {
		'use strict';
		this.$elem.find('ul>li>ul>li').hide();
		return this;
	},

	submenu_close_first: function (options) {
		'use strict';
		var defaults = {
			'callback': null
		};
		var parametres = $.extend(defaults, options);		
		var $submenu = this.$elem.find('.submenu_open'); //find accepte un objet jquery en entrée et renvoie un objet jquery
		if ($submenu.length) {
			$submenu
				.submenu_close()
				.queue(function () {
					$(this).removeClass('submenu_open').addClass('submenu');
					$(this).dequeue();
				})
				.queue(function () {
					if (parametres.callback) {
						parametres.callback();
					}
					$(this).dequeue();	
				});
			
		}
		else {
			if (parametres.callback) {
				parametres.callback();
			}
		}
		return this;
	},

	submenu_open: function ($submenu) {
		'use strict';
		var display_onebyone = function (array) {
				$(array[0]).show("slide", "fast", function () { // get the first element
					display_onebyone($(array).slice(1)); // slice off the first element
				});
			};
		$submenu
			.removeClass('submenu')
			.addClass('submenu_open')
			.show("slide", {}, "easeOutQuint", function () {
				var $submenu_items = $(this).find('.submenu_item');
				display_onebyone($submenu_items);
			});
		return this;
	},

	bind_click_on_categories: function () {
		'use strict';
		var that = this; // on veut récupérer l'object menu wikid'
		//var $elem = this.$elem;
		this.$elem.find('.categorie > a[href*="/show/"]').click(function () { //.categorie :: la classe a eventify en options?!
			if ($(this).next('ul').attr('class') === 'submenu_open') {
				return false;
			}
			var that_clicked = this;
			that.submenu_close_first({'callback': function () {
				that.submenu_open($(that_clicked).next('.submenu'));
			}}); //tester ainsi, sinon ds le callback de submenu_close_first!?
		});
		return this;
	} //fin de l'object literal'
};


(function ($) {
	'use strict';
	$.fn.menu_wikid_anime0 = function (options) {
		if (this.length) {
			return this.each(function () {
				//Code de notre plug-in ici
				// Create a new menu object via the Prototypal Object.create
				var menu_wikid = Object.create(menu_wikid_anime0);
				// Run the initialization function of the speaker
				menu_wikid.init(options, this); // `this` refers to the element	 
				// Save the instance of the menu object in the element's data store
				$.data(this, 'menu_wikid_anime0', menu_wikid);
			});
		}
	};
}(jQuery));


(function ($) {
	'use strict';
	$.fn.submenu_close = function () {
		if (this.length) {
			var hide_onebyone = function (array) {
					$(array).last().hide("slide", {}, "easeIn", function () {
						hide_onebyone($(array).slice(0, $(array).length - 1));
					});
				};
			return this.each(function () {
				hide_onebyone($(this).find('.submenu_item'));
			});
		}
	};
}(jQuery));
