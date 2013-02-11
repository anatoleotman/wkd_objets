//necessite jquery ui pour draggable()
(function ($) {
	var inline_edit_mode_wrapper_prototype = {
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			// cest le wrapper edit	
			this.$elem = $(elem);

			this.$elem_contenu_wikid = $('.contenu_wikid', $(elem));

			// hidden field pour connaitre la page servie initialement
			this.$elem_hidden_page_name = $('input[name="page_name"]', $(elem));
			// quel div dans le layout de la page : page ou footer.	
			this.contenu_wikidable_elem_ID = this.$elem_contenu_wikid.attr('id');
			this.$elem.addClass('wikid-editable');
			this._init_page_nom_data();
			this._code_couleur_init();
			this._build_bouton_edit();
			this._events_edit_mode_init();

			return this;
		},

		options: {
			on_update_callback: function (page_nom) {}
		},
		// une reference au div contenu ckeditable qui change à la navigation
		_get_elem_contenu_ckeditable: function () {
			return ($('.contenu_wikid > .contenu_ckeditable', this.$elem).length) ? $('.contenu_wikid', this.$elem).find('.contenu_ckeditable') : $('.contenu_wikid', this.$elem);
		},

/*destroy_plugin_instance: function () {
			
		},*/

		_init_page_nom_data: function () {
			// on doc.Ready on récupère le nom de la page affichée par le serveur
			//on utilise le champ caché pour specifier le nom de la page pour ce plugin
			this.$elem_contenu_wikid.data('page_nom', this.$elem_hidden_page_name.val());
			return this;
		},

		_build_bouton_edit: function () {
			var that = this;
			this.$bouton_edit_mode = $('<button>', {
				id: 'bouton_edit_mode_' + this.contenu_wikidable_elem_ID,
				value: 'Edit ' + this.contenu_wikidable_elem_ID,
				class: 'bouton_edit_mode'
			}).appendTo(this.$elem).button().css({
				'background': 'none',
				'background-color': this.string_couleur_target_rgba,
				'z-index': 2
			});
//			this.$bouton_edit_mode.on('mouseover', function () {
//				$('.ui-effects-transfer').css('background', that.string_couleur_target_rgba);
//				$(this).effect('transfer', {
//					to: that._get_elem_contenu_ckeditable(),
//					className: "ui_transfer_effect_tooltip"
//				}, 800);
//			});
			return this;
		},

		_events_edit_mode_init: function () {

			this.$elem.one('click.edit_mode', '#bouton_edit_mode_' + this.contenu_wikidable_elem_ID, $.proxy(this.handler_edit_mode_init, this));
			this.bouton_edit_transfer_effect_init();
			return this;
		},
		
		bouton_edit_transfer_effect_init: function () {
			var that = this;
			this.$bouton_edit_mode.one('mouseover.transfer_effect', function () {
//				$('.ui-effects-transfer').css('background', that.string_couleur_target_rgba);
				$(this).effect('transfer', {to: that._get_elem_contenu_ckeditable()}, 1000, function () {
					$.proxy(that.bouton_edit_transfer_effect_init(), that);
				});
				$('.ui-effects-transfer').css('background', that.string_couleur_target_rgba);
			});
		},

		handler_edit_mode_init: function (event) {
/*this.$wikid_form.load(	WIKIDGLOBALS.BASE_DIRECTORY + 
							"index.php/pages/edit_mode_init/" + 
							this.$elem_contenu_wikid.data('page_nom') + 
							'#wikid_input' );*/
			this.$bouton_edit_mode.off('mouseover.transfer_effect');
							
			$.ajax({
				url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/pages/edit_mode_inline_init/" + this.$elem_contenu_wikid.data('page_nom'),
				//.data('page_nom') c'est la clef de voute
				type: "get",
				context: this,
				dataType: "json",
				beforeSend: function () {
					this.$bouton_edit_mode.spin();
				},
				success: function (ans) {
					//this.$elem.append(ans); // on attache le wikid formulaire
					$(ans).css('display', 'none').appendTo(this.$elem);
					this.$wikid_options = $('#edit_mode_options_' + this.$elem_contenu_wikid.data('page_nom'), this.$elem);
					$('.edit_mode_options_buttonset', this.$wikid_options).buttonset(); // pour l'apparence des boutons'				
					this.$wikid_options.show('scale');
				},
				complete: function () {
					this.$bouton_edit_mode.spin(false);
					this.$bouton_edit_mode.off('mouseover.transfer_effect');
					this._init_ckeditor();
				}
			});
		},

		_init_ckeditor: function () {
			var that = this;
			var contenu_wikidable_elem_ID = this.$elem_contenu_wikid.attr('id'); // 'page' 'footer' par ex. 
			this.$elem.toggleClass('edit_mode_actif');


			// on s'assure de désactiver les liens cliquables
			$('#wrapper').on('click.div_wikidable', 'a', function (event) {
				event.preventDefault();
				event.stopPropagation();
			});
			//console.info(this._get_elem_contenu_ckeditable().html());
			
			this.$bouton_edit_mode.effect("transfer", {
				to: this._get_elem_contenu_ckeditable()
			}, 800, function () {
				// cacher le bouton edit_mode
				$(this).hide('scale');
				// create Ckeditor instance 
				that._get_elem_contenu_ckeditable().attr('contenteditable', 'true');
				CKEDITOR.inline(that._get_elem_contenu_ckeditable().attr('id'));
				var editor = CKEDITOR.instances[that._get_elem_contenu_ckeditable().attr('id')];
				editor.on('instanceReady', $.proxy(that._events_valid_page, that));
				editor.on('instanceReady', function () {
					this.focus();
				});
				editor.on('focus', function (e) {
					$('.cke_wrapper', that.$elem).css('background-color', that.string_couleur_target_rgba);
					$('button[name|=save]', that.$wikid_options).css({
						'background': 'none',
						'background-color': that.string_couleur_target_rgba
					});
				});
				editor.on('blur', function (e) {
					$('.cke_wrapper').css('background-color', 'transparent');
					$('.cke_wrapper', that.$elem).css('background-color', 'transparent');
					$('button[name|=save]', that.$wikid_options).css({
						'background': '',
						'background-color': ''
					});
				});
				editor.on('dialogShow', function (e) {
					$('.cke_dialog_body', 'body').css('background-color', that.string_couleur_target_rgba);
				});
					 // Get a CKEDITOR.dialog.contentDefinition object by its ID.
				var getById = function(array, id, recurse) {
					for (var i = 0, item; (item = array[i]); i++) {
						if (item.id == id) return item;
						if (recurse && item[recurse]) {
							var retval = getById(item[recurse], id, recurse);
							if (retval) return retval;
						}
					}
					return null;
				};
				// modify existing Link dialog
				CKEDITOR.on('dialogDefinition', function (ev) {
					if ((ev.editor != editor) || (ev.data.name != 'link')) return;

					// Overrides definition.
					var definition = ev.data.definition;
//					definition.onFocus = CKEDITOR.tools.override(definition.onFocus, function (original) {
//						return function () {
//							original.call(this);
//							if (this.getValueOf('info', 'linkType') == 'localPage') {
//								this.getContentElement('info', 'localPage_path').select();
//							}
//						};
//					});

					// Overrides linkType definition.
					var infoTab = definition.getContents('info');
					var content = getById(infoTab.elements, 'linkType');

					content.items.unshift(['Page interne', 'localPage']);
					content['default'] = 'localPage';
					infoTab.elements.push({
						type: 'vbox',
						id: 'localPageOptions',
						children: [{
							type: 'text',
							id: 'localPage_path',
							label: 'Page Wikid',
							required: true,
							setup: function (data) {
								if (data.localPage) this.setValue(data.localPage);
							},
							onLoad: function () {
								var $field = $(this.getElement().getChildren().getItem(1).getChild(0).getChild(0).$);
								
								$field.autocomplete({
									source: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/menu/get_pages_list/",
									position: { 
										my: 'left top',
										at: 'right top'
									},
									select: function (event, obj) {
										console.info(this);
										$(this).val(WIKIDGLOBALS.BASE_URL + 'index.php/sync/show/' + obj.item.value);
									},
									appendTo: $(this.getElement().$),
									create: function () {
										$(this).autocomplete('widget').addClass('cke_dialog_ui_input_select');
										$(this).autocomplete('search', ' ');
									}
								});
							}
						}]
					});
					content.items.unshift(['Fiche', 'localObject']);
					infoTab.elements.push({
						type: 'vbox',
						id: 'localObjectOptions',
						children: [{
							type: 'text',
							id: 'localObject_path',
							label: 'Fiche',
							required: true,
							setup: function (data) {
								if (data.localPage) this.setValue(data.localPage);
							},
							onLoad: function () {
								var $field = $(this.getElement().getChildren().getItem(1).getChild(0).getChild(0).$);
								
								$field.autocomplete({
									source: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/collection_objets/get_objects_from_every_collection/",
									position: { 
										my: 'left top',
										at: 'right top'
									},
									select: function (event, obj) {
										console.info(this);
										//$(this).val(WIKIDGLOBALS.BASE_URL + 'index.php/sync/show/' + obj.item.value);
									},
									appendTo: $(this.getElement().$),
									create: function () {
										$(this).autocomplete('widget').addClass('cke_dialog_ui_input_select');
										$(this).autocomplete('search', ' ');
									}
								});
							}
						}]
					});
					content.onChange = CKEDITOR.tools.override(content.onChange, function (original) {
						return function () {
							original.call(this);
							var dialog = this.getDialog();
							var element = dialog.getContentElement('info', 'localPageOptions').getElement().getParent().getParent();
							var element2 = dialog.getContentElement('info', 'localObjectOptions').getElement().getParent().getParent();
							
							
							if (this.getValue() == 'localPage') {
								element.show();
								element2.hide();
								if (editor.config.linkShowTargetTab) {
									dialog.showPage('target');
								}
								var uploadTab = dialog.definition.getContents('upload');
								if (uploadTab && !uploadTab.hidden) {
									dialog.hidePage('upload');
								}
							}  else if (this.getValue() == 'localObject') {
								element2.show();
								element.hide();
								if (editor.config.linkShowTargetTab) {
									dialog.showPage('target');
								}
								var uploadTab = dialog.definition.getContents('upload');
								if (uploadTab && !uploadTab.hidden) {
									dialog.hidePage('upload');
								}
							}
							
							else {
								element.hide();
								element2.hide();
							}
						};
					});
					content.setup = function (data) {
						if (!data.type || (data.type == 'url') && !data.url) {
							data.type = 'localPage';
						} else if (data.url && !data.url.protocol && data.url.url) {
//							if (path) {
//								data.type = 'localPage';
//								data.localPage_path = path;
//								delete data.url;
//							}
						}
						this.setValue(data.type);
					};
					content.commit = function (data) {
						data.type = this.getValue();
						
						if (data.type == 'localPage') {
							data.type = 'url';
							var dialog = this.getDialog();
							dialog.setValueOf('info', 'protocol', '');
							dialog.setValueOf('info', 'url', WIKIDGLOBALS.BASE_URL + 'index.php/sync/show/' + dialog.getValueOf('info', 'localPage_path'));
						}
						else if (data.type == 'localObject') {
							data.type = 'url';
							var dialog = this.getDialog();
							dialog.setValueOf('info', 'protocol', '');
							dialog.setValueOf('info', 'url', WIKIDGLOBALS.BASE_URL + 'index.php/sync/show/' + dialog.getValueOf('info', 'localObject_path'));
						}
					};
				});
			});
			$('.ui-effects-transfer').css('background', this.string_couleur_target_rgba);
		},

		_events_valid_page: function () {
			var that = this;
			
			this.$bouton_cancel = $('button[name|="cancel"]', this.$wikid_options);
			this.$bouton_submit_elem = $('button[type|="submit"]', this.$wikid_options);

			this.$bouton_cancel.one('click', $.proxy(this.handler_cancel_edit_mode, this));
			this.$bouton_submit_elem.one('click', $.proxy(this.handler_valid_page, this));

			return this;
		},

		handler_cancel_edit_mode: function (event) {
			// cacher les bouton
			$(event.currentTarget).button('widget').css('background-color', 'rgba(255, 2, 23, 0.4)');
			this._close_ckeditor();
		},


		handler_valid_page: function () {
			var that = this;
			var ajaxData = {};
			//ajaxData['contenu'] = CKEDITOR.instances[this._get_elem_contenu_ckeditable().attr('id')].getData();
			ajaxData['contenu'] = this._get_elem_contenu_ckeditable().html();
			ajaxData['nom_page'] = this.$wikid_options.find('input[name|="nom_page"]').val();
			ajaxData['collection_objets'] = (this.$wikid_options.find('input[name|="collection_objets"]').attr('checked')) ? 1 : 0;

			this._get_elem_contenu_ckeditable().effect("transfer", {
				to: this.$bouton_submit_elem
			}, 800, function () {
				$.ajax({
					url: WIKIDGLOBALS.BASE_DIRECTORY + 'index.php/pages/user_save_page_contenu/' + that.$elem_contenu_wikid.data('page_nom'),
					type: 'post',
					context: that,
					data: ajaxData,
					//extra data that should be submitted along with the form
					dataType: 'json',
					beforeSend: function () {
						this.$bouton_submit_elem.spin();
						console.info(CKEDITOR.instances[this._get_elem_contenu_ckeditable().attr('id')].getData());
						console.info(this._get_elem_contenu_ckeditable().html());
					},
					error: function () {
						alert('erreur serveur');
					},
					success: function (ans) {
						this._close_ckeditor();
					},
					complete: function () {
						this.$bouton_submit_elem.spin(false);
						// this.options.on_update_callback.call()
					}
				});

			});
			$('.ui-effects-transfer').css('background', this.string_couleur_target_rgba);

		},

		_close_ckeditor: function () {
			var that = this;
			// libérer les ressources et références
			var editor = CKEDITOR.instances[this._get_elem_contenu_ckeditable().attr('id')];
			editor.on('destroy', $.proxy(this.handler_destroy_ckeditor, this));
			editor.destroy(true);
			this._get_elem_contenu_ckeditable().attr('contenteditable', 'false');
			this.$bouton_cancel.empty();
			// poser un breakpoint faire le test pour voir ce que devient la reference
			this.$wikid_options.hide('scale', function () {
				$(this).remove();
			});
			// afficher le bouton edit_mode
			this.$bouton_edit_mode.show();


			this.$elem.toggleClass('edit_mode_actif');

			// pour la dernière instance de ckeditor
			if (!Object.keys(CKEDITOR.instances).length) {
				// désactiver interception des click
				$('#wrapper').off('click.div_wikidable', 'a');
			} else { // focus sur ckeditor si autre instance ouverte
				for (var key in CKEDITOR.instances) {
					CKEDITOR.instances[key].focus();
				}
			}
		},

		handler_destroy_ckeditor: function () {
			this._events_edit_mode_init();
			//console.info(this.$elem_contenu_wikid.data('page_nom'));
			//this.options.on_update_callback.call(this, this.$elem_contenu_wikid.data('page_nom'));
		},

		_code_couleur_init: function () {
			var random_color1 = Math.floor(Math.random() * 256);
			var random_color2 = Math.floor(Math.random() * 256);
			var random_color3 = Math.floor(Math.random() * 256);
			var random_color4 = Math.random();
			this.string_couleur_target_rgba = 'rgba(' + random_color1 + ',' + random_color2 + ',' + random_color3 + ',' + random_color4 + ')';
			return this;
		}
	};

	$.fn.wikid_inline_edit_mode_wrapper = function (options) {
		if (this.length) {
			return this.each(function () {
				var inline_edit_mode_wrapper_instance = Object.create(inline_edit_mode_wrapper_prototype);
				inline_edit_mode_wrapper_instance.init(options, this);
				$(this).data('wikid_edit_mode_wrapper', inline_edit_mode_wrapper_instance); //ou encore $.data(this, 'key', value)
			});
		}

	};
}(jQuery));
