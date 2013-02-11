//l'objet créé lors d'un appel du plugin jstree_menu_wikid sur un wrapper/cadre du conteneur menu'
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
			
			
			this.$elem.addClass('wikid_jsTree');
			this._code_couleur_init();
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
		_get_menu_liste: function () {
			return $('ul#menu_liste');
		},
		
		bouton_edit_transfer_effect_init: function () {
			var that = this;
			this.$bouton_edit_mode.one('mouseover.transfer_effect', function () {
				$(this).effect('transfer', {to: that.$elem_menu}, 1000, function () {
	$.proxy(that.bouton_edit_transfer_effect_init(), that);
				});
				$('.ui-effects-transfer').css('background', that.string_couleur_target_rgba);
			});
		},
		
		_build_dialog: function () {
			var that = this;
			
			this.$bouton_edit_mode = $('<button>', {
				id: 'bouton_menu_edit_mode',
				value: 'Edit menu',
				'class': 'bouton_edit_mode'
			})	
				.appendTo(this.$elem)
				.button()
				.css('background', this.string_couleur_target_rgba);
				
			$('#bouton_menu_edit_mode').button('option', 'label', 'Modifier le Menu');
			
			
			this.$menu_tree = $('<div>', {
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
					width: 900,
					modal: false,
					position: ['left', 'top'],
					create: function (event, ui) {
						
					},
					open: function (event, ui) {
						
						$(this).dialog('widget').show('scale', function () {
							$(this).dialog('widget').find('button').button('widget').css('background', that.string_couleur_target_rgba);
						});
					},
					close: function () {
						that.eventify_menu();
						$(this).dialog('widget').hide('scale');
					},
					buttons: {
						'Nouvelle page': function () {
							var $new_page_elem = $('#nouvelle_page');
							if (!$new_page_elem.length) {
								$.proxy(that.handler_new_page(), that);
							}
							else {
								$new_page_elem.effect('highlight', {color: that.string_couleur_target_rgba}, 1000);
								$new_page_elem.find('input').focus();
							}
							
						},
						'Valider menu': function () {
							$.proxy(that.valide_jstree(), that);
							$(this).dialog('close');
						}
						
					}
				});
				
			return this;
		},
		
		handler_new_page: function () {
			var that = this;
			var $current_page_name = $('input[name="page_name"]', this.$elem).val();
			var $new_page_elem = $('<div>', {
				id: 'nouvelle_page',
				style: 'display:none'
			})
				.load(WIKIDGLOBALS.BASE_DIRECTORY + "index.php/pages/display_new_page_form/", function () {
					$(this).show('slide', {}, "easeOutQuint", function () {
						$new_page_elem.effect('highlight', {color: that.string_couleur_target_rgba}, 1000);
						$(this).find('input').focus();
						$(this).find('.buttonset').buttonset();
						$(this).find('button').button('widget').css('background', that.string_couleur_target_rgba);
						that._ajax_form_new_page(this);
					});
				})
				.appendTo('#menu_tree_dialog')
				.css('float', 'right');
		},

		_ajax_form_new_page: function (elem) {
			$(elem).find('#nouvelle_page_form').validate({
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
								var $menu_tree_elem = $('#menu_tree_dialog').find('#menu_tree');
								console.info($menu_tree_elem);
								window.location.hash = ans.new_page_url_index;
								$('#menu_tree').jstree("create", null, "after", {
									
									"data": {
										"title": ans.new_page_titre,
										"attr": {
											"class": "link_page_wikid",
											"href": ans.new_page_url_index
										}
									}
								}, function () {
									alert(ans.new_page_titre + ' a été ajouté au menu')
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

		_init_jstree: function () {
			var that = this;
			this.$menu_tree.bind("move_node.jstree", function (e, data) {
				//console.info(data.rslt.o);
			}).bind("loaded.jstree", function (e, data) {
				$(this)
					.jstree("open_all", -1, true)
					.show();
				// cree le formulaire
				var form_content_html = [
					'<fieldset style="display:block">',
					'<p>',					
					'<label for="link">Lien vers page:</label>',
		    			'<input type="text" name="link" id="link" value="" size="25" class="required text ui-widget-content ui-corner-all" />',
		    			'</p>',
		    			'<p>',	
		    			'<label for="titre">Titre du lien:</label>',
		    			'<input type="text" name="titre" id="titre" value="" size="25" class="required text ui-widget-content ui-corner-all" />',
		    			'</p>',
		    			'<p>',
		    			'<label for="context">Contexte:</label>',
		    			'<input type="text" name="context" id="context" value="" class="text ui-widget-content ui-corner-all" />',
		    			'</p>',
		    			/*'<p>',
		    			'<input type="checkbox" id="check_thumbnail"/> <label for="check_thumbnail">Thumbnail</label>',
		    			//'<label for="node_thumbnail">thumbnail</label>',
		    			'<input type="image" name="node_thumbnail" id="node_thumbnail" value="" class="ui-widget-content ui-corner-all" />',
		    			'</p>',*/
		    			'<p><input class="submit" type="submit" value="Appliquer"/></p>',
		    			'</fieldset>',
		    			
					].join('');
				var $form = $('<form>',  {
					id: 'jstree_form',
					method: 'get',
					action: ''
				});
				$form.append(form_content_html).draggable();
				$form.find('input.submit').button().css('background', that.string_couleur_target_rgba);
//				var $div = $('<div>', {
//					id: 'jstree_menu_node_options'
//				}).append($form);
				//$form.appendTo($(this));
				//$form.appendTo($('#menu_tree_dialog'));
				$('#menu_tree_dialog')
					.append($form)
					.siblings('.ui-dialog-buttonpane').show();
				$(':submit', $form).button();	
				$('#link', $form)
				.autocomplete({
						source: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/menu/get_pages_list/",
						position: { 
							my: 'left top',
							at: 'right top'
						}
				})
				.on('focus', function () {
						$(this).autocomplete('search', ['']);
				});
				//appel ajax pour afficher la liste des thumbnails
				/*
				$.ajax({
					url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/menu/get_thumbnails/",
					type: "GET",
					dataType: "json",
					context: this,
					success : function (ans) {
						if (ans) {
							var $thumbnails_wrapper = $('<div>',  {
								id: 'thumbnails_wrapper'
							})
								.append(ans)
								.appendTo($('#menu_tree_dialog'))
								.hide();
							$('#thumbnails_list_mosaic', '#menu_tree_dialog').selectable({
								selected: function (event, ui) {
									var $thumbnail_url = $(event.target)
										.children('.ui-selected')
										.first()
										.find('img').attr('src');
									$('#node_thumbnail').attr('src', $thumbnail_url);
								} 
							});
						}	
					}
				});
				
				$form.find('.submit').button();
				
				var $check_thumbnail = $('#check_thumbnail', $form);
				var $node_thumbnail = $('#node_thumbnail', $form);
				
				$check_thumbnail
					//.button()
					.change(function () {
						var $thumbnail_wrapper = $('#thumbnails_wrapper', '#menu_tree_dialog');
						if ($(this).attr('checked')) {
							if ($thumbnail_wrapper.is(':hidden')) {
								$thumbnail_wrapper.show('slide', {direction: 'up'});
								$node_thumbnail.fadeIn('slow');
							}
						}
						else {
							if ($thumbnail_wrapper.is(':visible')) {
								$thumbnail_wrapper.hide('slide', {direction: 'up'});
								$node_thumbnail.fadeOut('slow');
							}
						}
				});
				
				*/
				
				$form.validate({
					submitHandler: function (form) {
						var $inputs = $('input', this.currentForm);
						var $menu_tree = $('#menu_tree');
						var $selected_node = $menu_tree.jstree('get_selected').first();
						
						var $selected_link = $('a', $selected_node).first();
						$selected_link.effect('highlight', {color: that.string_couleur_target_rgba}, 3000);
						$selected_link.attr('href', '#' + $inputs.eq(0).val());
						//$selected_link.text($inputs.eq(1).val());
						$menu_tree.jstree('rename_node', $selected_node, $inputs.eq(1).val());
						$selected_link.attr('title', $inputs.eq(2).val()); // ok à sauver coté serveur et à utiliser lors de la construction du menu_liste
						/*
						if (!$('#check_thumbnail', '#menu_tree_dialog').attr('checked')) {
							$selected_node.css({backgroundImage: 'none'});
							$inputs.eq(4).removeAttr('src');
							//$selected_node.removeAttr('style');
						}
						else {
							$selected_node.css('background-image', 'url(' + $inputs.eq(4).attr('src') + ')');
						}
						*/
					}
				});
			})
			.bind("select_node.jstree", function (event, data) {
				//var $form = $('#jstree_form', this);
				var $inputs = $('#jstree_form :input, #menu_tree_dialog');

				//$form.find()
				var $selected_link = $(data.rslt.obj.context).attr('href');
				$inputs.eq(1).val($selected_link.replace('#', ''));
				var $selected_titre = $(data.rslt.obj.context).text();
				$inputs.eq(2).val($.trim($selected_titre));
				var $selected_context = $(data.rslt.obj.context).attr('title');
				$inputs.eq(3).val($selected_context);
				
				$('#jstree_form').position({
					my: "left top",
					at: "right top",
					of: $(data.rslt.obj.context).parent('li'),
					using: function (css, calc) {
						$('#jstree_form').animate(css, 200, "linear");
					}
				});
				/*
				var $selected_url_thumbnail = $(data.rslt.obj.context).parent('li').css('background-image');
				if (!$selected_url_thumbnail || $selected_url_thumbnail === 'none') {
					$inputs.eq(4)
						.prop("checked", false)
						.trigger('change');
					$inputs.eq(5).fadeOut('slow', function () {
						$(this).removeAttr('src');	
					});
						
				}
				else {
					$inputs.eq(4)
						.prop("checked", true)
						.trigger('change');
					var patt = /\"|\'|\)|\(|url/g;	
					$inputs.eq(5).attr('src', $selected_url_thumbnail.replace(patt,''));
				}
				*/
				
			})
			.bind("create.jstree", function (e, data) {
				//$(data.rslt.obj).effect('highlight', {color: that.string_couleur_target_rgba}, 1000);
			})
			.jstree({
				"ui": {
					"select_limit": -1,
					"initially_select": []
				},
				"core": {},
				"json_data": {
					"ajax": {
						"url": WIKIDGLOBALS.BASE_DIRECTORY + "index.php/menu/init_jstree/"
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
//				"crrm": {
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
//				},
				"types": {
					"max_children": -2,
					"max_depth": 2,
					"valid_children": ["default", "categorie", "link"],
					"types": {
						// the default type
						"default": {
							"valid_children": ["default", "categorie", "link"],
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

				"plugins": ["themeroller", "json_data", "ui", "crrm", "dnd", "contextmenu", "types"]
			});
		},
		
		valide_jstree: function () {
			var getjsons = this.$menu_tree.jstree("get_json", -1, [], ['href', 'title']); 
			$.ajax({
				url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/menu/save_menu/",
				type: "POST",
				data: {
					menu: getjsons,
					ajax_enabled: 1
				},
				dataType: "json",
				context: this,
				success : function (ans) {
					if (ans.success) {
						$('#jstree_form').remove();
						this.$menu_tree.jstree('destroy');
						this.$menu_tree.empty();
						//this.eventify_menu();
						this._refresh_menu_html();	
						//location.reload();
					}		
				}	
			});
				
			/*
			this.$menu_tree.toggle("scale", {}, "slow", function () {
				$(this).jstree("destroy");
				$('#jstree_form').remove();
			});
			*/
		},
		
		_refresh_menu_html: function () {
			$('#menu').hide('scale', function () {
					$(this).empty()
					.css('display', 'none')
					.load(WIKIDGLOBALS.BASE_DIRECTORY + 'index.php/menu/get_menu_ul', function () {
						$(this).show('scale');
					});
					
			});
			
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
	
		eventify_menu: function () { // ajouter le hover pour modifier l'apparence du pointeur et indiquer une action possible'
			//this.$elem.on('dblclick', $.proxy(this.handler_edit_mode, this));
			this.bouton_edit_transfer_effect_init();
			this.$elem.one('click.edit_mode', '#bouton_menu_edit_mode', $.proxy(this.handler_edit_mode, this));
			return this;
		},	
		
		handler_edit_mode: function () {
			var that = this;
			that.$bouton_edit_mode.off('mouseover.transfer_effect');
			this.$bouton_edit_mode.effect('transfer', {to: $('#menu')}, 600, function () {
				if (that.$menu_tree.children().length === 0) {
					that._init_jstree();
				}
				$('#menu_tree_dialog').dialog('open');
			});
			$('.ui-effects-transfer').css('background', this.string_couleur_target_rgba);
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
		}
	};
	
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
