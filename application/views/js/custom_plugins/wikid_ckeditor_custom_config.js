CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	// Remove some buttons, provided by the standard plugins, which we don't
	// need to have in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';
	
	config.toolbarGroups = [
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
	];
	config.extraPlugins = 'sourcearea,oembed,tableresize,showblocks,showborders,newpage';
	config.oembed_WrapperClass = 'embededContent';
	config.oembed_maxWidth = '100';
	config.oembed_maxHeight = '';
	config.filebrowserBrowseUrl = WIKIDGLOBALS.BASE_DIRECTORY + 'application/third_party/ckeditor/filemanager/index.html';

					// NOTE: Remember to leave 'toolbar' property with the default value (null).
};
