/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.extraPlugins = 'wikid_fat_free_cart';	
	//config.autoGrow_maxHeight = 2000;
	//config.autoGrow_onStartup = true;
	// Remove the Resize plugin as it does not make sense to use it in conjunction with the AutoGrow plugin.
	//config.removePlugins = 'resize';
	config.toolbar_Full =
		[
		    { name: 'document',    items : [ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ] },
		    { name: 'clipboard',   items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
		    { name: 'editing',     items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
		    { name: 'forms',       items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
		    '/',
		    { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
		    { name: 'paragraph',   items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
		    { name: 'links',       items : [ 'Link','Unlink','Anchor', 'wikid_link', 'wikid_fat_free_cart' ] },
		    { name: 'insert',      items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak' ] },
		    '/',
		    { name: 'styles',      items : [ 'Styles','Format','Font','FontSize' ] },
		    { name: 'colors',      items : [ 'TextColor','BGColor' ] },
		    { name: 'tools',       items : [ 'Maximize', 'ShowBlocks','-','About' ] }
		];
	config.filebrowserBrowseUrl = WIKIDGLOBALS.BASE_DIRECTORY + 'application/third_party/ckeditor/filemanager/index.html';
	config.contentsCss = WIKIDGLOBALS.BASE_DIRECTORY + 'application/css/wikid_base.css';
	config.resize_minWidth = 20;
	config.resize_minHeight = 20;
};


