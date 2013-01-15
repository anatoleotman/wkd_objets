//necessite jquery ui pour draggable()

(function ($) {
	var edit_mode_wrapper_prototype = {
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);// cest le wrapper edit
			
			this.$elem_contenu_wikid = $('.contenu_wikid', $(elem));// une reference au div contenu editable
			this.$elem_hidden_page_name = $('input[name="page_name"]', $(elem)); // hidden field pour connaitre la page servie initialement
			this.$elem.addClass('wikid-editable');
			this._init_page_nom_data();
			this._code_couleur_init();
			this._build_editor_toolbar_dialog();
			this._events_edit_mode();
			
			return this;
		}, 
	
		options: {
			on_update_callback: function () {}
		},
		
		/*destroy_plugin_instance: function () {
			
		},*/
		
		_init_page_nom_data: function () { 
			// on doc.Ready on récupère le nom de la page affichée par le serveur
			//on utilise le champ caché pour specifier le nom de la page pour ce plugin
			this.$elem_contenu_wikid.data('page_nom', this.$elem_hidden_page_name.val());
			return this;
		},
		
		_build_editor_toolbar_dialog: function () {
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
		
		handler_cancel_button: function (event) {
			// cacher les bouton
			$(event.currentTarget).button('widget').css('background-color', 'rgba(255, 2, 23, 0.4)');
			this._close_ckeditor();
		},
		
		_events_edit_mode: function () {
		
			var contenu_wikidable_elem_ID = this.$elem_contenu_wikid.attr('id');
			this.$elem.on('dblclick.edit_mode', '.contenu_wikid', $.proxy(this.handler_edit_mode, this));
			
			this.$bouton_edit_mode = $('<button>', {
				id: 'bouton_edit_mode_'+ contenu_wikidable_elem_ID,
				value: 'Edit ' + contenu_wikidable_elem_ID,
				class: 'bouton_edit_mode'
			})	
			.appendTo(this.$elem)
			.button()
			.css({
					'background': 'none', 
					'background-color': this.string_couleur_target_rgba,
					'z-index': 2
			});
			
			this.$elem.on('click.edit_mode', '#bouton_edit_mode_'+ contenu_wikidable_elem_ID, $.proxy(this.handler_edit_mode, this));
			return this;
		},
		
		handler_edit_mode: function (event) {
			this.$elem_contenu_wikid.hide();
			// syntaxe courte avec .load() mais je comprends pas pourquoi ça déconne
			/*this.$wikid_form.load(	WIKIDGLOBALS.BASE_DIRECTORY + 
							"index.php/pages/edit_mode_init/" + 
							this.$elem_contenu_wikid.data('page_nom') + 
							'#wikid_input' );*/
			$.ajax({
				url: 	WIKIDGLOBALS.BASE_DIRECTORY 
					+ "index.php/pages/edit_mode_init/" 
					+ this.$elem_contenu_wikid.data('page_nom'), 
					//.data('page_nom') c'est la clef de voute
				type: "get",
				context: this,
				dataType: "json",
				beforeSend: function () {
					this.$elem.spin();
				},
			  	success: function (ans) {			  	
					this.$elem.append(ans); // on attache le wikid formulaire
					this._init_wikid_form_ajax(); // ajaxform plugin init // passée dans le callback de init_ckeditor
			 	},
			 	complete: function () {
			 		this.$elem.spin(false);
			 		this._init_ckeditor();
			 	}
			});
		},
		
		_init_wikid_form_ajax: function () {
			this.$wikid_form = $('#wikid_form_' + this.$elem_contenu_wikid.data('page_nom'), this.$elem);
			this.$wikid_form_textarea = $('textarea[name=contenu_' + this.$elem_contenu_wikid.data('page_nom') +']', this.$wikid_form); // textarea à partir duquel on init ckeditor
			$('button', this.$wikid_form).button(); // pour l'apparence des boutons'
			this.$bouton_cancel = $('button[name|="cancel"]', this.$wikid_form);
			this.$bouton_cancel.one('click', $.proxy(this.handler_cancel_button, this));
			
			this.$wikid_form.ajaxForm({
				target: this.$elem_contenu_wikid,
				context: this,
				dataType: 'json',
				beforeSend: function () {
					this.$elem.spin();
				},
				error: function () {
					alert('erreur serveur');
				},
				success: function (ans) {
					this.$elem_contenu_wikid.html(ans); // on update avec le nouveau contenu
					this._close_ckeditor();
				},
				complete: function () {
					this.$elem.spin(false);
					// this.options.on_update_callback.call()
				}
			});
			
			return this;
		},
	
		_init_ckeditor: function () {
			var that = this;
			var contenu_wikidable_elem_ID = this.$elem_contenu_wikid.attr('id');
			this.$elem.toggleClass('edit_mode_actif');
			// cacher le bouton edit_mode
			this.$bouton_edit_mode.hide();
			
			// on s'assure de désactiver les liens cliquables
			$('#wrapper').on('click.div_wikidable', 'a', function (event) {
				event.preventDefault();
				event.stopPropagation();
			});
			
			this.$wikid_form_textarea.ckeditor(function() { 
				/* CKEDITOR callback code */
				that._init_wikid_form_ajax();
				this.focus();
			}, {	
				// CKEDITOR configs
				// cke_skin_kama bordures de 1+5px de large puis le cke wrapper avec 5 px en bordure
				
				width: that.$elem.width() + 6*2 + 5*2, 
				height: that.$elem.height(),
				sharedSpaces: { 
					top: 'topSpace'
					//bottom: 'bottomSpace'//pour utiliser resize
				}
			});
			var editor = this.$wikid_form_textarea.ckeditorGet();
			editor.on('focus', function(e) {
					var $local_scope_dialog_ref = $('#editor_toolbar_dialog');
					$('.cke_wrapper', $local_scope_dialog_ref).css('background-color', that.string_couleur_target_rgba);
					$('.cke_wrapper', that.$elem).css('background-color', that.string_couleur_target_rgba);
					$('button[name|=save]', that.$wikid_form).css({
						'background': 'none',
						'background-color': that.string_couleur_target_rgba
					});
					// pour le dialog, jutilise le selecteur jquery et non la reference de l'objet
					// la référence that.$toolbar_dialog n'existe plus, à voir avec le plugin dialog de jquery ui
					if (!$local_scope_dialog_ref.dialog('isOpen')) {
						$local_scope_dialog_ref.dialog('open');
					}
					
			});
			editor.on('blur', function (e) {					
					$('.cke_wrapper').css('background-color', 'transparent');
					$('.cke_wrapper', that.$elem).css('background-color', 'transparent');
					$('button[name|=save]', that.$wikid_form).css({
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
		
		_close_ckeditor: function () {
			// libérer les ressources et références
			var editor = this.$wikid_form_textarea.ckeditorGet();
			editor.destroy(true);
			this.$wikid_form_textarea.empty();
			this.$bouton_cancel.empty();
			//this.$wikid_form_textarea = null; // est ce même necessaire ? 
			// poser un breakpoint faire le test pour voir ce que devient la reference
			this.$wikid_form.hide('scale', function () {
				$(this).remove();
			});
			// afficher le contenu
			this.$elem_contenu_wikid.show('scale');
			// afficher le bouton edit_mode
			this.$bouton_edit_mode.show();
			this.$elem.toggleClass('edit_mode_actif');
			
			
			// pour la dernière instance de ckeditor
			if (!Object.keys(CKEDITOR.instances).length) {
				// referme la fenêtre de la barre d'outil ckeditor'
				$('#editor_toolbar_dialog').dialog('close');
				// désactiver interception des click
				$('#wrapper').off('click.div_wikidable', 'a');
			}
			else { // focus sur ckeditor si autre instance ouverte
				for (var key in CKEDITOR.instances) {
					CKEDITOR.instances[key].focus();
				}
			}
		},
		
		_code_couleur_init: function () {
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
		}
	};
	
	$.fn.wikid_edit_mode_wrapper = function (options) {
		if (this.length) {
			return this.each(function () {
				var edit_mode_wrapper_instance = Object.create(edit_mode_wrapper_prototype);
				edit_mode_wrapper_instance.init(options, this);
				$(this).data('wikid_edit_mode_wrapper', edit_mode_wrapper_instance);//ou encore $.data(this, 'key', value)
			});
		}
	
	};
}(jQuery));
