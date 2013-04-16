//necessite jquery ui pour draggable()
//ce plugin est fortement dépendend de la vue principale: un div .wikidable a besoin d'un champ caché frère id_nom qui contient le nom de la page affichée dans le div wikidable'

(function ($) {
	var Div_Wikidable0 = {
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);
			this.make_its_wrapper_draggable();
			//this.bind_dblclick_on_div_wikidable();//appel de l'extérieur pour faire genre plus explicite'
			this._init_dom_elem_data();
			return this;
		}, 
	
		options: {
			on_div_wikidable_update_callback: function () {}
		},
		
		_init_dom_elem_data: function () { //on utilise 'objet wikid navigation pour modifier cette donnée'
			this.$elem.data('page_nom', 'default_name');
		},
	
		make_its_wrapper_draggable: function () {
			this.$elem.parent().draggable();
			return this;	
		},
	
		_init_ckeditor: function () {
			var that = this;
			var this_dblclick_element_id = this.$elem.attr('id');
			//var this_nom = this.$elem.siblings('#'+this_dblclick_element_id+'_nom');
			this.$elem.ckeditor(function() { /* callback code */ }, { 
				skin : 'office2003', 
				width : that.$elem.width(), 
				height : that.$elem.height()
			});
			var editor = this.$elem.ckeditorGet();//déclaration de la variable en début de fonction, mais attribution à cette ligne
			//console.info(editor);
			editor.config.sharedSpaces = { top : 'toolbar_cadre' };
			var bouton_ok = document.createElement('input');
					bouton_ok.setAttribute('type', 'button');
					bouton_ok.setAttribute('id', 'bouton_ok_'+this_dblclick_element_id);
					bouton_ok.setAttribute('value', 'bouton_ok_'+this_dblclick_element_id);
					bouton_ok.setAttribute('class', 'bouton_wikid');
			this.$elem.after($(bouton_ok));
			$(bouton_ok).click(function (e) {
				that.$elem.parent().draggable( "option", "disabled", false );
				$(this).hide();
				var size = editor.window.getViewPaneSize();
				$.ajax({
					url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/modify_page/"+$('#'+this_dblclick_element_id+'_nom').val(),
					type: "POST",
					data: {contenu: editor.getData(), ajax_enabled: 1},//récupéré dans le controller wkd par la fonction modify_page
					dataType: "json",
				  	success: function(ans) {			  	
						if (!ans.success) {alert('Erreur durant la sauvegarde !');}
						else
				  		{	
				  		//alert('Sauvegarde effectuée pour la page 									'+ans.page_nom);		  
				  			editor.destroy();				
				  			$('#'+this_dblclick_element_id+'_nom').val(ans.page_nom);		  			
				  			//$('#'+this_dblclick_element_id).html(busy());//that.$elem pourrait fonctionner aussi 
				  					//setTimeout("refresh_display_ajax()",800);
				  			that.options.on_div_wikidable_update_callback
				  			.apply(that.$elem, [this_dblclick_element_id, ans.page_nom, size.width, size.height]);
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
				console.info(that.$elem.data('page_nom'));
				that.$elem.parent().draggable( "option", "disabled", true );
				that._init_ckeditor();
			
			});
			return this;
		}
	};
	
	$.fn.div_wikidable0 = function (options) {
		if (this.length) {
			return this.each(function () {
				var div_wikidable = Object.create(Div_Wikidable0);
				div_wikidable.init(options, this);
				$(this).data('div_wikidable0', div_wikidable);//ou encore $.data(this, 'key', var)
			});
		}
	
	};
}(jQuery));
