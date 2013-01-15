//necessite jquery ui pour draggable()

(function ($) {
	var Wrapper_div_Wikidable = {
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);
			this.$elem_child_contenu_wikidable = $(elem).find('.contenu_wikid');//une reference au div contenu wikid
			this.make_its_wrapper_draggable();
			//this.bind_dblclick_on_div_wikidable();//appel de l'extérieur pour faire genre plus explicite'
			this._init_dom_elem_data();
			return this;
		}, 
	
		options: {
			on_div_wikidable_update_callback: function () {}
		},
		
		_init_dom_elem_data: function () { //on utilise 'objet wikid navigation pour modifier cette donnée'
			this.$elem_child_contenu_wikidable.data('page_nom', 'default_name');
		},
	
		make_its_wrapper_draggable: function () {
			var that = this;
			this.$elem.draggable({
				stop: function () {
					var position = that.$elem.position();
					//console.info(offset);
					$.ajax({
						url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/update_coordinates_ajax/" + 								that.$elem_child_contenu_wikidable.data('page_nom'),
						type: "POST",
						data: {
							coordonnees: {
								//width: that.$elem.parent().width(),
								//height: that.$elem.parent().height(),
								offset_left: position.left,
								offset_top : position.top
							}				
						},//récupéré dans le controller wkd par la fonction modify_page
						dataType: "json",
				  		success: function(ans) {			  	
							if (!ans.success) {alert('Erreur durant la sauvegarde !');}
							else
				  			{		
				  			console.info('drag saved');
				  			}
				 		}
					});
				}
			});
			return this;	
		},
	
		_init_ckeditor: function () {
			var that = this;
			var this_dblclick_element_id = this.$elem_child_contenu_wikidable.attr('id');//this contenu wikidable element id 
			//var this_nom = this.$elem.siblings('#'+this_dblclick_element_id+'_nom');
			this.$elem_child_contenu_wikidable.ckeditor(function() { /* callback code */ }, {
				width : that.$elem.width() + 6*2 + 5*2, //dans firebug span cke_page avec cke_skin_kama bordures de 1+5px de large puis le cke wrapper avec 5 px en bordure
				height : that.$elem.height()
			});
			var editor = this.$elem_child_contenu_wikidable.ckeditorGet();
			//déclaration de la variable en début de fonction, mais attribution à cette ligne
			//console.info(editor);
			/*editor.config.sharedSpaces = { 
				top : 'toolbar_cadre',
				bottom : 'toolbar_cadre'
			};
			$('#toolbar_cadre').draggable();*/	
			var bouton_ok = document.createElement('input');
					bouton_ok.setAttribute('type', 'button');
					bouton_ok.setAttribute('id', 'bouton_ok_'+this_dblclick_element_id);
					bouton_ok.setAttribute('value', 'Appliquer Changements '+this_dblclick_element_id);
					bouton_ok.setAttribute('class', 'bouton_wikid');
			$(bouton_ok).button();
			this.$elem.after($(bouton_ok));
			$(bouton_ok).click(function (e) {
				var size = editor.window.getViewPaneSize();
				$(this).hide();//cache le bouton_ok
				that.$elem.draggable( "option", "disabled", false );//réactive draggable
				$.ajax({
					url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/modify_page/" + that.$elem_child_contenu_wikidable.data('page_nom'),
					type: "POST",
					data: {
						contenu: editor.getData(), 
						ajax_enabled: 1,
						dimensions: {
							width: size.width,
							height: size.height
						}						
					},//récupéré dans le controller wkd par la fonction modify_page
					dataType: "json",
				  	success: function(ans) {			  	
						if (!ans.success) {alert('Erreur durant la sauvegarde !');}
						else
				  		{		
				  		//alert('Sauvegarde effectuée pour la page 									'+ans.page_nom);		  
				  			editor.destroy();				
				  			//$('#'+this_dblclick_element_id+'_nom').val(ans.page_nom);		  			
				  			//$('#'+this_dblclick_element_id).html(busy());//that.$elem pourrait fonctionner aussi 
				  					//setTimeout("refresh_display_ajax()",800);
				  			that.options.on_div_wikidable_update_callback
				  			.apply(that.$elem_child_contenu_wikidable, [this_dblclick_element_id, ans.page_nom, size.width, size.height]);
				  					//setTimeout("display_ajax(this_dblclick_element_id, ans.page_nom)",800);
				  		}
				 	}
				});
				$(this).remove();
			});				
		},
	
		bind_dblclick_on_div_wikidable: function () {
			var that = this;
			this.$elem.dblclick(function () {
				console.info(that.$elem_child_contenu_wikidable.data('page_nom'));
				that.$elem.draggable( "option", "disabled", true );
				that._init_ckeditor();
			
			});
			return this;
		}
	};
	
	$.fn.wrapper_div_wikidable = function (options) {
		if (this.length) {
			return this.each(function () {
				var wrapper_div_wikidable = Object.create(Wrapper_div_Wikidable);
				wrapper_div_wikidable.init(options, this);
				$(this).data('wrapper_div_wikidable', wrapper_div_wikidable);//ou encore $.data(this, 'key', var)
			});
		}
	
	};
}(jQuery));
