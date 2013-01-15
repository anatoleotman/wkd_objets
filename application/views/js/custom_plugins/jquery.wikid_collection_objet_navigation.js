(function ($) {
	var Wikid_objets_navigation_prototype = {
	
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
				var complete_hash = ( hash.replace( /^#/, '' ) || that.starting_page_nom);
				//var nom_page = hash.replace( /^#/, '' );
				var split_hash = complete_hash.split('/');
				if (split_hash.length === 1) that._display_ajax(split_hash[0]);
				if (split_hash.length === 2) {
					if (split_hash[0] === that.$elem_contenu_wikid.data('page_nom')) {
						that._objets_display(split_hash[1]);
					}
					else {
						that._display_ajax(complete_hash);
					}
				}
			});
		},
		
		_objets_display: function (objets_titre) { // afficher une catégorie d'objets ou le titre d'un objet
			//var that = this;
			$.ajax({
				url : WIKIDGLOBALS.BASE_DIRECTORY + "index.php/collection_objets/display_objet/" + this.$elem_contenu_wikid.data('page_nom') + "/" + objets_titre,
				type : "GET",
				data : null,
				dataType : "json",
				context: this,
				beforeSend: function () {
						this.$elem_wrapper.spin({
							  lines: 11, // The number of lines to draw
							  length: 3, // The length of each line
							  width: 4, // The line thickness
							  radius: 13, // The radius of the inner circle
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
					if (ans.success === true) {
						$('#objet_' + ans.page_nom).hide("slide", { direction: 'down'}, "easeOutQuint", function() {
					  	 	$(this).empty();
					  	 	//console.info($(ans.objet_contenu_html).children());
					  	 	$(this).html($(ans.objet_contenu_html).children());
							//$(this).html(ans.objet_contenu_html);
							$(this).data('objet_nom', ans.objet_data.titre); // c'est la clé pour le plugin mode edit
							//that._images_display_each_element(this); // affiche la page et ses images une par une
							$(this).show("slide", {}, "easeOutQuint");
						});
					}
					else {
						alert('cet objet nexiste pas');
					}
				},
				complete: function () {
					this.$elem_wrapper.spin(false);
					this.ajax_form_new_object(this.$elem);
				}		
			});
		},
		
		display_url_base_hash: function () { // que j'appelle depuis le main.js handler document.ready()
			var hash = window.location.hash;
			if (hash != '') { // si hash vide ne fait rien
				var nom_page = hash.replace( /^#/, '' );
				this._display_ajax(nom_page);
			}
			return this; // chainable
		},
		
		_make_document_links_ajax: function () { 
			var that = this;
			var lastslash = function (t) { 
				return t.replace(/^.+\/([^\/]*)$/,'$1');
			};
		// pour les liens du menu
			$(document).on('click', 'a[href*="wkd/show/"]', function (event) {
	    			event.preventDefault(); // Ajax here
	    			var nom = lastslash($(this).attr('href'));
	    			
	    			//changement de hash va appeler display_ajax()
				//that.display_ajax("page", nom);
				window.location.hash = nom;
	   			return false; //for good measure
			});
		// pour les liens du sommaire collection objet
			this.$elem.on('click', 'a[href*="/show/"].sommaire_collection', function (event) {
				event.preventDefault(); // Ajax here
				var titre = lastslash($(this).attr('href'));
				//var hash_last_slash = lastslash(window.location.hash);
				window.location.hash = that.$elem_contenu_wikid.data('page_nom') + '/' + titre;
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
					var that = this;
					this.$elem_contenu_wikid.hide("slide", { direction: 'down'}, "easeOutQuint", function() {
				  	 	$(this).empty();
						$(this).html(ans.page_contenu);
						$(this).find('button').button();
						that.ajax_form_new_object($(this).find('#new_object_form'));
					// c'est la clé pour le plugin mode edit
						$(this).data('page_nom', ans.page_nom); 
						$(this).next('input[name="page_name"]').val(ans.page_nom); 
						//that._images_display_each_element(this); // affiche la page et ses images une par une
						$(this).show("slide", {}, "easeOutQuint", function () {
							
						});
					});
				},
				complete: function () {
					this.$elem_wrapper.spin(false);
				}		
			});
		},
		
		ajax_form_new_object: function ($elem_form) {
			$elem_form.ajaxForm({
				target: $elem_form.find('p'),
				//type: 'POST',
				context: this,
				dataType: 'json',
				beforeSend: function () {
					console.info(this);
					this.$elem.spin();
				},
				error: function () {
					alert('erreur serveur / reessayer');
				},
				success: function (ans) {
					if (ans.success) {
						console.info(ans.new_obj_titre);
					}
					else {
						alert('cette fiche existe déjà');
					}
				},
				complete: function () {
					this.$elem.spin(false);
					// this.options.on_update_callback.call()
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
	};

	$.fn.wikid_objets_navigation = function (options) {
		if (this.length) {
			return this.each(function () {
				var wikid_objets_navigation = Object.create(Wikid_objets_navigation_prototype);
				wikid_objets_navigation.init(options, this);
				$(this).data('wikid_objets_navigation', wikid_objets_navigation);		
			});
		}
	}; 
}(jQuery));
