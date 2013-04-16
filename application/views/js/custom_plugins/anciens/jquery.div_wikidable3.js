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
			this.bind_dblclick_on_div_wikidable();
			this.dblclick_on_div_wikidable();
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
				this.editor_toolbar_dialog = document.createElement('div');
				this.editor_toolbar_dialog.setAttribute('id', 'editor_toolbar_dialog');
				
				var html_string = [
    					'<div id="topSpace"></div>',
    					//'<div id="bottomSpace"></div>', 
    					//on a besoin du bottom space pour le resize de ckeditor
				].join('');
				$(this.editor_toolbar_dialog).html(html_string);
				$('body').append(this.editor_toolbar_dialog);
				this.$toolbar_dialog = $(this.editor_toolbar_dialog)
				//plus simple à manipuler
				this.$toolbar_dialog.dialog({
					autoOpen: false,
					height: 175,
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
	
		_init_ckeditor: function () {
			var that = this;
			var contenu_wikidable_elem_ID = this.$elem_child_contenu_wikidable.attr('id');
			this.code_couleur_init();
			this.$elem_child_contenu_wikidable.ckeditor(function() { 
				/* CKEDITOR callback code */ 
				this.focus();	
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
					//alert( 'The editor named ' + e.editor.name + ' is now focused' );
					var $local_scope_dialog_ref = $('#editor_toolbar_dialog');
					//pour le dialog, jutilise le selecteur jquery et non la reference de l'objet
					//that.$toolbar_dialog n'existe plus, à voir avec le plugin dialog
					if (!$local_scope_dialog_ref.dialog('isOpen')) {
						$local_scope_dialog_ref.dialog('open');
					}
					//console.info(this);
					$('.cke_wrapper', $local_scope_dialog_ref).css('background-color', that.string_couleur_target_rgba);
					$('.cke_wrapper', that.$elem).css('background-color', that.string_couleur_target_rgba);
					$(bouton_ok).css({
						'background': 'none',
						'background-color': that.string_couleur_target_rgba
					});
			});
			editor.on('blur', function (e) {					
					$('.cke_wrapper').css('background-color', 'transparent');
					$('.cke_wrapper', that.$elem).css('background-color', 'transparent');
					$(bouton_ok).css({
						'background': '',
						'background-color': ''
					});
			});
			editor.on('dialogShow', function(e) {
				$('.cke_dialog_body', 'body').css('background-color', that.string_couleur_target_rgba);
			});
			var bouton_ok = document.createElement('input');
			bouton_ok.setAttribute('type', 'button');
			bouton_ok.setAttribute('id', 'bouton_ok_'+ contenu_wikidable_elem_ID);
			bouton_ok.setAttribute('value', 'Ok ' + contenu_wikidable_elem_ID);
			bouton_ok.setAttribute('class', 'bouton_wikid');
			$(bouton_ok).button();
			
			
			this.$elem.append($(bouton_ok));
			$(bouton_ok).position({
				my: 'right top',
				at: 'left bottom',
				of: that.$elem,
				offset: '0 10',
				collision: 'fit flip'
			});
			
			$(bouton_ok).click(function (e) {
				var size = editor.window.getViewPaneSize();				
				if (editor.checkDirty()) {
					$.ajax({
						url: 	WIKIDGLOBALS.BASE_DIRECTORY 
							+ "index.php/wkd/modify_page/" 
							+ that.$elem_child_contenu_wikidable.data('page_nom'), 
							//.data('page_nom') c'est la clef de voute
						type: "POST",
						data: {
							contenu: editor.getData(), 
							ajax_enabled: 1,
							dimensions: {
								width: size.width,
								height: size.height
							}
						},
						dataType: "json",
					  	success: function(ans) {			  	
							if (!ans.success) {alert('Erreur durant la sauvegarde !');}
							else {		
					  			editor.destroy();				
					  			that.options.on_div_wikidable_update_callback
					  				.apply(
					  					that.$elem_child_contenu_wikidable,
					  					[
						  					contenu_wikidable_elem_ID, 
						  					ans.page_nom, 
						  					size.width, 
						  					size.height
						  				]
					  				);
					  		}
					 	}
					});
				} 
				else {
					// checkdirty false; pas de resize
					editor.destroy(true);
				}
				// cacher le bouton_ok 
				$(this).hide('scale', function () {
					// détruire le bouton_ok ainsi que ses handlers
					// la ref js est une variable locale
					$(this).remove();	
				});
				// réactive draggable	
				that.$elem.draggable( "option", "disabled", false );
				// referme la fenêtre de dialogue de la barre d'outil ckeditor'
				console.info($('.cke_browser_gecko'));
				if (	
					!$('.cke_browser_gecko').length)
					// !document.getElementsByClassName('cke_browser_gecko').length)
				{
					// that.$toolbar_dialog.dialog('close'); //c'est étrange ces dialogues et les références
										//à cause des iframes ?'
					$('#editor_toolbar_dialog').dialog('close');
				}
			});				
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
		
		/*item.addListener = function(name,listener){
		    var self = this;
		    var wrappedListener = function(){
			return listener.apply(self,arguments);
		    }
		    this.elem.bind(name, wrappedListener);
		    wrappedListener = null;
		    self = null; // <-- this is the change
		}*/
	
		bind_dblclick_on_div_wikidable: function () {
			var self = this;
			this.$elem.dblclick((function () {
				var that = self;			
				return function (e) {
					console.info(that.$elem_child_contenu_wikidable.data('page_nom'));
					that.$elem.draggable( "option", "disabled", true );
					that._init_ckeditor();
				};
			}()));
			self = null;
			return this;
			
		},
		
		dblclick_on_div_wikidable: function () {
		
			var handlere = function (event) {
				console.info('dblclick_on_div_wikidable!!!!');
				console.info(this);
				console.info(event.data.context);
				//event.data.context.$elem = null;
				event.data.context.handlerzob();
				//that._init_ckeditor();
			};
			this.$elem.on('dblclick', { context: this}, handlere);
			//this.$elem.on('dblclick', { context: this}, this.handlerzob);
			console.info('methode init object');
			console.info(this);
			return this;
		},
		
		
		init_ckeditor_dummy: function () {
			console.info('ckeditor dummy');
		},
		
		handlerzob: function (event) {
			console.info('handlerzobbe');
			console.info(this);
			//console.info(event.data.context);
			//console.info(event.target);
			return this;
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
