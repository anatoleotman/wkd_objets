$(document).ready(function() {

	$(document).wikid_login_form_dialog();
	
	// desactive les liens et utilise ajax pour afficher les pages
	$('#page_cadre').wikid_objets_navigation({
	
		on_display_ajax_callback: function () {
			//canvas_back.images_build_canvas_on_mouse_over(this);
		}	
	});
	var plugin_navigation_wikid = $('#page_cadre').data('wikid_objets_navigation'); 
	// si besoin d'appeler des methodes de cet objet depuis le $(document).ready(function()
	//plugin_navigation_wikid.display_url_base_hash();
	
	// LOGIN
	if (WIKIDGLOBALS.LOGIN_FLAG) {
		// ouvre un jstree pour modifier le menu
		$('#menu_cadre').jstree_menu_wikid({
			on_refresh_callback: function () {
				//$(this).menu_wikid_anime();
			}
		});
		
		// menu upload
		
		$(document).wikid_upload_menu();
		
		// edit mode avec ckeditor3
		$('.wrapper_wikidable').wikid_inline_edit_mode_wrapper({
	
			on_update_callback: function (page_nom) { 
				// arguments fournis depuis l'intérieur de l'objet grâce à function.apply()'
				plugin_navigation_wikid.display_ajax(page_nom);
				console.info(page_nom);
			}
		});
		
		// jstree local pour modifier les sommaire des collections d'objets'
		$('#page_cadre').jstree_sommaires_collections_objets();
	}
});

