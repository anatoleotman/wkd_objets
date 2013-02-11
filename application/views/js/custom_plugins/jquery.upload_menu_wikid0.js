(function ($) {
	'use strict';
	
	var upload_menu_prototype = {
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);
			//build the initial DOM structure
			this._build_dialog();
			this._build_upload_wrapper();
			//return this to chain/use the bridge with less code
			return this;
		},

		options: {
			on_refresh_callback : function () {}
		},
		
		_build_dialog: function () {
			var that = this;
			var $div_fileupload = $('<div>', {
				id: 'fileupload'
			});
			//.load('/wikid_simple/index.php/upload/index');
			$.ajax({
				url: WIKIDGLOBALS.BASE_DIRECTORY + 'index.php/upload/index',
				type: 'get',
				dataType: 'json',
				context: this,
				success: function (ans) {
					this.$upload_menu_dialog = $('<div>', {
						id: 'upload_menu_dialog'
					})
					.append($div_fileupload)
					.appendTo('body')
					.dialog({
						autoOpen: false,
						height: $(window).height(),
						width: 800,
						modal: false,
						position: ['left', 'top'],
					});
					$div_fileupload.html(ans);
					
				},
				complete: function () {
					this._init_fileupload();
				}
			});
			
			
			
				
			return this;
		},
		
		_build_upload_wrapper: function () {
			this.$upload_wrapper = $('<div>', {
				id: 'upload_wrapper'
			});
			this.$show_upload_menu_button = $('<button>', {
				id: 'show_upload_menu_button',
				text: 'Upload'
			}).button({
					icons: {
						primary: "ui-icon-upload"
					},
					text: true
				});
			this.$show_upload_menu_button.button('widget').css('background', 'rgba( 255, 255, 255, 0.3)');
			this.$show_upload_menu_button.appendTo(this.$upload_wrapper);
			$('#wrapper').append(this.$upload_wrapper); //on peut aussi attacher au body
			this.$show_upload_menu_button.on('click', $.proxy(this.show_upload_dialog, this));
			return this;
		},
		
		show_upload_dialog: function () {
			this.$upload_menu_dialog.dialog('open');
		},
		
		_init_fileupload: function () {
			'use strict';
			// Initialize the jQuery File Upload widget:
			$('#upload_menu_dialog').find('#fileupload').fileupload({
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
		}
		
	};
	
	$.fn.wikid_upload_menu = function (options) {
		if (this.length) {
			return this.each(function () {
				// Create a new object via the Prototypal Object.create
				var mon_upload_menu = Object.create(upload_menu_prototype);
				// Run the initialization function
				mon_upload_menu.init(options, this); // `this` refers to the element	 
				// Save the instance of the object in the element's data store
				$.data(this, 'wikid_upload_menu', mon_upload_menu);
			});
		}
		
	};
}(jQuery));
