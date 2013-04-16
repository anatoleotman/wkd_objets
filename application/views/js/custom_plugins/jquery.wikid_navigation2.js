(function ($) {
	var Wikid_Navigation_Prototype = {
	
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);
			this.$elem_contenu_wikid = $('.contenu_wikid', this.$elem);
			this.$elem_hidden_page_name = $('input[name="page_name"]', $(elem));
			this.$elem_wrapper = this.$elem.parent('#wrapper');
			this.$elem.toggleClass('wikid_ajax_navigation');
			this._init_page_nom();
			this._init_hashchange_plugin();
			this._make_document_links_ajax();
			this.display_url_base_hash();
			return this;
		},
		
		options: {
			on_display_ajax_callback: function () {}
		},
		/*
		root_element_show: function () { // à appeler au dernier moment quand tout est prêt
			$('html').removeClass('js');
			return this;
		},
		*/
		_init_page_nom: function (nom) { // très important cf display_ajax fonction
			
			this.starting_page_nom = this.$elem_hidden_page_name.val();
			this.$elem_contenu_wikid.data('page_nom', this.starting_page_nom);
			
			return this;
		},
		
		_init_hashchange_plugin: function () {
			var that = this;
			$(window).hashchange( function () { 
				var hash = location.hash;
				var nom_page = ( hash.replace( /^#/, '' ) || that.starting_page_nom);
				//var nom_page = hash.replace( /^#/, '' );
				that._display_ajax(nom_page);
			});
		},
		
		display_url_base_hash: function () { // que j'appelle depuis le handler document.ready()
			var hash = window.location.hash;
			if (hash != '') { // si hash vide ne fait rien
				var nom_page = hash.replace( /^#/, '' );
				this._display_ajax(nom_page);
			}
			
			return this; // chainable
		},
		
		_make_document_links_ajax: function () { //pour les liens du menu
			var that = this;
			var lastslash = function (t) { 
				return t.replace(/^.+\/([^\/]*)$/,'$1');
			};
			$(document).on('click', 'a[href*="wkd/show/"]', function (event) {
	    			event.preventDefault(); // Ajax here
	    			var nom = lastslash($(this).attr('href'));
	    			
	    			//changement de hash va appeler display_ajax()
				//that.display_ajax("page", nom);
				window.location.hash = nom; 
	   			return false; //for good measure
			});	
		},
		
		_display_ajax: function (nom_page) { //nom de la page à afficher (appel de model_getpage())
			var that = this;
			$.ajax({
				url : WIKIDGLOBALS.BASE_DIRECTORY + "index.php/pages/display_ajax/" + nom_page,
				type : "GET",
				data : null,
				dataType : "json",
				context: this,
				beforeSend: function () {
						this.$elem_wrapper.spin({
							  lines: 11, // The number of lines to draw
							  length: 5, // The length of each line
							  width: 4, // The line thickness
							  radius: 11, // The radius of the inner circle
							  rotate: 37, // The rotation offset
							  color: '#000', // #rgb or #rrggbb
							  speed: 0.5, // Rounds per second
							  trail: 10, // Afterglow percentage
							  shadow: false, // Whether to render a shadow
							  hwaccel: true, // Whether to use hardware acceleration
							  className: 'spinner', // The CSS class to assign to the spinner
							  zIndex: 2e9, // The z-index (defaults to 2000000000)
							  top: 10, // Top position relative to parent in px
							  left: 10 // Left position relative to parent in px
						});
					},
				error: function () {
					alert('Erreur durant le chargement !');
				},
				success: function (ans) {
					this.$elem_contenu_wikid.hide("slide", { direction: 'down'}, "easeOutQuint", function() {
				  	 	$(this).empty();
						$(this).html(ans.page_contenu);
						$(this).data('page_nom', ans.page_nom); // c'est la clé pour le plugin mode edit
						$(this).next('input[name="page_name"]').val(ans.page_nom); // à titre indicatif mais j'aime moins cette méthode' mais pratique à utiliser à partir des autres widgets
						//that._images_display_each_element(this); // affiche la page et ses images une par une
						$(this).show("slide", {}, "easeOutQuint");
					});		
				},
				complete: function () {
					this.$elem_wrapper.spin(false);
				}		
			});
		},
		
		_images_display_each_element: function (elem) { // afficher images une par une
			if ($('img', elem).length > 3) {
				$('img', elem).hide();
				$(elem).show("slide", {}, 10, function () {
					$('img', elem).each(function (index) {
					$(this)
						.delay((index) * 60)
						.show("fade", {}, 'fast');
					});
				});
			} else {
				$(elem).show("slide", {}, "easeOutQuint");
			}
		}
		/*select_elem_make_ajax_links: function (elem) { // on pourrait l'utiliser dans le cas de plusieurs zones navigables
			var that = this;
			var lastslash = function (t) { 
				return t.replace(/^.+\/([^\/]*)$/,'$1');
			};
			$(elem).on('click', 'a[href*="wkd/show/"]', function (event) {
	    			event.preventDefault();
	    			var nom = lastslash($(this).attr('href'));
				//that.display_ajax("page", nom);
				// changement de hash va appeler display_ajax()
				window.location.hash = nom;
				that.effect_random_highlight($('#cadre_back'));
	   			return false;
			});	
		}*/
	};

	$.fn.wikid_navigation = function (options) {
		if (this.length) {
			return this.each(function () {
				var wikid_navigation = Object.create(Wikid_Navigation_Prototype);
				wikid_navigation.init(options, this);
				$(this).data('wikid_navigation', wikid_navigation);		
			});
		}
	}; 
}(jQuery));
