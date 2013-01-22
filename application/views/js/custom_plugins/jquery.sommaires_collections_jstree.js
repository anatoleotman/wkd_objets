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
			
			this.eventify();
			//return this to chain/use the bridge with less code
			return this;
		},

		options: {
			on_refresh_callback : function () {}
		},
		
		_build_valid_tree_button: function (tree_elem) {
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
			this.$add_folder_bouton = $('<button>', {
				id: 'add_folder_bouton',
				value: 'Ajouter une catégorie'
			})
			.button()
			.insertBefore('#bouton_sommaire_collection');
			this.$elem.find('#bouton_sommaire_collection').html('Sauver sommaire');
			this.$elem.one('click.sommaire_jstree_mode', '#bouton_sommaire_collection', $.proxy(this.handler_valide_sommaire_jstree, this));
			this.$elem.on('click.sommaire_jstree_mode', '#add_folder_bouton', function () {
				$(tree_elem).jstree("create", null, "after", { "attr" : { "rel" : "categorie" }});
			});
			return this;
		},

		_init_jstree: function () {
			// il faudra commencer par désactiver les liens cliquables
			//this._build_valid_tree_button();
			var that = this;
			this.$elem
				.find('.sommaire_collection')
				.bind("move_node.jstree", function (e, data) {
				//console.info(data.rslt.o);
				})
				.bind("loaded.jstree", function (e, data) {
					$(this).jstree("open_all", -1, true);
					that._build_valid_tree_button(this);
				})
				.bind("create.jstree", function (e, data) {
					console.info(data.rslt.obj);
					console.info(data.rslt.obj.find('a').attr('href'));
				// on test attribut rel pour savoir si ce noeud est une categorie
					if (data.rslt.obj.attr('rel') === 'categorie') {
						data.rslt.obj.find('a').removeAttr('href');
					}
				})
			.jstree({
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
					"max_children"	: -2,
					"max_depth"	: -2,
					"valid_children": [ "categorie" ],
					"types": {
					// the default type
						"default": {
							"valid_children": "none",
							// Bound functions - you can bind any other function here (using boolean or function)
							//"select_node"	: true,
							//"open_node"	: true,
							//"close_node"	: true,
							"icon" : { 
								"image" : WIKIDGLOBALS.BASE_URL + "application/views/js//images/file.png"
							},
																										//"delete_node"	: true
						},
						"categorie": {
							"max_children"	: -1,
							"max_depth"	: -1,
							"valid_children": ["default","categorie"],
							"icon" : { 
								"image" : WIKIDGLOBALS.BASE_URL + "application/views/js//images/folder.png"
							}
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
								})
								.appendTo(obj)
								.keypress(function (event) {
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
			this.$elem.find('.sommaire_collection > ul').find('a').removeClass('trigger active open');
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
								expandSub : true
					});
				},
				complete: function () {
					this.eventify();
					this.$elem.find('#bouton_sommaire_collection').html('Modifier sommaire');
					this.$elem.find('#add_folder_bouton').remove();
					
				}
			});
			$('#wrapper').off('click.sommaire_jstree_mode', 'a');
			
		},
	
		eventify: function () { // ajouter le hover pour modifier l'apparence du pointeur et indiquer une action possible'
			this.$elem.one('click.sommaire_jstree_mode', '#bouton_sommaire_collection', $.proxy(this.handler_edit_mode, this));
			
			this.$elem.on('click.sommaire_jstree_mode', '#bouton_new_object', $.proxy(this.handler_new_object, this));
			this.$elem.on('click.sommaire_jstree_mode', '#bouton_edit_object', $.proxy(this.handler_edit_object, this));
			return this;
		},	
		
		handler_edit_mode: function (e) {
			this._init_jstree();
			$('#wrapper').on('click.sommaire_jstree_mode', 'a', function (event) {
				event.preventDefault();
				event.stopPropagation();
			});
		},
		
		handler_new_object: function () {
				window.location.hash = this.$elem.find('input[name="page_name"]').val() + '/new';
		},
		
		handler_edit_object: function () {
//			this.$elem.find('[contenteditable="true"]').ckeditor('inline');
			CKEDITOR.inlineAll();
		
		}
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
