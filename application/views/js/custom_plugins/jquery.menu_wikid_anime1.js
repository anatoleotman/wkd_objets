//menu wikid animé applicable sur les ul listes imbriquées, menu et sous menu
//ceci est fortement attaché (tightly coupled) avec le modèle de menu, voir dans code igniter

(function ($) {
	'use strict';
	var Menu_wikid_anime = {
		init: function (options, elem) {
			'use strict';
			// Mix in the passed in options with the default options
			this.options = $.extend({}, this.options, options);
			// Save the element reference, both as a jQuery
			// reference and a normal reference
			this.elem = elem;
			this.$elem = $(elem);
			this.approach_plugin_init();
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
	
		approach_plugin_init: function approach_plugin_init() {
		
			$('.submenu_item > a', this.$elem).approach({
			    "fontSize": "22px",
			    "color": "#CC3300"
			    //"backgroundColor": "rgb(0, 0, 0)"
			}, 25);
			return this;
		},

		submenu_close_first: function (options) {
			'use strict';
			//console.info('submenuclose');
			var defaults = {
				'callback': null
			};
			var parametres = $.extend(defaults, options);
			var $submenu = this.$elem.find('.submenu_open'); //find accepte un objet jquery en entrée et renvoie un objet jquery
			if ($submenu.length) {
				$submenu.submenu_close().queue(function () {
					$(this).removeClass('submenu_open').addClass('submenu');
					$(this).dequeue();
				}).queue(function () {
					if (parametres.callback) {
						parametres.callback();
					}
					$(this).dequeue();
				});

			} else {
				if (parametres.callback) {
					parametres.callback();
				}
			}
			return this;
		},

		submenu_open: function ($submenu) {
			'use strict';
			var display_onebyone = function (array) {
				$(array).each(function (idx) {
					$(this)
						.delay((idx+1) * 300)
						.show("fast", function () {
							$(this).css('display', 'block');
					});
				});
			};

			$submenu
				.removeClass('submenu')
				.addClass('submenu_open')
				.show("slide", { direction: 'down'}, "slow", function () {
					var $submenu_items = $(this).find('.submenu_item');
					display_onebyone($submenu_items);
				});
			return this;
		},

		bind_click_on_categories: function () {
			'use strict';
			var that = this; // on veut récupérer l'object menu wikid'
			//var $elem = this.$elem;
			this.$elem.find('.categorie > a[href*="/show/"]').on('click', function () { 
				//console.info('lien clicked');//.categorie :: la classe a eventify en options?!
				if ($(this).next('ul').attr('class') === 'submenu_open') {
					// on ne fait rien, mais il ne faut pas returner false, ça désactive les événements du lien
				}
				var that_clicked = this;
				that.submenu_close_first({'callback': function () {
					that.submenu_open($(that_clicked).next('.submenu'));
				}}); //tester ainsi, sinon ds le callback de submenu_close_first!?
			});
			return this;
		} 
	//fin de l'object literal'
	};

	$.fn.menu_wikid_anime = function (options) {
		if (this.length) {
			return this.each(function () {
				//Code de notre plug-in ici
				// Create a new menu object via the Prototypal Object.create
				var menu_wikid = Object.create(Menu_wikid_anime);
				// Run the initialization function of the speaker
				menu_wikid.init(options, this); // `this` refers to the element	 
				// Save the instance of the menu object in the element's data store
				$.data(this, 'menu_wikid_anime', menu_wikid);
			});
		}
	};
}(jQuery));


(function ($) {
	'use strict';
	$.fn.submenu_close = function () {
		console.info('fnsubmenuclose');
		if (this.length) {
			var hide_onebyone = function (array) {
				$(array).each(function (idx) {
					$(this).delay(idx * 180).hide("slide", "fast");
				});
			};
			return this.each(function () {
				hide_onebyone($(this).find('.submenu_item'));
			});
		}
	};
}(jQuery));
