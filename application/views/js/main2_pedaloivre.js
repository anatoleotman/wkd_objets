
$(document).ready(function() {
	//$('#page_cadre').canvas_wikid_background();
	//var canvas_back = $('#page_cadre').data('canvas_wikid_background');
	$(document).wikid_navigation({
		//options
		on_display_ajax_callback: function () {
			//canvas_back.images_build_canvas_on_mouse_over(this);
		}	
	});
	// desactive les liens et utilise ajax pour afficher les pages
	var plugin_navigation_wikid = $(document).data('wikid_navigation');
	plugin_navigation_wikid.make_ajax_links();//à reactiver à chaque fois que l'on recharge le menu'
		
	plugin_navigation_wikid.start_display_all_ajax(); //requête ajax pour afficher les contenus avec les coordonnees'
	
    	$('#menu').menu_wikid_anime();
	var mon_menu_wikid = $('#menu').data('menu_wikid_anime');
	mon_menu_wikid.hide_submenu_elements();
	mon_menu_wikid.bind_click_on_categories();
	
	$(document).wikid_login_form_dialog();
	var my_login_form_dialog = $(document).data('wikid_login_form_dialog');
	console.info($(document).data());
	
	var affiche_background = function () {
		
		$('#cadre_back').css('background-color', 'rgba(255, 255, 255, 0.9)');
	};
	
	setTimeout(affiche_background, 700);
	




	if (WIKIDGLOBALS.LOGIN_FLAG) {
		// ouvre un jstree lors d'un double click'
		$('#menu_cadre').jstree_menu_wikid0({
			on_refresh_callback: function () {
			
				//plugin_navigation_wikid.make_ajax_links();// il faudra utiliser event delagations
				//$(this).menu_wikid_anime(); // pas la peine de ré instancier le plugin
				var mon_menu_wikid = $('#menu').data('menu_wikid_anime'); // get plugin instance
				mon_menu_wikid.hide_submenu_elements();
				mon_menu_wikid.bind_click_on_categories();
				mon_menu_wikid.approach_plugin_init(); // attention aux leaks
			}
		});
		var mon_menu_jstree_wikid = $('#menu_cadre').data('jstree_menu_wikid0');
		//mon_menu_jstree_wikid.bind_dblclick_on_menu();
		
		$('#menu_cadre').menu_wikid();
		
		
		//ouvre ckeditor lors d'un double click sur les cadres wikidables'
		$('.wrapper_wikidable').wrapper_div_wikidable({
	
			on_div_wikidable_update_callback: function(id, nom, largeur, hauteur) { 
			// arguments fournis depuis l'intérieur de l'objet grâce à function.apply()'
				plugin_navigation_wikid.display_resize_ajax(id, nom, largeur, hauteur);
				//plugin_navigation_wikid.make_ajax_links();// il faudra utiliser event delagations
			}
		});
	
	/*	var mes_divs_wikidables = [];
		$('.wrapper_wikidable').each(function (index) {	
			//console.info($(this).data('wrapper_div_wikidable'));
			mes_divs_wikidables[index] = $(this).data('wrapper_div_wikidable').bind_dblclick_on_div_wikidable();
		});*/		
	}
});

