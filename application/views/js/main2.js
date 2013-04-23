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
	$('#menu').find('.submenu_item > a')
		.approach({
			"fontSize": "12px"
			, "color": "#CC3300"
			}, 200);
	
	// local scroll pour les ancres
	
	$('#page_cadre').localScroll({
		lazy:true
	});
	
	// slide show pour les images
	$('.slideshow').cycle({
	after: function (currSlideElement, nextSlideElement, options, forwardFlag) {
		$(nextSlideElement).rotate({
			angle:0, 
			animateTo:360, 
		});

	},
	fx:    'zoom', 
	sync:  true, 
	delay: -3000,
	speedIn: 900,
	speedOut: 1200,
	timeout: 100,
	continuous: true,
	//easing: 'easeIn'
});

	$('.image_overlay').img_overlay_effect();
				
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
		
		// bouton ACTIVATE WIKID
		var $label = $('<label>', {
			'for': "edit_mode_checkbox",
			html: "WIKID"
		});
		var $toggle_checkbox = $('<input>', {
			type: "checkbox",
			id: "edit_mode_checkbox",
			title: "Cliquez pour activer le mode WIKID"
		});
		
		var $user_wrapper = $('<div>', {
			id: "user_wrapper"
		})
			.append($toggle_checkbox)
			.append($label);
		
		$user_wrapper.prependTo($('body'));
		$toggle_checkbox.button({
			label: 'Wikid',
			icons: {
				primary: "ui-icon-power"
			}
		});
		$toggle_checkbox
			.button('widget')
			.css({
				'font-size':'14px',
				'margin': '2px',
				'background': 'none'
			});
		//$('#edit_mode_checkbox').tooltip();
		
		var array_colors = [];
		var colors_index = 0;
		var $boutons_edit_mode_wikid = $('button.bouton_edit_mode');
		$boutons_edit_mode_wikid.hide();
		$boutons_edit_mode_wikid.each(function () {
			array_colors.push($(this).css('background-color'));
		});
//		console.info($toggle_checkbox.button('widget'));
//		console.info(array_colors);
		var animate_bg_color = function () {
			$toggle_checkbox.button('widget').animate({
				backgroundColor: array_colors[colors_index]}, 2000, 'linear', function () {
					colors_index = (colors_index === (array_colors.length - 1)) ? 0 : colors_index + 1;
					if (!$toggle_checkbox.attr('checked')) {
						animate_bg_color();
					}
			});
		};
		animate_bg_color();
		$toggle_checkbox.on('change', function () {
			$boutons_edit_mode_wikid.toggle('fade');
			console.info($toggle_checkbox.attr('checked'));
			if (!$toggle_checkbox.attr('checked')) {
				animate_bg_color();
			} else {
				$toggle_checkbox.button('widget').animate({
				backgroundColor: 'rgba(0,0,0,0)'}, 'fast', 'linear');
			}
		});
		
		// jstree local pour modifier les sommaire des collections d'objets'
		$('#page_cadre').jstree_sommaires_collections_objets();
	}
	
//	var win = $(window);

//	win.resize(function() {

//	var win_w = win.width(),
//	win_h = win.height(),
//	$bg    = $("#bg");
//	$bg2    = $("#bg2");
//	// Load narrowest background image based on 
//	// viewport width, but never load anything narrower 
//	// that what's already loaded if anything.
//	var available = [
//	1024, 1280, 1366,
//	1400, 1680, 1920,
//	2560, 3840, 4860
//	];

//	var current = $bg.attr('src').match(/([0-9]+)/) ? RegExp.$1 : null;

//	if (!current || ((current < win_w) && (current < available[available.length - 1]))) {

//	var chosen = available[available.length - 1];

//	for (var i=0; i<available.length; i++) {
//	if (available[i] >= win_w) {
//	  chosen = available[i];
//	  break;
//	}
//	}

//	// Set the new image
//	$bg.attr('src', WIKIDGLOBALS.BASE_DIRECTORY + 'upload/img/background/' + chosen + 'highway.jpg');
//	$bg2.attr('src', WIKIDGLOBALS.BASE_DIRECTORY + 'upload/img/background/' + chosen + 'highway_photocop.jpg');
//	// for testing...
//	// console.log('Chosen background: ' + chosen);

//	}

//	// Determine whether width or height should be 100%
//	if ((win_w / win_h) < ($bg.width() / $bg.height())) {
//	$bg.css({height: '100%', width: 'auto'});
//	$bg2.css({height: '100%', width: 'auto'});
//	} else {
//	$bg.css({width: '100%', height: 'auto'});
//	$bg2.css({width: '100%', height: 'auto'});
//	}
//	
//	$bg2.fadeTo(2500, 0);

//	}).resize();
//	
////	var targets = $(".title, .social");
//	var targets = $('#bg2');
//	if($(window).scrollTop() > 10){
//		//targets.hide();
//	}
//	$(window).scroll(function(){
//		var pos = $(window).scrollTop();
//		var seuil = $(window).height()*0.9;
//		var opacity = ($(window).scrollTop() - seuil) / $(window).height() *2.5;
//		
//	if (pos > seuil) {
//	    targets.stop(true, true).fadeTo("slow", opacity);
//	} else {
//	    targets.stop(true, true).fadeTo("fast", 1 / opacity);
//	}
//	});
});

