(function ($) {
	var Wikid_Navigation_Prototype = {
	
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);
			this._init_hashchange_plugin();
			return this;
		},
		
		options: {
			on_display_ajax_callback: function () {}
		},
		
		root_element_show: function () { //à appeler au dernier moment quand tout est prêt
			var root_element = document.documentElement;
			//$(root_element).removeClass('js');
			$('html').removeClass('js');
			//$('.js').removeClass('js');
			//show();
			return this;
		},
		
		
		_init_dom_elem_data: function (nom) {
			this.$elem.find('#header.contenu_wikid').data('page_nom', 'header');
			this.$elem.find('#page.contenu_wikid').data('page_nom', nom);
			this.$elem.find('#footer.contenu_wikid').data('page_nom', 'footer');
		},
		
		_init_hashchange_plugin: function () {
			var that = this;
			$(window).hashchange( function () {
				var hash = location.hash;
				//var nom_page = ( hash.replace( /^#/, '' ) || 'accueil' );
				var nom_page = hash.replace( /^#/, '' );
				that.display_ajax('page', nom_page);
			});
		},
		
		start_display_all_ajax: function () { //on l'utilise pour recharger header, page, footer avec les dimensions et coordonnées'		
			var hash = location.hash;
			var nom_page = ( hash.replace( /^#/, '' ) || 'accueil' );
			var that = this;
			$.ajax({//demander l'affichage d'une page et de l'entête et pied de page su dite'
				url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/show/" + nom_page,
				type: "POST",
				data: {ajax_enabled: 1},
				dataType: "json",
				context: this,
				success: function (ans) {
					 	if (!ans.success) alert('Erreur durant le chargement !');
						 else
				  	 	{
				  	 		$('#page_nom').val(ans.page_nom);	
				  	 		$(ans.divs).each(function (k,div) {
				  	 			var $each_elem = $('#'+div.id);
				  	 			$each_elem.hide().empty().html(div.html);
				  	 			
				  	 			that.select_elem_make_ajax_links($each_elem);
								that.options.on_display_ajax_callback.call($each_elem);
				  	 				
				  	 			$each_elem.parent() //voir plugin div_wikidable pourquoi parent
				  	 				.width(div.coordonnees.width)
				  	 				.height(div.coordonnees.height)
					  	 			.position({
					  	 				'my': "left top",
					  	 				'at': "left top",
					  	 				'of': $('#wrapper'),
					  	 				'offset': div.coordonnees.offset_left
					  	 				+ ' ' 
					  	 				+ div.coordonnees.offset_top,
					  	 				"collision": "none"
					  	 			});
					  	 		
					  	 		$each_elem.show("scale", {}, "easeOutQuint");					
				  	 		});
				  	 		this._init_dom_elem_data(ans.page_nom);
				  	 	}	    				
				},
				complete: function () {
					this.root_element_show();
				}
			});

		},
		
		display_ajax: function (id, nom) { //id du div à afficher, nom de la page à afficher (appel de model_getpage())
			var that = this;
			var $spin_elem_ref = $('#img_back_logo, #background_wrapper');
			var $elem_id = $('#'+id);
			var $elem_id_parent = $elem_id.parent();
			$.ajax({
				url : WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/display_ajax/" + nom,
				type : "GET",
				data : null,
				dataType : "json",
				beforeSend: function () {
						$spin_elem_ref.spin({
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
						  top: 'auto', // Top position relative to parent in px
						  left: 'auto' // Left position relative to parent in px
						});
					},
				success : function (ans) {
					$spin_elem_ref.spin(false);
					if (!ans.success) alert('Erreur durant le chargement !');
					else {
						//$('#'+id+'_nom').val(ans.page_nom);				
						$elem_id.hide("slide", { direction: 'down'}, "easeOutQuint", function() {
							$elem_id_parent
								.width(ans.coordonnees.width)
				  	 			.height(ans.coordonnees.height)
					  	 		.position({
					  	 			'my': "left top",
					  	 			'at': "left top",
					  	 			"of": $('#wrapper'),
					  	 			"offset": ans.coordonnees.offset_left 
					  	 				+ ' ' 
					  	 				+ ans.coordonnees.offset_top,
					  	 			"collision": "none"
					  	 		});
					  	 	$(this).empty();
							$(this).html(ans.page_contenu);
							$(this).data('page_nom', ans.page_nom);
							
							that.select_elem_make_ajax_links($(this));
							that.images_display_element(this);
							that.options.on_display_ajax_callback.call(this);
						});		
					}
				}		
			});
		},
		
		images_display_element: function (elem) {
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
		},
		
		display_resize_ajax: function (id, nom, largeur, hauteur) { //id du div à afficher, nom de la page à afficher (appel de model_getpage())
//largeur et hauteur passés en paramètres JS, modif locale pour l'instant'
			var that = this;
			$.ajax({
				url : WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/display_ajax/"+nom,
				type : "POST",
				data : null,
				dataType : "json",
				success : function (ans) {
					if (!ans.success) alert('Erreur durant le chargement !');
					else {
						//$('#'+id+'_nom').val(ans.page_nom);
								
						$('#'+id).hide("scale", {}, "easeOutQuint", function() {
							$(this).parent()
								.width(largeur)
								.height(hauteur)
							; //c'est le conteneur parent qui est draggable'
							$(this)
								.html(ans.page_contenu)
								.show("scale", {}, "easeOutQuint");					
						});
						that.$elem.find('#'+id).data('page_nom', ans.page_nom);
					}		
				}		
			});
		},
		
		make_ajax_links: function () { //pour les liens du menu
			var that = this;
			var lastslash = function (t) { 
				return t.replace(/^.+\/([^\/]*)$/,'$1');
			};
			$(document).on('click', 'a[href*="wkd/show/"]', function (event) {
	    			event.preventDefault();
	    			// Ajax here
	    			var nom = lastslash($(this).attr('href'));
				//that.display_ajax("page", nom);
				window.location.hash = nom; //changement de hash va appeler display_ajax()
	   			that.effect_random_highlight($('#cadre_back'), $(this).parents('.categorie').find('a'));
	   			return false; //for good measure
			});	
		},
		
		select_elem_make_ajax_links: function (elem) { //on peut l'utiliser sur un contenu rechargé en ajax'
			var that = this;
			var lastslash = function (t) { 
				return t.replace(/^.+\/([^\/]*)$/,'$1');
			};
			$('a[href*="wkd/show/"]', elem).click(function (event) {
	    			event.preventDefault();
	    			// Ajax here
	    			var nom = lastslash($(this).attr('href'));
	    			//console.info(nom);
				//that.display_ajax("page", nom);
				window.location.hash = nom;//changement de hash va appeler display_ajax()
				that.effect_random_highlight($('#cadre_back'));
	   			return false; //for good measure
			});	
		},
		
		effect_random_highlight: function (elem1, elem2) {
			var random_color1 = Math.floor(Math.random()*256);
	   		var random_color2 = Math.floor(Math.random()*256);
   			var random_color3 = Math.floor(Math.random()*256);
   			var random_color4 = Math.random();
   			var color_target = 'rgba(' 
   					+ random_color1 + ',' 
   					+ random_color2 + ',' 
   					+ random_color3 + ',' 
   					+ random_color4 + ')';  
   			//Math.floor(Math.random()*11)+ random_color1 + ',' 
   			$(elem1).effect("highlight", { color: color_target}, 1500);
   			if (elem2) {
   				$(elem2).effect("highlight", { color: color_target}, 1500);
   			}
   			return this;
		},
		
		busy: function () {
			return '<img src="/wicked6/application/views/images/ajax-loader.gif" alt="Loading.." />';
		}
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
