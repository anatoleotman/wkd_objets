//l'objet créé lors d'un appel du plugin jstree_menu_wikid0 sur un wrapper/cadre du conteneur menu'
(function ($) {
	'use strict';
	
	var Jstree_menu_wikid_prototype = {
		init: function (options, elem) {
			'use strict';
			// Mix in the passed in options with the default options
			this.options = $.extend({}, this.options, options);
			// Save the element reference, both as a jQuery reference and a normal reference
			this.elem = elem;
			this.$elem = $(elem);
			this.$elem_menu = $('#menu', elem);
			//build the initial DOM structure
			this._build_dialog();
			this.eventify_menu();
			//return this to chain/use the bridge with less code
			return this;
		},

		options: {
			on_refresh_callback : function () {}
		},
		//options par défault à remplir"
		_build_dialog: function () {
			var that = this;
			
			this.$menu_tree = $('<span>', {
				id: 'menu_tree',
				style: 'display:none'
			});
			this.$menu_tree_dialog = $('<div>', {
				id: 'menu_tree_dialog'
			})
				.append(this.$menu_tree)
				.appendTo('body')
				.dialog({
					autoOpen: false,
					height: $(window).height(),
					width: 350,
					modal: false,
					position: ['left', 'top'],
					create: function (event, ui) {
						$(this).siblings('.ui-dialog-buttonpane').hide();
						that._init_jstree();
					},
					open: function (event, ui) {
					},
					buttons: {
						'Ok Menu': function () {
							that.valide_jstree();		
						}
					}
				});
				
			return this;
		},

		_init_jstree: function () {
			console.info('jstree init');
			this.$menu_tree.bind("move_node.jstree", function (e, data) {
				//var getjson_menu = $(this).jstree("get_json", -1, [], ['href']);
				//console.info(getjson_menu);
			}).bind("loaded.jstree", function (e, data) {
				$(this)
					.jstree("open_all", -1, true)
					.toggle('slide', {direction: 'down'}, 'fast');
				$('#menu_tree_dialog')
					.siblings('.ui-dialog-buttonpane').show('slide');
			}).jstree({
				"ui": {
					"select_limit": -1,
					"initially_select": []
				},
				"core": {},
				"themes": {
					"theme": "default",
					"dots": false,
					"icons": true
				},
				"json_data": {
					"ajax": {
						"url": WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd_menu/init_jstree/"
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
						"create": {
							"label": "Ajouter une entrée (Creer un nouveau noeud)",
							"action": function (obj) {
								this.create(obj, "after");
							}
						},
						
						"lien vers": {
							label: "Modifier le lien",
							action: function (obj) {
								var that = this;
								var $lien = obj.children('a');
								this.close_node(obj);
								var obj_closure = obj;
								
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
									source: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd_menu/get_pages_list/",
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
					"move": {
						"check_move": function (move_object) {
							var p = this._get_parent(move_object.cr);
							var pp = move_object.cr;
							var child = this._get_children(move_object.o);
							//console.info(child.length);
							if (p === -1 && child.length === 0) {return true};
							if (pp === -1) {return true};
						}
					}
				},
				"types": {
					"valid_children": [ "default" ],
					"types": {
					// the default type
						"default" : {
							"max_children"	: -1,
							"max_depth"	: -1,
							"valid_children": "all",
							"icon" : {
								"image" : "http://static.jstree.com/v.1.0rc/_docs/_drive.png"
							},
							// Bound functions - you can bind any other function here (using boolean or function)
							//"select_node"	: true,
							//"open_node"	: true,
							//"close_node"	: true,
							"create_node": function (node) {
								console.info('initnode');
								console.info(node);
								return true;
							},
							//"delete_node"	: true
						}
					}
				},

				"plugins": ["themes", "json_data", "ui", "crrm", "dnd", "contextmenu", "types"]
			});
		},
		
		valide_jstree: function () {
			var getjsons = this.$menu_tree.jstree("get_json", -1, [], ['href']); 
				$.ajax({
					url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd_menu/save_menu/",
					type: "POST",
					data: {
						menu: getjsons,
						ajax_enabled: 1
					},
					dataType: "json",
					context: this,
					success : function (ans) {
						if(ans.success) {
							//this.refresh_menu_ajax();
							location.reload();
						}		
					}	
				});
			this.$menu_tree.toggle("scale", {}, "slow", function () {
				$(this).jstree("destroy");
			});
		},
	
		eventify_menu: function () { // ajouter le hover pour modifier l'apparence du pointeur et indiquer une action possible'
			this.$elem.on('dblclick', $.proxy(this.handler_dblclick_menu, this));
			return this;
		},	
		
		handler_dblclick_menu: function () {
			//console.info('double clique');
			$('#menu_tree_dialog').dialog('open'); // on a perdu la reference this.menu_tree_dialog !!?
		},
		
		purge: function (d) {
			var a = d.attributes, i, l, n;
			    if (a) {
				for (i = a.length - 1; i >= 0; i -= 1) {
				    n = a[i].name;
				    if (typeof d[n] === 'function') {
					d[n] = null;
				    }
				}
			    }
			    a = d.childNodes;
			    if (a) {
				l = a.length;
				for (i = 0; i < l; i += 1) {
				    this.purge(d.childNodes[i]);
				}
			    }
		},

		refresh_menu_ajax: function () {
			//var menu_elem = document.getElementById('menu');
			//this.purge(menu_elem);
			//menu_elem.innerHTML = '';// parce que empty ou remove ça déconnait
			
			$.ajax({
					url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/refresh_menu_ajax/",
					type: "GET",
					context: this,
					success : function (ans) {
						if (ans.success) {
							$('#menu').html(ans.menu);
							//menu_elem.innerHTML = ans.menu;
							//html ou empty.append les deux semblent fonctionner
							this.options.on_refresh_callback();
						}		
					}	
				});
		}
	}; //fin du literal object
	
	$.fn.jstree_menu_wikid = function (options) {
		if (this.length) {
			return this.each(function () {
				// Create a new object via the Prototypal Object.create
				var jstree_menu_wikid = Object.create(Jstree_menu_wikid_prototype);
				// Run the initialization function
				jstree_menu_wikid.init(options, this); // `this` refers to the element	 
				// Save the instance of the object in the element's data store
				$.data(this, 'jstree_menu_wikid0', jstree_menu_wikid);
			});
		}
		
	};
}(jQuery));
