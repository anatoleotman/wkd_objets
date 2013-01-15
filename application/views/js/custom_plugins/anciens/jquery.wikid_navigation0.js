(function ($) {
	var Wikid_Navigation_Prototype = {
	
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);
			return this;
		},
		
		options: {
		
		},
		
		_init_dom_elem_data: function (nom) {
			this.$elem.find('#header.wikidable').data('page_nom', 'header');
			this.$elem.find('#page.wikidable').data('page_nom', nom);
			this.$elem.find('#footer.wikidable').data('page_nom', 'footer');
		},
		
		start_display_all_ajax: function (nom) {
			var that = this;
			$.ajax({//demander l'affichage d'une page et de l'entête et pied de page su dite'
				url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/show/"+nom,
				type: "POST",
				data: {ajax_enabled: 1},
				dataType: "json",
				success: function(ans) {
					 	if (!ans.success) alert('Erreur durant le chargement !');
						 else
				  	 	{
				  	 		$('#page_nom').val(ans.page_nom);
				  	 		$.each(ans.divs,function (k,div) { 
				  	 			$('#'+div.id).html(div.html); 
				  	 		
				  	 		});
				  	 		that._init_dom_elem_data(ans.page_nom);
				  	 		
				  	 	}	    				
				 	 }
			});

		},
		
		display_ajax: function (id, nom) { //id du div à afficher, nom de la page à afficher (appel de model_getpage())
			var that = this;
			$.ajax({
				url : WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/display_ajax/"+nom,
				type : "POST",
				data : null,
				dataType : "json",
				success : function(ans) {
					if (!ans.success) alert('Erreur durant le chargement !');
					else {
						$('#'+id+'_nom').val(ans.page_nom);				
						$('#'+id).hide("scale", {}, "easeOutQuint", function() {
							$(this)
							.html(ans.page_contenu).show("scale", {}, "easeOutQuint");					
						});
						that.$elem.find('#'+id).data('page_nom', ans.page_nom);					
					}		
				}		
			});
		},
		
		display_resize_ajax: function (id, nom, largeur, hauteur) { //id du div à afficher, nom de la page à afficher (appel de model_getpage())
//largeur et hauteur passés en paramètres JS, modif locale pour l'instant'
			var that = this;
			$.ajax({
				url : WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/display_ajax/"+nom,
				type : "POST",
				data : null,
				dataType : "json",
				success : function(ans) {
					if (!ans.success) alert('Erreur durant le chargement !');
					else {
						$('#'+id+'_nom').val(ans.page_nom);
								
						$('#'+id).hide("scale", {}, "easeOutQuint", function() {
							$(this).parent(); //c'est le conteneur parent qui est draggable'
							$(this)
								.width(largeur)
								.height(hauteur)
								.html(ans.page_contenu)
								.show("scale", {}, "easeOutQuint");					
						});
						that.$elem.find('#'+id).data('page_nom', ans.page_nom);
					}		
				}		
			});
		},
		
		make_ajax_links: function () {
			var that = this;
			var lastslash = function (t) { 
				return t.replace(/^.+\/([^\/]*)$/,'$1');
			};
			$('a[href*="/show/"]').live('click', function (event) {
	    			event.preventDefault();
	    			// Ajax here
	    			var nom = lastslash($(this).attr('href'));
	    			//console.info(nom);
				that.display_ajax("page", nom);
	   			return false; //for good measure
			});	
		},
		
		busy: function () {
			return '<img src="/wicked6/application/views/images/ajax-loader.gif" alt="Loading.." />';
		}
	};

	$.fn.wikid_navigation0 = function (options) {
		if (this.length) {
			return this.each(function () {
				var wikid_navigation = Object.create(Wikid_Navigation_Prototype);
				wikid_navigation.init(options, this);
				$(this).data('wikid_navigation0', wikid_navigation);		
			});
		}
	}; 
}(jQuery));
