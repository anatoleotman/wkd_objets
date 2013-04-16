//necessite jquery ui pour draggable()

(function ($) {
	var Wrapper_div_Wikidable = {
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);
			this.$elem_child_contenu_wikidable = $(elem).find('.contenu_wikid');//une reference au div contenu wikid
			
			this.$elem.toggleClass('wikid-editable');
			this.make_its_wrapper_draggable();
			this._init_editor_toolbar_dialog();
			this.code_couleur_init();
			this._build_bouton_ok();
			this.event_dblclick_on_div_wikidable();
			this._init_dom_elem_data();
			return this;
		}, 
	
		options: {
			on_div_wikidable_update_callback: function () {}
		},
		
		_init_editor_toolbar_dialog: function () {
			if (document.getElementById('editor_toolbar_dialog')) {
				return this;
			} 
			else {
				
				this.editor_toolbar_dialog = $('<div>', {
					id: 'editor_toolbar_dialog',
				})
					.css({ 
						'padding': '0em 0em'
					//	'height': 'auto'
					});
				
				var html_string = [
    					'<div id="topSpace"></div>',
				].join('');
				$(this.editor_toolbar_dialog).html(html_string);
				$('body').append(this.editor_toolbar_dialog);
				this.$toolbar_dialog = $(this.editor_toolbar_dialog);
				//plus simple à manipuler
				this.$toolbar_dialog.dialog({
					autoOpen: false,
					height: 'auto',
					width: 910, 
					position: ['right', 'top'],
					resizable: false,
					open: function (event, ui) {
						$(this)
							.dialog('widget')
							.show('scale')
							.css('background', 'transparent');
					},
					close: function (event, ui) {
						$(this)
							.dialog('widget')
							.hide('scale');
					}
				});
				return this;
			}
		},
		
		_init_dom_elem_data: function () {
			//on utilise 'objet wikid navigation pour modifier cette donnée'
			this.$elem_child_contenu_wikidable.data('page_nom', 'default_name');
			this.$elem.addClass('wikid');
		},
	
		make_its_wrapper_draggable: function () {
			var that = this;
			this.$elem.draggable({
				stop: function () {
					var position = that.$elem.position();
					$.ajax({
						url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/update_coordinates_ajax/" + 								that.$elem_child_contenu_wikidable.data('page_nom'),
						type: "POST",
						data: {
							coordonnees: {
								offset_left: position.left,
								offset_top : position.top
							}
						},				
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
		
		_build_bouton_ok: function () {
		
			var contenu_wikidable_elem_ID = this.$elem_child_contenu_wikidable.attr('id');
			
			this.$bouton_ok = $('<input>', {
				type: 'button',
				id: 'bouton_ok_'+ contenu_wikidable_elem_ID,
				value: 'Ok ' + contenu_wikidable_elem_ID,
				class: 'bouton_wikid'
			});
			
			this.$bouton_cancel = $('<input>', {
				type: 'button',
				id: 'bouton_cancel_'+ contenu_wikidable_elem_ID,
				value: 'Cancel ' + contenu_wikidable_elem_ID,
				class: 'bouton_wikid'
			});
			
			this.$bouton_ok
				.button()
				.appendTo(this.$elem);
			
			this.$bouton_cancel
				.button()
				.css('background-color', 'rgba(255, 2, 23, 0.4)')
				.appendTo(this.$elem);
			
			//this.$bouton_ok.appendTo($('.ui-dialog-titlebar', this.$toolbar_dialog));
			/*this.$bouton_ok.position({
				my: 'left top',
				at: 'left bottom',
				of: $('.ui-dialog-titlebar', this.editor_toolbar_dialog),
				offset: '0 10',
				collision: 'fit flip'
			});
			*/
			this.$bouton_ok.on('click', $.proxy(this.handler_ok_button, this));
			this.$bouton_cancel.on('click', $.proxy(this.handler_cancel_button, this));
			this.$bouton_ok.hide();
			this.$bouton_cancel.hide();
		},
		
		handler_cancel_button: function (event) {
			var editor = this.$elem_child_contenu_wikidable.ckeditorGet();
			editor.destroy(true);
			// cacher les bouton
			$(event.currentTarget).hide('scale');
			this.$bouton_ok.hide();
			
			this._close_ckeditor();
		},
		
		handler_ok_button: function (event) {
			
			var editor = this.$elem_child_contenu_wikidable.ckeditorGet();
			var contenu_wikidable_elem_ID = this.$elem_child_contenu_wikidable.attr('id');
			var size = editor.window.getViewPaneSize();				
			if (editor.checkDirty()) {
				$.ajax({
					url: 	WIKIDGLOBALS.BASE_DIRECTORY 
						+ "index.php/wkd/modify_page/" 
						+ this.$elem_child_contenu_wikidable.data('page_nom'), 
						//.data('page_nom') c'est la clef de voute
					type: "POST",
					context: this,
					data: {
						contenu: editor.getData(), 
						ajax_enabled: 1	,
						dimensions: {
							width: size.width,
							height: size.height
						}
					},
					dataType: "json",
					beforeSend: function () {
						this.$elem.spin();
					},
				  	success: function (ans) {			  	
						if (!ans.success) {alert('Erreur durant la sauvegarde !');}
						else {		
				  			editor.destroy();				
				  			this.options.on_div_wikidable_update_callback
				  				.apply(
				  					this.$elem_child_contenu_wikidable,
				  					[
					  					contenu_wikidable_elem_ID, 
					  					ans.page_nom, 
					  					size.width, 
					  					size.height
					  				]
				  				);
				  			this._close_ckeditor();
				  		}
				 	},
				 	complete: function () {
				 		this.$elem.spin(false);
				 	}
				});
			} 
			else {
				// checkdirty false; pas de resize
				editor.destroy(true);
				this._close_ckeditor();
			}
			// cacher le bouton_ok 
			$(event.currentTarget).hide('scale');
			this.$bouton_cancel.hide('scale');
		},
		
		_close_ckeditor: function () {
			// réactive draggable	
			this.$elem
				.draggable( "option", "disabled", false )
				.toggleClass('actif');
			$('#wrapper').off('click.div_wikidable', 'a');
			
			// referme la fenêtre de dialogue de la barre d'outil ckeditor'
			//console.info(CKEDITOR.instances);
			if (!Object.keys(CKEDITOR.instances).length) {
				// that.$toolbar_dialog.dialog('close'); //c'est étrange ces dialogues et les références
				$('#editor_toolbar_dialog').dialog('close');
				$('#menu_cadre').show();
			}
			else {
				for (var key in CKEDITOR.instances) {
					CKEDITOR.instances[key].focus();
				}
			}
		},
	
		_init_ckeditor: function () {
			var that = this;
			
			var contenu_wikidable_elem_ID = this.$elem_child_contenu_wikidable.attr('id');
			this.$elem.toggleClass('actif');
			this.$elem.draggable( "option", "disabled", true );
			
			// on s'assure de désactiver les liens cliquables
			$('#wrapper').on('click.div_wikidable', 'a', function (event) {
				event.preventDefault();
				event.stopPropagation();
			});
			
			
			this.$elem_child_contenu_wikidable.ckeditor(function() { 
				/* CKEDITOR callback code */
				this.focus();
				$('#menu_cadre').hide();
				that.$bouton_ok.show('scale');
				that.$bouton_cancel.delay(1000).show('scale');
			}, {	
				// CKEDITOR configs
				//cke_skin_kama bordures de 1+5px de large puis le cke wrapper avec 5 px en bordure
				width: that.$elem.width() + 6*2 + 5*2, 
				height: that.$elem.height(),
				sharedSpaces: { 
					top: 'topSpace'
					//bottom: 'bottomSpace'//pour utiliser resize
				}
			});
			var editor = this.$elem_child_contenu_wikidable.ckeditorGet();
			editor.on('focus', function(e) {
					var $local_scope_dialog_ref = $('#editor_toolbar_dialog');
					$('.cke_wrapper', $local_scope_dialog_ref).css('background-color', that.string_couleur_target_rgba);
					$('.cke_wrapper', that.$elem).css('background-color', that.string_couleur_target_rgba);
					that.$bouton_ok.css({
						'background': 'none',
						'background-color': that.string_couleur_target_rgba
					});
					//pour le dialog, jutilise le selecteur jquery et non la reference de l'objet
					//that.$toolbar_dialog n'existe plus, à voir avec le plugin dialog
					if (!$local_scope_dialog_ref.dialog('isOpen')) {
						$local_scope_dialog_ref.dialog('open');
					}
					
			});
			editor.on('blur', function (e) {					
					$('.cke_wrapper').css('background-color', 'transparent');
					$('.cke_wrapper', that.$elem).css('background-color', 'transparent');
					that.$bouton_ok.css({
						'background': '',
						'background-color': ''
					});
			});
			editor.on('dialogShow', function (e) {
				$('.cke_dialog_body', 'body').css('background-color', that.string_couleur_target_rgba);
			});
			/*editor.on('resize', function (e) {
				console.info('resize checkdirty');
			});*/
		},
		
		code_couleur_init: function () {
			var random_color1 = Math.floor(Math.random()*256);
	   		var random_color2 = Math.floor(Math.random()*256);
   			var random_color3 = Math.floor(Math.random()*256);
   			var random_color4 = Math.random();
   			this.string_couleur_target_rgba = 'rgba(' 
   					+ random_color1 + ',' 
   					+ random_color2 + ',' 
   					+ random_color3 + ',' 
   					+ random_color4 + ')';
   			return this;		
		},
		
		
		event_dblclick_on_div_wikidable: function () {
		
			this.$elem.on('dblclick', $.proxy(this.handler_on_dblclick, this));
			return this;
		},
		
		handler_on_dblclick: function (event) {
			//console.info(this.$elem_child_contenu_wikidable.data('page_nom'));
			this._init_ckeditor();
			//return this;
		}
			
			
	};
	
	
	
	
	$.fn.wrapper_div_wikidable = function (options) {
		if (this.length) {
			return this.each(function () {
				var wrapper_div_wikidable = Object.create(Wrapper_div_Wikidable);
				wrapper_div_wikidable.init(options, this);
				$(this).data('wrapper_div_wikidable', wrapper_div_wikidable);//ou encore $.data(this, 'key', value)
			});
		}
	
	};
}(jQuery));
