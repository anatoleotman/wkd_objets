//l'objet créé lors d'un appel du plugin jstree_menu_wikid0 sur un wrapper/cadre du conteneur menu'
(function ($) {
	'use strict';
	
	var Jstree_menu_wikid0 = {
		init: function (options, elem) {
			'use strict';
			// Mix in the passed in options with the default options
			this.options = $.extend({}, this.options, options);
			// Save the element reference, both as a jQuery reference and a normal reference
			this.elem = elem;
			this.$elem = $(elem);
			this.$elem_menu = $('#menu', elem);
			//build the initial DOM structure
			this._build_element();
			//return this to chain/use the bridge with less code
			return this;
		},

		options: {
			on_refresh_callback : function() {}
		},
		//options par défault à remplir"
		_build_element: function () {
			this.$elem.append('<span id="menu_tree" style="display:none;"></span>'); 
			//menu_tree un id à passer en options par exemple !?'
			this.$menu_tree = this.$elem.find('#menu_tree'); 
			//on garde la référence jquery du conteneur créé pour le jstree
			//return this; pas la peine de chainer c'est une fonction privée/interne: on l'appelle de l'intérieur de l'objet '
		},

		_init_jstree: function () { //appeler au moment du dblclick
			var that = this;
			this.$menu_tree.bind("move_node.jstree", function (e, data) {
				//console.info(data.rslt.o);
				var getjson_menu = $('#menu_tree').jstree("get_json", -1);
				//console.info(getjson_menu);
			}).bind("loaded.jstree", function (e, data) {
				that.$menu_tree.jstree("open_all", -1, true);
				that.toggle_menu_jstree();
				that._creer_bouton_sauver_jstree_menu();
				that.$elem.append(that.bouton_sauver_menu)	
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
						"url": WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/init_tree_menu/"
					}
				},
				"contextmenu": {
					"items": {
						"info": {
							"label": "infos",
							"action": function (obj) { //this.rename(obj);
								console.info(this._get_parent(obj));
							}
						},

						"create": {
							"label": "Create",
							"action": function (obj) {
								this.create(obj, "after");
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
				"plugins": ["themes", "json_data", "ui", "crrm", "dnd", "contextmenu"]
			});
		},

		toggle_menu_jstree: function () { //on appelle cette fonction dans le callback de jstree init
			var that = this;
			this.$menu_tree.toggle("scale", function () {
			});
			return this;
		},
	
		bind_dblclick_on_menu: function () {
			var that = this;
			this.$elem.dblclick(function () {
				if ($(this).attr('class') === 'menu jstree_opened') {
					return false;
				}
				$(this).toggleClass('menu jstree_opened');
				that.$menu_tree.append(that.bouton_sauver_menu); //programmer action on click
				that._init_jstree();
				//that.toggle_menu_jstree();
				//that._creer_bouton_sauver_jstree_menu();
			});
		},	

		_creer_bouton_sauver_jstree_menu: function () {
			var that = this;
			this.bouton_sauver_menu = document.createElement('input');
			this.bouton_sauver_menu.setAttribute('type', 'button');
			this.bouton_sauver_menu.setAttribute('id', 'bouton_sauver_menu');
			this.bouton_sauver_menu.setAttribute('value', 'bouton_menu');
			this.bouton_sauver_menu.setAttribute('display', 'none');
			$(this.bouton_sauver_menu).click(function (e) {

				var getjsons = that.$menu_tree.jstree("get_json", -1); //, ["id", "class", "rel"], ["id", "class", "rel"]);
				//console.info(getjsons);
				$.ajax({
					url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd/save_menu/",
					type: "POST",
					data: {
						menu: getjsons,
						ajax_enabled: 1
					},
					dataType: "json",
					success : function (ans) {
						if(ans.success) {
							that.refresh_menu_ajax(ans);//toggle
						}		
					}	
				});
				that.$elem.toggleClass('jstree_opened');
				that.$menu_tree.toggle("scale", {}, "slow", function () {
					$(this).jstree("destroy");
				});
				$(this).toggle("scale", function () {
					$(this).remove();
				});
			});
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

		refresh_menu_ajax: function (ans) {
			console.profile();
			//var that = this;
			var menu_elem = document.getElementById('menu');
			this.purge(menu_elem);
			menu_elem.innerHTML = '';// parce que empty ou remove ça déconnait
			$(menu_elem).html(ans.menu); //html ou empty.append les deux semblent fonctionner
			this.options.on_refresh_callback();
			console.profileEnd();
		}
	}; //fin du literal object
	
	$.fn.jstree_menu_wikid0 = function (options) {
		if (this.length) {
			return this.each(function () {
				// Create a new menu object via the Prototypal Object.create
				var jstree_menu_wikid = Object.create(Jstree_menu_wikid0);
				// Run the initialization function
				jstree_menu_wikid.init(options, this); // `this` refers to the element	 
				// Save the instance of the menu object in the element's data store
				$.data(this, 'jstree_menu_wikid0', jstree_menu_wikid);
			});
		}
		
	};
}(jQuery));
