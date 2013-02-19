(function ($) {
	'use strict';

	var jstree_collections_objets_sommaires_prototype = {
		init: function (options, elem) {
			'use strict';
			// Mix in the passed in options with the default options
			this.options = $.extend({}, this.options, options);
			// Save the element reference, both as a jQuery reference and a normal reference
			this.elem = elem;
			this.$elem = $(elem);

			this.$elem.addClass('wkd_obj_collec_jstree');
			this._code_couleur_init()._init_buttons();
			//this._init_buttons();
			this.events_sommaire_edit();
//			this.bouton_objet_edit_transfer_effect_init();
			this.events_object_edit();
			//return this to chain/use the bridge with less code
			return this;
		},

		options: {
			on_refresh_callback: function () {}
		},

		_init_buttons: function () {
			//var $buttons = this.$elem.find('button').button();
			//
			this.$elem.find("#bouton_sommaire_collection").button();
			this.$elem.find("#bouton_sommaire_collection").button('widget').css('background', this.string_couleur_target_rgba);
			this.$elem.find('#bouton_edit_objet').button();

			return this;
		},

		_code_couleur_init: function () {
			var random_color1 = Math.floor(Math.random() * 256);
			var random_color2 = Math.floor(Math.random() * 256);
			var random_color3 = Math.floor(Math.random() * 256);
			var random_color4 = Math.random();
			this.string_couleur_target_rgba = 'rgba(' + random_color1 + ',' + random_color2 + ',' + random_color3 + ',' + random_color4 + ')';
			return this;
		},
		
		events_sommaire_edit: function () { // ajouter le hover pour modifier l'apparence du pointeur et indiquer une action possible'
			this.$elem.one('click.sommaire_jstree_mode', '#bouton_sommaire_collection', $.proxy(this.handler_sommaire_edit_mode, this));
			this.bouton_sommaire_edit_transfer_effect_init();
			this._bouton_edit_sommaire_position_effect_init();		
			return this;
		},
		
		bouton_sommaire_edit_transfer_effect_init: function () {
			var that = this;
			this.$elem.one('mouseover.sommaire_transfer_effect', '#bouton_sommaire_collection', function (e) {			
				var $bouton_sommaire_collection = that.$elem.find('#bouton_sommaire_collection');
				var color = $bouton_sommaire_collection.button('widget').css('background-color');
				var color_string = $bouton_sommaire_collection.css('background-color');
				$("#custom_style").html("<style type='text/css'> .transfer_effect_custom { background:" + color + ";} </style>");
				 $bouton_sommaire_collection.stop('true').effect('transfer', {to: that.$elem.find('.sommaire_collection').find('ul'), className: "transfer_effect_custom"}, 1000, function () {
					$(this).stop('true');
					$.proxy(that.bouton_sommaire_edit_transfer_effect_init(), that);
				});
//				$('.ui-effects-transfer').css('background', color);
				
			});
			return this;
		},
		
		_bouton_edit_sommaire_position_effect_init: function () {
			var that = this;
			this.$elem.on('mousemove.bouton_sommaire_position_effect', '.sommaire_collection', function (mouseOver_event) {
				var parentOffset = that.$elem.find('.sommaire_collection').offset();
				var relX = mouseOver_event.pageX - parentOffset.left - 25;
				var relY = mouseOver_event.pageY - parentOffset.top;
				var $target_elem = $(mouseOver_event.target);
				$('#bouton_sommaire_collection')
					.button('widget')
					.stop()
					.animate({left: relX.toString()+"px"}, 'slow');
			});
			return this;
		},
		
		events_object_edit: function () {
			var that = this;
			this.$current_page_name = this.$elem.find('input[name="page_name"]').val();
			this.$objet_elem = this.$elem.find('#objet_' + this.$current_page_name);
			this.$button_edit_object_elem = $('#bouton_edit_objet'); 
			
			this.bouton_objet_edit_transfer_effect_init();
			this._bouton_edit_object_position_effect_init();
			this.$elem.one('click.sommaire_jstree_mode', '#bouton_edit_objet', $.proxy(this.handler_edit_object, this));
		},
		
		bouton_objet_edit_transfer_effect_init: function () {
			var that = this;
		
			this.$elem.one('mouseover.transfer_effect', '#bouton_edit_objet', function (e) {
				
				var color_string = $('#bouton_edit_objet').css('background-color');
				$("#custom_style").html("<style type='text/css'> .transfer_effect_custom { background:" + color_string + ";} </style>");
				$(e.target).effect('transfer', {to: that.$elem.find('.objet_titre'), className: "transfer_effect_custom"}, 600, function () {
					
					$(e.target).effect('transfer', {to: that.$elem.find('.objet_contenu'), className: "transfer_effect_custom"}, 800, function () {
						$(this).stop('true');
						$.proxy(that.bouton_objet_edit_transfer_effect_init(), that);
					});
					//$('.ui-effects-transfer').css('background', color_string);
				});
				//$('.ui-effects-transfer').css('background', color_string);
				
				
			});
		},
		
		_bouton_edit_object_position_effect_init: function () {
			var that = this;
			this.$elem.on('mousemove.bouton_object_position_effect', '.objet', function (mouseOver_event) {
				var parentOffset = that.$elem.find('.objet').offset();
				var relX = mouseOver_event.pageX - parentOffset.left - 25;
				var relY = mouseOver_event.pageY - parentOffset.top;
				var $target_elem = $(mouseOver_event.target);
				$('#bouton_edit_objet')
					.button('widget')
					.stop()
					.animate({left: relX.toString()+"px"}, 'slow');
			});
			return this;
		},
		
		handler_sommaire_edit_mode: function (e) {
			var that = this;
			
			$('#wrapper').on('click.sommaire_jstree_mode', 'a', function (event) {
					event.preventDefault();
					event.stopPropagation();
			});
			
			this.$current_page_name = this.$elem.find('input[name="page_name"]').val();
			this.$sommaire_elem = this.$elem.find('#sommaire_collection_' + this.$current_page_name);
			this.$elem.find('#bouton_sommaire_collection').stop('true').effect("transfer", { to: this.$sommaire_elem.find('ul'), className: "transfer_effect_custom"  }, 1000, function () {
				
				$.proxy(that._init_sommaire_jstree(), that);
				
			});
		},
		
		_init_sommaire_jstree: function () {
			// il faudra commencer par désactiver les liens cliquables
			var that = this;
			that.$elem.off('.sommaire_transfer_effect');
			that.$elem.off('.bouton_sommaire_position_effect');
			
			// remove nestedaccordionplugin styles
			this.$sommaire_elem.find('ul').find('li a').removeAttr('style').removeClass('trigger last-child');
			// prépare les boutons
			this._build_sommaire_tree_buttons();
			this.$elem.find('#bouton_sommaire_collection').button("option", "label", "Sauver sommaire");
			this.$elem.find('#bouton_sommaire_collection')
					//.button('widget')
					.stop()
					.animate({left: this.$sommaire_elem.parent().offset().left.toString()+"px"}, 'fast');
			this.$elem.one('click.sommaire_jstree_mode', '#bouton_sommaire_collection', $.proxy(this.handler_valide_sommaire_jstree, this));

			this.$sommaire_elem.bind("move_node.jstree", function (e, data) {
				//console.info(data.rslt.o);
			}).bind("loaded.jstree", function (e, data) {
				$(this).jstree("open_all", -1, true);
				$('.sommaire_collection_bouton').toggle();
			}).bind("create.jstree", function (e, data) {
				// on test attribut rel pour savoir si ce noeud est une categorie
				$(data.rslt.obj).effect('highlight', {color: that.string_couleur_target_rgba}, 1000);
				if (data.rslt.obj.attr('rel') === 'categorie') {
					data.rslt.obj.find('a').removeAttr('href');
				}
			}).jstree({
				"ui": {
					"select_limit": -1,
					"initially_select": []
				},
				"core": {},
				//				"themes": {
				//					"theme": "default",
				//					"dots": true	,
				//					"icons": true
				//				},
				"html_data": {},
				"types": {
					"max_children": -2,
					"max_depth": -2,
					"valid_children": ["categorie", "link"],
					"types": {
						// the default type
						"default": {
							"valid_children": "none",
							// Bound functions - you can bind any other function here (using boolean or function)
							//"select_node"	: true,
							//"open_node"	: true,
							//"close_node"	: true,
//							"icon": {
//								"image": WIKIDGLOBALS.BASE_URL + "application/views/js//images/file.png"
//							},
							//"delete_node"	: true
						},
						"categorie": {
							"max_children": -1,
							"max_depth": -1,
							"valid_children": ["default", "categorie", "link"],
//							"icon": {
//								"image": WIKIDGLOBALS.BASE_URL + "application/views/js//images/folder.png"
//							}
						},
						"link": {
							"max_children": -2,
							"max_depth": -2,
							"valid_children": "none",
//							"icon": {
//								"image": WIKIDGLOBALS.BASE_URL + "application/views/js//images/file.png"
//							},
						}

					}
				},
				"contextmenu": {
					"items": {
/*
						"info": {
							"label": "infos",
							"action": function (obj) { //this.rename(obj);
								console.info(this._get_parent(obj));
							}
						},
						*/
						"create": false,
						"rename": false
						
					}
				},
				"crrm": {
					//					"move": {
					//						"check_move": function (move_object) {
					//							var p = this._get_parent(move_object.cr);
					//							var pp = move_object.cr;
					//							var child = this._get_children(move_object.o);
					//							//console.info(child.length);
					//							if (p === -1 && child.length === 0) {return true};
					//							if (pp === -1) {return true};
					//						}
					//					}
				},


				"plugins": ["themeroller", "html_data", "ui", "crrm", "dnd", "contextmenu", "types"]
			});
		},
		
		_build_sommaire_tree_buttons: function () {
			//			var $bouton_edit_mode = $('<button>', {
			//					id: 'bouton_valide_sommaire',
			//					value: 'valide Sommaire',
			//					class: 'bouton_valide_sommaire'
			//				})	
			//				.button()
			//				.css({
			//					'background': 'none', 
			//					'background-color': this.string_couleur_target_rgba,
			//					'z-index': 2
			//				});
			var random_color1 = Math.floor(Math.random() * 256);
			var random_color2 = Math.floor(Math.random() * 256);
			var random_color3 = Math.floor(Math.random() * 256);
			var random_color4 = Math.random() * 0.5;
			var random_color5 = Math.random() * 0.5;
			var random_color6 = Math.random() * 0.5;
			var string_couleur_target_rgba = 'rgba(' + random_color1 + ',' + random_color2 + ',' + random_color3 + ',' + random_color4 + ')';
			var string_couleur_target_rgba2 = 'rgba(' + random_color1 + ',' + random_color2 + ',' + random_color3 + ',' + random_color5 + ')';
			var string_couleur_target_rgba3 = 'rgba(' + random_color1 + ',' + random_color2 + ',' + random_color3 + ',' + random_color6 + ')';
			this.$add_folder_bouton = $('<button>', {
				id: 'add_folder_bouton',
				html: 'Ajouter une catégorie',
				'class': 'sommaire_collection_bouton',
				style: 'background:' + string_couleur_target_rgba
			});
			this.$add_object_bouton = $('<button>', {
				id: 'bouton_new_object',
				html: 'Nouveau',
				'class': 'sommaire_collection_bouton',
				style: 'background:' + string_couleur_target_rgba2
			});
			this.$view_collection_bouton = $('<button>', {
				id: 'view_collection_bouton',
				html: 'Voir la liste entière',
				'class': 'sommaire_collection_bouton',
				style: 'background:' + string_couleur_target_rgba3
			});

			// construire les boutons 	
			$('#buttonset_sommaire_collection').append(this.$add_folder_bouton).append(this.$add_object_bouton).append(this.$view_collection_bouton).buttonset();
			$('.sommaire_collection_bouton').css('display', 'none');

			// attacher les événements
			this.$elem.on('click.sommaire_jstree_mode', '#bouton_new_object', $.proxy(this.handler_new_object, this));


			this.$elem.on('click.sommaire_jstree_mode', '#add_folder_bouton', $.proxy(this.handler_add_folder, this));
			this.$elem.one('click.sommaire_jstree_mode', '#view_collection_bouton', $.proxy(this.handler_view_collection, this));

			return this;
		},
		
		handler_valide_sommaire_jstree: function (e) {
			this._destroy_sommaire_jstree();
			this._save_sommaire_ul();
			$('#wrapper').off('click.sommaire_jstree_mode', 'a');

		},

		handler_add_folder: function () {
			this.$sommaire_elem.jstree("create", null, "after", {
				"attr": {
					"rel": "categorie",
					"class": "categorie"
				},
				"data": "Nouvelle Catégorie"
			});
		},
		
		_destroy_sommaire_jstree: function () {
			var that = this;
			var $tree_elem = this.$elem.find('.sommaire_collection.jstree');
			
			$tree_elem.on('destroy.jstree', function () {
				that.$elem.find('#sommaire_collection_' + that.$elem.find('input[name="page_name"]').val()).accordion({
						initShow: '#current',
						activeLink: true,
						expandSub: true
				});
			});	
			$tree_elem.jstree('destroy');
		},
		
		_save_sommaire_ul: function () {
		// clean classes : destroy accordion plugin
		// nettoyer la liste des ins ajoutés par jstree
			this.$elem.find('.sommaire_collection > ul').find('ins').remove();
			this.$elem.find('.sommaire_collection > ul').find('li').removeAttr('id style').removeClass();
			this.$elem.find('.sommaire_collection > ul').find('ul').removeAttr('style').removeClass();
			this.$elem.find('.sommaire_collection > ul').find('a').removeAttr('style').removeClass('trigger active open');
			$.ajax({
				url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/collection_objets/user_valide_collection_obj_sommaire/",
				type: "POST",
				data: {
					page_nom: this.$elem.find('input[name="page_name"]').val(),
					sommaire_collection: this.$elem.find('.sommaire_collection > ul ').html()
				},
				dataType: "json",
				context: this,
				success: function (ans) {
				},
				complete: function () {
					this.events_sommaire_edit();
					this.$elem.find('#bouton_sommaire_collection').button("option", "label", "Modifier collection");
					$('.sommaire_collection_bouton').remove();
				}
			});
		},
		
		_clone_save_sommaire_ul: function ($sommaire_elem) {
			// nettoyer la liste des ins ajoutés par jstree
			
			//var $clone_sommaire_elem = this.$elem.find('.sommaire_collection > ul ').clone();
			var $clone_sommaire_elem = $sommaire_elem.clone();
			$clone_sommaire_elem.find('ins').remove();
			$clone_sommaire_elem.find('li').removeAttr('id style').removeClass();
			$clone_sommaire_elem.find('ul').removeAttr('style').removeClass();
			$clone_sommaire_elem.find('a').removeAttr('style').removeClass('trigger active open');
			$.ajax({
				url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/collection_objets/user_valide_collection_obj_sommaire/",
				type: "POST",
				data: {
					page_nom: this.$elem.find('input[name="page_name"]').val(),
					sommaire_collection: $clone_sommaire_elem.find('ul').html()
				},
				dataType: "json",
				context: this,
				success: function (ans) {
				
				},
				complete: function () {
					$clone_sommaire_elem.remove();
				}
			});
		},

		handler_new_object: function () {
			var that = this;
			var $current_page_name = $('input[name="page_name"]', this.$elem).val();
			var $new_obj_elem = $('<div>', {
				id: 'new_object'
				//style: 'display:none'
			})
				.load(WIKIDGLOBALS.BASE_DIRECTORY + "index.php/collection_objets/display_new_object_template/" + $current_page_name, function () {
				})
				.appendTo(this.$elem);
				$('#new_object').position({
							my: "top left",
							at: "bottom right",
							of: $('#bouton_new_object').button('widget'),
							using: function (css, calc) {
								$('#new_object').animate(css, 200, "linear");
							}
				});
				that._ajax_form_new_object(this);
						
		},

		_ajax_form_new_object: function (elem) {
			$('#new_object_form').validate({
				submitHandler: function (form) {
					$(form).ajaxSubmit({
						target: $(form).find('p'),
						//type: 'POST',
						context: form,
						dataType: 'json',
						beforeSend: function () {
							$(this).spin();
						},
						error: function () {
							alert('erreur serveur / reessayer');
						},
						success: function (ans) {
							if (ans.success) {
								window.location.hash = ans.collection_page_nom + '/' + ans.new_obj_url_index;
								$('#sommaire_collection_' + ans.collection_page_nom).jstree("create", null, "after", {
									"attr": {
										"rel": "link"
									},
									"data": {
										"title": ans.new_obj_titre,
										"attr": {
											"class": "link_obj_collection",
											"href": WIKIDGLOBALS.BASE_URL + "index.php/sync/show/" + ans.collection_page_nom + "/" + ans.new_obj_url_index
										}
									}
								}, function () {
									//alert('une entrée a été ajoutée au sommaire')
								}, true);
								$(this).parent().remove();

							} else {
								alert('cette fiche existe déjà');
							}
						},
						complete: function () {
							$(this).spin(false);
							// this.options.on_update_callback.call()
						}
					});
				}
			});



		},

		handler_edit_object: function () {
			var that = this;
			this.$elem.off('.transfer_effect');
			this.$elem.off('.bouton_object_position_effect');
			// on s'assure de désactiver les liens cliquables
			$('#wrapper').on('click.sommaire_collection', 'a', function (event) {
				event.preventDefault();
				event.stopPropagation();
			});
			$('.accordion').find('a').on('click.sommaire_collection', function (event) {
				event.preventDefault();
				event.stopImmediatePropagation();
			});
			
			this.$current_page_name = this.$elem.find('input[name="page_name"]').val();
			this.$objet_elem = this.$elem.find('#objet_' + this.$current_page_name);
			this.$titre_elem = this.$objet_elem.find('.objet_titre');
			
			this.$contenu_elem = this.$objet_elem.find('.objet_contenu');
			
			this.$button_edit_object_elem = $('#bouton_edit_objet'); 
			this.$button_edit_object_elem.effect("transfer", {to: that.$titre_elem, className:'transfer_effect_custom'}, 800, function () {
				that.$titre_elem.attr('contenteditable', 'true');
				that.$titre_elem.on("keypress.edit_object", function (e) {
					if (e.keyCode === 13) {
						e.preventDefault();
					}
				});
			});
			
			
			this.$button_edit_object_elem.effect("transfer", { to: that.$contenu_elem, className:'transfer_effect_custom'  }, 1200, function () {				
				$(this).stop('true');
				that.$contenu_elem.attr('contenteditable', 'true');
				CKEDITOR.inline(that.$contenu_elem.attr('id'), {
					toolbarGroups: [
						{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
						{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
						{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
						{ name: 'links' },
						{ name: 'insert' },
						{ name: 'forms' },
						{ name: 'tools' },
						{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
						{ name: 'others' },
						'/',
						{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
						{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
						{ name: 'styles' },
						{ name: 'colors' },
						{ name: 'about' }
					],
					extraPlugins: 'sourcearea,oembed,tableresize',
					//config.toolbar = [['oembed']];
					oembed_WrapperClass: 'embededContent',
					oembed_maxWidth: '100',
					oembed_maxHeight: '',
					filebrowserBrowseUrl: WIKIDGLOBALS.BASE_DIRECTORY + 'application/third_party/ckeditor/filemanager/index.html'

				}	// NOTE: Remember to leave 'toolbar' property with the default value (null).
				);
				var editor = CKEDITOR.instances[that.$contenu_elem.attr('id')];
				editor.on('instanceReady', function () {
					// attache le handler cliquer pour valider les modif d'un objet'	
					that.$button_edit_object_elem.one('click.edit_object', $.proxy(that.handler_user_save_object, that));
					
				});
				
				that.$button_edit_object_elem.button("option", "label", "Enregistrer");
				
			});
		},
		
		handler_user_save_object: function () {
			var that = this;
			var last_url_index = this.$objet_elem.find('input[name="url_index"]').val();
			$.ajax({
				url: WIKIDGLOBALS.BASE_DIRECTORY + 'index.php/collection_objets/user_save_object',
				type: 'post',
				data: {
					sommaire_page: that.$current_page_name,
					titre: that.$titre_elem.html(),
					initial_index: that.$objet_elem.find('input[name="objet_index_initial"]').val(),
					//contenu: $contenu_elem.html()
					//url_index
					contenu: CKEDITOR.instances[that.$contenu_elem.attr('id')].getData()
				},
				dataType: 'json',
				context: this,
				beforeSend: function () {
					this.$button_edit_object_elem.spin();
				},
				error: function () {
					alert('erreur serveur / reessayer');
				},
				success: function (ans) {
					var $save_object_validation_message = $('<div>', {
						id: 'save_object_validation_message',
						style: 'display:none'
					})
					.html(ans.validation_message)
					.appendTo(this.$objet_elem);
					
					var color_string = this.$button_edit_object_elem.css('background-color');
					$("#custom_style").html("<style type='text/css'> .transfer_effect_custom { background:" + color_string + ";} </style>");
					this.$titre_elem.effect("transfer", { to: this.$button_edit_object_elem, className:'transfer_effect_custom'  }, 800);
					this.$contenu_elem.delay(800).effect("transfer", { to: that.$button_edit_object_elem, className:'transfer_effect_custom'  }, 1200, function () {
						$save_object_validation_message
							.show('slide')
							.delay(1500)
							.hide('slide', function () {
								$(this).remove();
								if (ans.validation_success) {
									that.$titre_elem.attr('contenteditable', 'false');
									that.$titre_elem.off('keypress.edit_object');
									that.$contenu_elem.attr('contenteditable', 'false');
									var editor = CKEDITOR.instances[that.$contenu_elem.attr('id')];
									$('#wrapper').off('click.sommaire_collection', 'a');
									$('.accordion').find('a').off('click.sommaire_collection');
								// changement de nom : répercuter le changement dans le sommaire.
									if (ans.url_index !== last_url_index) {
										var $sommaire_elem = that.$elem.find('#sommaire_collection_' + that.$current_page_name);
										//console.info($sommaire_elem);
										$sommaire_elem.find("a[href$='" + last_url_index + "']")
											.html(ans.titre)
											.attr('href', WIKIDGLOBALS.BASE_URL + "index.php/sync/show/" + ans.page_nom + "/" + ans.url_index);
										that._clone_save_sommaire_ul($sommaire_elem);
										
										
									}
							
									editor.on('destroy', function () {
										
										that.$button_edit_object_elem
											.button("option", "label", "");
										that.$elem.off('.transfer_effect');
										that.events_object_edit();
									});
									editor.destroy(true);
								}
								else {
							// validation ratée :: try again
								$('#bouton_edit_objet')
									.one('click', $.proxy(that.handler_user_save_object, that));
								}
							});
					});
				},
				complete: function () {
					this.$button_edit_object_elem.spin(false);
				}
			});
		},

		handler_view_collection: function () {
			var $current_page_name = this.$elem.find('input[name="page_name"]').val();
			var $collection = $('<div>', {
				id: 'view_collection' + $current_page_name,
				style: 'display:none'
			}).load(WIKIDGLOBALS.BASE_DIRECTORY + "index.php/collection_objets/display_collection/" + $current_page_name).appendTo(this.$elem).show('slide', function () {
				$(this).find('li').attr('rel', 'link');
				$(this).jstree({
					"ui": {
						"select_limit": -1,
						"initially_select": []
					},
					"core": {},
					//				"themes": {
					//					"theme": "default",
					//					"dots": true	,
					//					"icons": true
					//				},
					"html_data": {},
					"types": {
						"max_children": -2,
						"max_depth": -2,
						"valid_children": ["categorie", "link"],
						"types": {
							// the default type
							"default": {
								"valid_children": "none",
								// Bound functions - you can bind any other function here (using boolean or function)
								//"select_node"	: true,
								//"open_node"	: true,
								//"close_node"	: true,
								"icon": {
									"image": WIKIDGLOBALS.BASE_URL + "application/views/js//images/file.png"
								},
								//"delete_node"	: true
							},
							"categorie": {
								"max_children": -1,
								"max_depth": -1,
								"valid_children": ["default", "categorie", "link"],
								"icon": {
									"image": WIKIDGLOBALS.BASE_URL + "application/views/js//images/folder.png"
								}
							},
							"link": {
								"max_children": -2,
								"max_depth": -2,
								"valid_children": "none",
								"icon": {
									"image": WIKIDGLOBALS.BASE_URL + "application/views/js//images/file.png"
								},
							}

						}
					},
					"contextmenu": {
						"items": {
/*
						"info": {
							"label": "infos",
							"action": function (obj) { //this.rename(obj);
								console.info(this._get_parent(obj));
							}
						},*/
						"create": false,
						"rename": false,
						"delete": false
							
						}
					},
					"crrm": {
						//					"move": {
						//						"check_move": function (move_object) {
						//							var p = this._get_parent(move_object.cr);
						//							var pp = move_object.cr;
						//							var child = this._get_children(move_object.o);
						//							//console.info(child.length);
						//							if (p === -1 && child.length === 0) {return true};
						//							if (pp === -1) {return true};
						//						}
						//					}
					},
					"plugins": ["themeroller", "html_data", "ui", "crrm", "dnd", "contextmenu", "types"]
				})
			});
		},
		
	};

	$.fn.jstree_sommaires_collections_objets = function (options) {
		if (this.length) {
			return this.each(function () {
				// Create a new object via the Prototypal Object.create
				var jstree_collections_sommaires = Object.create(jstree_collections_objets_sommaires_prototype);
				// Run the initialization function
				jstree_collections_sommaires.init(options, this); // `this` refers to the element	 
				// Save the instance of the object in the element's data store
				$.data(this, 'jstree_sommaires_collections_objets', jstree_collections_sommaires);
			});
		}

	};
}(jQuery));
