(function ($) {
	'use strict';
	
	var Menu_wikid_prototype = {
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);
			//build the initial DOM structure
			this._build_dialog();
			this._init_accordion_and_tabs();
			//return this to chain/use the bridge with less code
			return this;
		},

		options: {
			on_refresh_callback : function () {}
		},
		
		_build_dialog: function () {
			var that = this;
			var $form_wrapper = $('<div>', {
				id: 'mosaic_elem_form_wrapper'
			});
			this.$menu_wikid_dialog = $('<div>', {
				id: 'menu_wikid_dialog'
			})
				.appendTo('body')
				.append($form_wrapper)
				.dialog({
					//autoOpen: false,
					height: $(window).height(),
					width: 800,
					modal: true,
					position: ['left', 'top'],
					open: function (event, ui) {
						//that._init_jstree();
					},
					buttons: {
						'Ok Menu': function () {
							//that.valide_jstree();		
						}
					}
				})
				.css('overflow-y', 'hidden');
				
			return this;
		},
		
		_init_fileupload: function () {
			'use strict';
			

			// Initialize the jQuery File Upload widget:
			$('#fileupload', this.$menu_wikid_dialog_accordion).fileupload({
			    uploadTemplate: function (o) {
				var rows = $();
				$.each(o.files, function (index, file) {
				    var row = $('<tr class="template-upload fade">' +
					'<td class="preview"><span class="fade"></span></td>' +
					'<td class="name"></td>' +
					'<td class="size"></td>' +
					(file.error ? '<td class="error" colspan="2"></td>' :
						'<td><div class="progress">' +
						    '<div class="bar" style="width:0%;"></div></div></td>' +
						    '<td class="start"><button>Start</button></td>'
					) + '<td class="cancel"><button>Cancel</button></td></tr>');
				    row.find('.name').text(file.name);
				    row.find('.size').text(o.formatFileSize(file.size));
				    if (file.error) {
					row.find('.error').text(
					    locale.fileupload.errors[file.error] || file.error
					);
				    }
				    rows = rows.add(row);
				});
				return rows;
			    },
			    downloadTemplate: function (o) {
				var rows = $();
				$.each(o.files, function (index, file) {
				    var row = $('<tr class="template-download fade">' +
					(file.error ? '<td></td><td class="name"></td>' +
					    '<td class="size"></td><td class="error" colspan="2"></td>' :
						'<td class="preview"></td>' +
						    '<td class="name"><a></a></td>' +
						    '<td class="size"></td><td colspan="2"></td>'
					) + '<td class="delete"><button>Delete</button> ' +
					    '<input type="checkbox" name="delete" value="1"></td></tr>');
				    row.find('.size').text(o.formatFileSize(file.size));
				    if (file.error) {
					row.find('.name').text(file.name);
					row.find('.error').text(
					    locale.fileupload.errors[file.error] || file.error
					);
				    } else {
					row.find('.name a').text(file.name);
					if (file.thumbnail_url) {
					    row.find('.preview').append('<a><img></a>')
						.find('img').prop('src', file.thumbnail_url);
					    row.find('a').prop('rel', 'gallery');
					}
					row.find('a').prop('href', file.url);
					row.find('.delete button')
					    .attr('data-type', file.delete_type)
					    .attr('data-url', file.delete_url);
				    }
				    rows = rows.add(row);
				});
				return rows;
			    },
			});
			//Set your url localhost or your ndd (perrot-julien.fr)
			if (window.location.hostname === 'localhost') {
				//Load files
				// Upload server status check for browsers with CORS support:
				if ($.ajaxSettings.xhr().withCredentials !== undefined) {
					$.ajax({
						url: WIKIDGLOBALS.BASE_URL + 'index.php/upload/get_files',
						dataType: 'json',
						context: this,
						success : function (data) {
							console.info(data);
							var fu = $('#fileupload').data('fileupload'); 
							var template;
							fu._adjustMaxNumberOfFiles(-data.length);
							template = fu._renderDownload(data);
							template
								.appendTo($('#fileupload .files'))
								.css('display', 'table-row');
		            
							// Force reflow:
							//fu._reflow = fu._transition && template.length && template[0].offsetWidth;
							template.addClass('in');
							$('#loading').remove();
		        			}  
		 
		        			
					}).fail(function () {
						$('<span class="alert alert-error"/>')
							.text('Upload server currently unavailable - ' + new Date())
							.appendTo('#fileupload');
					});
				}
    			} else {
				// Load existing files:
				$('#fileupload')
					.each(function () {
						var that = this;
						$.getJSON(this.action, function (result) {
							if (result && result.length) {
								$(that)
									.fileupload('option', 'done')
									.call(that, null, {
										result: result
									});
                					}
						});
					});
			}
			$('#fileupload .files').imagegallery();
			// Open download dialogs via iframes,
			// to prevent aborting current uploads:
			$('#fileupload .files a:not([target^=_blank])', this.$menu_wikid_dialog_accordion)
				.on('click', function (e) {
					e.preventDefault();
					$('<iframe style="display:none;"></iframe>')
						.prop('src', this.href)
						.appendTo('body');
		    		});
		},
		
		_init_accordion_and_tabs: function () {
			$.ajax({
					url: WIKIDGLOBALS.BASE_DIRECTORY + "index.php/wkd_menu/get_menu_tabs_template/",
					type: "GET",
					dataType: "json",
					context: this,
					success : function (ans) {
						this.$menu_wikid_dialog_accordion = $('<div>', {
							id:'menu_wikid_dialog_accordion'
						});
							
							this.$menu_wikid_dialog_accordion
								.append('<h3><a href="#">Upload</a></h3>')
								.append(ans.fileupload_form)
								.append('<h3><a href="#">Mosaic</a></h3>')
								.append(ans.tabs);
							this.$menu_wikid_dialog_accordion
								.appendTo('#menu_wikid_dialog')
								.accordion({
									fillSpace: true
									//autoHeight: true
								});
							var $tabs = $('#tabs', this.$menu_wikid_dialog_accordion);
							$tabs.tabs();
							
							$('ul.tab_content', $tabs)
									.addClass('grid_sortable')
									.sortable({ handle: '.handle'})
									.selectable({
										selected: function (event, ui) {
											$(event.target)
												.children('.ui-selected')
												.not(':first')
												.removeClass('ui-selected');
												$( ".ui-selected", this).data('mosaic_wikid_form').show();
										},
										/*
										stop: function (event, ui) {
											//vide
											
										},
										*/
										selecting: function (event, ui) {
											$('#mosaic_elem_form_wrapper')
												.children()	
												.hide();
										},
										
										create: function (event, ui) {
											$('li.ui-selectee', this).each(function () {
												var that = this;
												var $link = $(this).find('a');
												var form_content_html = [
			'<fieldset style="display:block">',									
			'<p class="mosaic_form_tips"> lien vers page :</p>',									
    			'<h>' + $link.attr('href') + '</h>',
    			'<label for="titre">Titre du lien</label>',
    			'<input type="text" name="titre" id="titre" value="'+ $link.html() +'"class="text ui-widget-content ui-corner-all" />',
    			'<label for="context">Contexte</label>',
    			'<input type="text" name="context" id="context" value="" class="text ui-widget-content ui-corner-all" />',
    			'<label for="thumbnail_url">URL du thumbnail</label>',
    			'<input type="text" name="thumbnail_url" id="thumbnail_url" value="" class="text ui-widget-content ui-corner-all" />',
    			'</fieldset>',
			].join('');
												var $form = $('<form>');
												$form
													//.append('<h>'+ $(that).find('a').attr('href') +'</h>')
													.append(form_content_html)
													.appendTo($('#mosaic_elem_form_wrapper'))
													.hide();
												$(this).data('mosaic_wikid_form', $form);
											});
										}
									})
									.find('li')
									.prepend("<div class='handle'><span class='ui-icon ui-icon-carat-2-n-s'></span></div>");
							this._init_fileupload();
							this.options.on_refresh_callback();
					}	
				});
		}
	};
	
	$.fn.menu_wikid = function (options) {
		if (this.length) {
			return this.each(function () {
				// Create a new object via the Prototypal Object.create
				var mon_menu_wikid = Object.create(Menu_wikid_prototype);
				// Run the initialization function
				mon_menu_wikid.init(options, this); // `this` refers to the element	 
				// Save the instance of the object in the element's data store
				$.data(this, 'menu_wikid', mon_menu_wikid);
			});
		}
		
	};
}(jQuery));
