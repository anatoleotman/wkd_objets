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
		//	console.info(this.$elem_hidden_page_name);
			this.$elem.find('#sommaire_collection_' + this.$elem_hidden_page_name.val()).accordion({
				initShow: '#current',
				activeLink: true,
				expandSub : true
			});
			this.menu_active_link_init();
			//this.$elem.find('.sommaire_collection').accordion();
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
		
		menu_active_link_init: function () {
			var path = window.location.pathname.split('/');
			var page = path[path.length - 1];
			var hash_full = window.location.hash.split('/');
			var hash_last_slash = hash_full[hash_full.length - 1];
			console.info(page);
			console.info(hash_last_slash);
			var $menu_wrapper_elem = $('#menu_cadre');
			if (!page) {page = this.starting_page_nom;}
			if(hash_last_slash) {page = hash_last_slash;}
			$menu_wrapper_elem.find("a[href$='" + page + "']").parents().addClass('page_courante');
		},
		
		menu_active_link_hashchange: function (hash_part) {
			
			var $menu_wrapper_elem = $('#menu_cadre');
			console.info($menu_wrapper_elem);
			$menu_wrapper_elem.find('.page_courante').removeClass('page_courante');
			$menu_wrapper_elem.find("a[href$='" + hash_part + "']").parents().addClass('page_courante');
		},
		
		_init_hashchange_plugin: function () {
			var that = this;
			$(window).hashchange( function () { 
				var hash = location.hash;
				var complete_hash = ( hash.replace( /^#/, '' ) || that.starting_page_nom);
				//var nom_page = hash.replace( /^#/, '' );
				var split_hash = complete_hash.split('/');
				if (split_hash.length === 1) {
					that.display_ajax(split_hash[0]);
					that.menu_active_link_hashchange(split_hash[0]);
				}
				else if (split_hash.length === 2) {
					if (split_hash[0] === that.$elem_contenu_wikid.data('page_nom')) { // si objet demandé appartient à la page courante
						that._objets_display(split_hash[1]);
					}
					else {
						that.display_ajax(complete_hash);
						that.menu_active_link_hashchange(split_hash[0]);
					}
				}
				
			});
		},
		
		_objets_display: function (objets_titre) { // afficher une catégorie d'objets ou le titre d'un objet
			var that = this;
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
						$('#objet_' + ans.page_nom).hide("slide", { direction: 'right'}, "easeOutQuint", function() {
					  	 	$(this).empty();
					  	 	//console.info($(ans.objet_contenu_html).children());
					  	 	$(this).html($(ans.objet_contenu_html).children());
							//$(this).html(ans.objet_contenu_html);
							$(this).data('objet_nom', ans.objet_data.titre); // c'est la clé pour le plugin mode edit
							$(this).find('button')
								.button()
								.each(function () {
								
								var random_color1 = Math.floor(Math.random()*256);
						   		var random_color2 = Math.floor(Math.random()*256);
					   			var random_color3 = Math.floor(Math.random()*256);
					   			var random_color4 = Math.random()*0.5;
					   			var string_couleur_target_rgba = 'rgba(' 
					   					+ random_color1 + ',' 
					   					+ random_color2 + ',' 
					   					+ random_color3 + ',' 
					   					+ random_color4 + ')';
								$(this).css('background', string_couleur_target_rgba);
							});
							//that._images_display_each_element(this); // affiche la page et ses images une par une
							$(this).show("slide", {direction: 'left'}, "easeOutQuint");
						});
					}
					else {
						alert('cet objet nexiste pas');
					}
				},
				complete: function () {
					this.$elem_wrapper.spin(false);
				}		
			});
		},
		
		
		display_url_base_hash: function () { // que j'appelle depuis le main.js handler document.ready()
			var hash = window.location.hash;
			if (hash != '') { // si hash vide ne fait rien
				var nom_page = hash.replace( /^#/, '' );
				this.display_ajax(nom_page);
			}
			return this; // chainable
		},
		
		_make_document_links_ajax: function () { 
//			var that = this;
//			var lastslash = function (t) { 
//				return t.replace(/^.+\/([^\/]*)$/,'$1');
//			};
		// pour les liens du menu
//			$(document).on('click', 'a[href*="/show/"]', function (event) {
//	    			event.preventDefault(); // Ajax here
//	    			var nom = lastslash($(this).attr('href'));
//	    			
//	    			if ($(event.target).hasClass('sommaire_collection') || $(event.target).hasClass('link_obj_collection')) {
//	    				window.location.hash = that.$elem_contenu_wikid.data('page_nom') + '/' + nom;
//	    			}
//	    			else {
//	    				window.location.hash = nom;
//	    			}
//	    			
//	    			//changement de hash va appeler display_ajax()
//				//that.display_ajax("page", nom);
//				
//	   			return false; //for good measure
//			});
			
			$(document).on('click', 'a[href*="/sync/show/"]', function (event) {
	    			event.preventDefault(); // Ajax here
	    			var href = $(event.target).attr('href');
	    			if (typeof href === 'undefined') {
	    				href = $(event.target).parent('a').attr('href');
	    			}
	    			var marqueur = '/sync/show/';
	    			var internal_link = href.substring(href.lastIndexOf(marqueur) + marqueur.length, href.length);
	    			var hashes = internal_link.split('/');
	    			
	    			
	    			if (hashes.length === 2) {
	    				window.location.hash = hashes[0] + '/' + hashes[1];
	    			}
	    			else if (hashes.length === 1) {
	    				window.location.hash = hashes[0];
	    			}
	   			return false; //for good measure
			});
			
		// pour les liens du sommaire collection objet
//			this.$elem.on('click', 'a.sommaire_collection', function (event) {
//				event.preventDefault(); // Ajax here
//				var titre = lastslash($(this).attr('href'));
//				//var hash_last_slash = lastslash(window.location.hash);
//				window.location.hash = that.$elem_contenu_wikid.data('page_nom') + '/' + titre;
//			});
//			
//			this.$elem.on('click', 'a.link_obj_collection', function (event) {
//				event.preventDefault(); // Ajax here
//				var titre = lastslash($(this).attr('href'));
//				//var hash_last_slash = lastslash(window.location.hash);
//				window.location.hash = that.$elem_contenu_wikid.data('page_nom') + '/' + titre;
//			});
		},
		
		display_ajax: function (nom_page) { //nom de la page à afficher (appel de model_getpage())
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
					if (ans === null) {
						alert("la page demandée n'existe pas");
					}
					else {
						var that = this;
						this.$elem_contenu_wikid.hide("slide", { direction: 'left'}, "easeOutQuint", function() {
					  	 	$(this).empty();
							$(this).html(ans.page_contenu);
						
						// c'est la clé pour le plugin mode edit
							$(this).data('page_nom', ans.page_nom); 
							$(this).next('input[name="page_name"]').val(ans.page_nom);
//							that._iframe_display(this);
							//that._images_display_each_element(this); // affiche la page et ses images une par une
						// on prépare la nouvelle page avant de l'afficher'
							$(this).find('.buttonset').buttonset().children('button').each(function () {
								
								var random_color1 = Math.floor(Math.random()*256);
						   		var random_color2 = Math.floor(Math.random()*256);
					   			var random_color3 = Math.floor(Math.random()*256);
					   			var random_color4 = Math.random()*0.5;
					   			var string_couleur_target_rgba = 'rgba(' 
					   					+ random_color1 + ',' 
					   					+ random_color2 + ',' 
					   					+ random_color3 + ',' 
					   					+ random_color4 + ')';
								$(this).css('background', string_couleur_target_rgba);
							});
							
							//console.info(ans.page_nom);
							//console.info($(this).find('#sommaire_collection_' + ans.page_nom));
							$(this).find('#sommaire_collection_' + ans.page_nom).accordion({
								initShow: '#current',
								activeLink: true,
								expandSub : true
							});
							
							$('.image_overlay', this).img_overlay_effect();
							$(this).show("slide", {direction: 'right'}, "easeOutQuint", function () {
							
							});
						});
					}
				},
				complete: function () {
					this.$elem_wrapper.spin(false);
					
				}		
			});
		},
		
		_iframe_display: function (elem) {
			var $iframes = $('iframe', elem);
			if ($iframes.length) {
				$iframes.hide();
				$iframes.each(function () {
					$(this).on('load', function () {
						$(this).fadeIn('slow');
					})
				});
			}
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
