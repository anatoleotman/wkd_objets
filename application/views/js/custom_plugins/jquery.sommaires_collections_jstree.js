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
			this.eventify();
			//return this to chain/use the bridge with less code
			return this;
		},

		options: {
			on_refresh_callback: function () {}
		},

		_init_buttons: function () {
			//var $buttons = this.$elem.find('button').button();
			//
			this.$elem.find("#bouton_sommaire_collection").button().css('background', this.string_couleur_target_rgba);
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

		handler_add_folder: function () {
			this.$sommaire_elem.jstree("create", null, "after", {
				"attr": {
					"rel": "categorie",
					"class": "categorie"
				},
				"data": "Nouvelle Catégorie"
			});
		},

		_init_sommaire_jstree: function () {
			// il faudra commencer par désactiver les liens cliquables
			var that = this;
			var $current_page_name = this.$elem.find('input[name="page_name"]').val();
			this.$sommaire_elem = this.$elem.find('#sommaire_collection_' + $current_page_name);
			// remove nestedaccordionplugin styles
			this.$sommaire_elem.find('ul').find('li a').removeAttr('style').removeClass('trigger last-child');
			// prépare les boutons
			this._build_sommaire_tree_buttons();
			this.$elem.find('#bouton_sommaire_collection').button("option", "label", "Sauver sommaire");
			this.$elem.one('click.sommaire_jstree_mode', '#bouton_sommaire_collection', $.proxy(this.handler_valide_sommaire_jstree, this));

			//this.$elem.find('.sommaire_collection_bouton').toggle();
			this.$sommaire_elem.bind("move_node.jstree", function (e, data) {
				//console.info(data.rslt.o);
			}).bind("loaded.jstree", function (e, data) {
				$(this).jstree("open_all", -1, true);
				$('.sommaire_collection_bouton').toggle();
			}).bind("create.jstree", function (e, data) {
				// on test attribut rel pour savoir si ce noeud est une categorie
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
						},
						"create": {
							"label": "Creer un noeud",
							"action": function (obj) {
								this.create(obj, "after");
							}
						},
						*/
						"lien vers": {
							label: "Modifier le lien",
							action: function (obj) {
								var that = this;
								var $lien = obj.children('a');
								this.close_node(obj);
								//var obj_closure = obj;
								var $input = $('<input>', {
									value: $lien.attr('href').split('#')[1]
								});
								var valide_handler = function () {
										var $trimmed = $.trim($input.val());
										$lien.attr('href', '#' + $trimmed);
										$input.hide('scale', function () {
											$(this).autocomplete('destroy').remove();
											that.open_node(obj);
										});
									};

								$input.autocomplete({
									source: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/menu/get_pages_list/",
									position: {
										my: 'left top',
										at: 'right top'
									},
									change: valide_handler,
									create: function () {
										$(this).autocomplete('search', ['']);
									}
								}).appendTo(obj).keypress(function (event) {
									if (event.which === 13) {
										valide_handler();
									}
								});
							}
						}
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

		handler_valide_sommaire_jstree: function (e) {
			//this.$elem.find('.sommaire_collection.jstree').jstree('destroy');
			//var that = this;
			this.$elem.find('.sommaire_collection.jstree').jstree('destroy');
			this.$elem.find('.sommaire_collection > ul').find('ins').remove();
			this.$elem.find('.sommaire_collection > ul').find('li').removeAttr('id style').removeClass();
			this.$elem.find('.sommaire_collection > ul').find('ul').removeAttr('style').removeClass();
			this.$elem.find('.sommaire_collection > ul').find('a').removeAttr('style').removeClass('trigger active open');
			$.ajax({
				url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/collection_objets/user_valide_collection_obj_sommaire/",
				type: "POST",
				beforeSend: function () {

					// nettoyer la liste des ins ajoutés par jstree
				},
				data: {
					page_nom: this.$elem.find('input[name="page_name"]').val(),
					sommaire_collection: this.$elem.find('.sommaire_collection > ul ').html()
				},
				dataType: "json",
				context: this,
				success: function (ans) {
					this.$elem.find('#sommaire_collection_' + ans.page_nom).accordion({
						initShow: '#current',
						activeLink: true,
						expandSub: true
					});
				},
				complete: function () {
					this.eventify();
					this.$elem.find('#bouton_sommaire_collection').button("option", "label", "Modifier");
					$('.sommaire_collection_bouton').remove();
				}
			});
			$('#wrapper').off('click.sommaire_jstree_mode', 'a');

		},


		handler_sommaire_edit_mode: function (e) {
			this._init_sommaire_jstree();
			$('#wrapper').on('click.sommaire_jstree_mode', 'a', function (event) {
				event.preventDefault();
				event.stopPropagation();
			});
		},

		handler_new_object: function () {
			var that = this;
			var $current_page_name = $('input[name="page_name"]', this.$elem).val();
			var $new_obj_elem = $('<div>', {
				id: 'new_object',
				style: 'display:none'
			}).load(WIKIDGLOBALS.BASE_DIRECTORY + "index.php/collection_objets/display_new_object_template/" + $current_page_name).appendTo(this.$elem);

			$new_obj_elem.show('slide', {}, "easeOutQuint", function () {
				that.ajax_form_new_object(this);
			});
		},

		ajax_form_new_object: function (elem) {
			$(elem).find('#new_object_form').validate({
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
									alert('une entrée a été ajoutée au sommaire')
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
			var $current_page_name = this.$elem.find('input[name="page_name"]').val();
			var $objet_elem = this.$elem.find('#objet_' + $current_page_name);
			var $titre_elem = $objet_elem.find('.objet_titre');
			
			var $contenu_elem = $objet_elem.find('.objet_contenu');
			
			var $button_edit_object_elem = $('#bouton_edit_objet'); 
			$button_edit_object_elem.effect("transfer", { to: $titre_elem  }, 800, function () {
				$titre_elem.attr('contenteditable', 'true');
				$titre_elem.on("keypress.edit_object", function (e) {
					if (e.keyCode === 13) {
						e.preventDefault();
					}
				});
			});
			$button_edit_object_elem.effect("transfer", { to: $contenu_elem  }, 1200, function () {
				$contenu_elem.attr('contenteditable', 'true');
				CKEDITOR.inline($contenu_elem.attr('id'));
				$button_edit_object_elem.button("option", "label", "Enregistrer");
			});
			
			
			
		// on clique pour valider les modif d'un objet'	
			$button_edit_object_elem.on('click.edit_object', function () {
				$.ajax({
					url: WIKIDGLOBALS.BASE_DIRECTORY + 'index.php/collection_objets/user_save_object',
					type: 'post',
					data: {
						page: $current_page_name,
						titre: $titre_elem.html(),
						initial_index: $objet_elem.find('input[name="objet_index_initial"]').val(),
						//contenu: $contenu_elem.html()
						contenu: CKEDITOR.instances[$contenu_elem.attr('id')].getData()
					},
					dataType: 'json',
					context: this,
					beforeSend: function () {
						$(this).spin();
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
						.appendTo($objet_elem);
						
						$titre_elem.effect("transfer", { to: $button_edit_object_elem  }, 800);
						$contenu_elem.delay(800).effect("transfer", { to: $button_edit_object_elem  }, 1200, function () {
							$save_object_validation_message
								.show('slide')
								.delay(1500)
								.hide('slide', function () {
									$(this).remove();
								});
							
							if (ans.validation_success) {
								$titre_elem.attr('contenteditable', 'false');
								$titre_elem.off('keypress.edit_object');
								$contenu_elem.attr('contenteditable', 'false');
								CKEDITOR.instances[$contenu_elem.attr('id')].destroy(true);
								$button_edit_object_elem
									.button("option", "label", "Modifier")
									.off('click.edit_object')
									.one('click', $.proxy(that.handler_edit_object, that));
							}
							else {
							
							}
						});
					},
					complete: function () {
						$(this).spin(false);
						
						
						
					}
				});
			});
			//$objet_elem.find('.objet_contenu').ckeditor('inline');
			//CKEDITOR.inlineAll();
		},

		handler_view_collection: function () {
			var $current_page_name = this.$elem.find('input[name="page_name"]').val();
			var $collection = $('<div>', {
				id: 'view_collection' + $current_page_name,
				style: 'display:none'
			}).load(WIKIDGLOBALS.BASE_DIRECTORY + "index.php/collection_objets/display_collection/" + $current_page_name).appendTo(this.$elem).show('slide', function () {
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
						},
						"create": {
							"label": "Creer un noeud",
							"action": function (obj) {
								this.create(obj, "after");
							}
						},
						*/
							"lien vers": {
								label: "Modifier le lien",
								action: function (obj) {
									var that = this;
									var $lien = obj.children('a');
									this.close_node(obj);
									//var obj_closure = obj;
									var $input = $('<input>', {
										value: $lien.attr('href').split('#')[1]
									});
									var valide_handler = function () {
											var $trimmed = $.trim($input.val());
											$lien.attr('href', '#' + $trimmed);
											$input.hide('scale', function () {
												$(this).autocomplete('destroy').remove();
												that.open_node(obj);
											});
										};

									$input.autocomplete({
										source: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/menu/get_pages_list/",
										position: {
											my: 'left top',
											at: 'right top'
										},
										change: valide_handler,
										create: function () {
											$(this).autocomplete('search', ['']);
										}
									}).appendTo(obj).keypress(function (event) {
										if (event.which === 13) {
											valide_handler();
										}
									});
								}
							}
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
		eventify: function () { // ajouter le hover pour modifier l'apparence du pointeur et indiquer une action possible'
			this.$elem.one('click.sommaire_jstree_mode', '#bouton_sommaire_collection', $.proxy(this.handler_sommaire_edit_mode, this));

			this.$elem.one('click.sommaire_jstree_mode', '#bouton_edit_objet', $.proxy(this.handler_edit_object, this));

			return this;
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
