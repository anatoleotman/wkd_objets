(function ($) {
	var Canvas_wikid_background_Prototype = {
	
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);
			this.$elem_canvas_back = $('#canvas_background');
			this.$elem_cadre_back = $('#cadre_back');
			return this;
		},
		
		options: {
		
		},
		
		images_build_canvas_on_mouse_over: function (elem_ref) {
			
			var that = this;
			var $big_ref = $('big', elem_ref);
			var time_out_pedalo_ivre_background;
			var init_element_canvas = function (img_ref) {
				var canvas = document.createElement("canvas");
				canvas.className  = "canvas_back";
				canvas.height = $(document).height();
				canvas.width = $(document).width();
				canvas.setAttribute('id', img_ref.src);
				var ctx = canvas.getContext("2d");
				ctx.globalAlpha = 0.5;
						//stackBlurImage: function( image_elem_ref, canvasID, radius, blurAlphaChannel )
						//that.StackBlurForCanvas.stackBlurImage(imageObj, canvas, 12, true, 0.9);
						//console.info(imageObj);
    				   // create pattern
       				var ptrn = ctx.createPattern(img_ref,'repeat');
       				
       				ctx.rect(0, 0, $(document).width(), $(document).height());
       				ctx.fillStyle = ptrn;
       				ctx.fill();
       				//ctx.drawImage(img_ref, 0, 0);
       				console.info(canvas);
    				return canvas;
    				console.info(canvas);
			};
			var affiche_pedalo_ivre_canvas_background = function () {
					var image = new Image();
					image.src = WIKIDGLOBALS.BASE_URL + 'application/images/PedaloIvre_alpha50.png';	
				$('#body_principal').css("background-image", "url(" + image.src + ")");
				$('#cadre_back').css('background-color', 'rgba(255, 255, 255, 0.8)');
			};
			
			if ($big_ref.length) {
				$('img', $big_ref)
					.mouseenter(function () {
						if (time_out_pedalo_ivre_background) {
							 clearTimeout(time_out_pedalo_ivre_background);
						}
						console.info($(this).data('canvas'));
						if (!$(this).data('canvas')) {
							var img_canvas = init_element_canvas(this);
							//console.info(img_canvas);
							$(this).data('canvas', img_canvas);//la logique c'est de stocker le canvas une fois produit dans l'élément image, j'espere avec ça que ce canvas sera détruit avec cette image'
						}
						var canvas = $(this).data('canvas');
						//that.display_pattern_canvas_into_background(canvas);					
						console.info(canvas);	
						that.$elem_canvas_back.html(canvas);
						$('#body_principal').css("background-image", "none");
						that.$elem_cadre_back.css('background-color', 'rgba(255, 255, 255, 0.8)');
					})
					.mouseleave(function () {
						that.$elem_cadre_back.css('background-color', 'rgba(0, 0, 0, 0.05)');
						that.$elem_canvas_back.empty();//efface le canvas visible, mais les canvas sont stockés dans chacun des elements images
						
						time_out_pedalo_ivre_background = setTimeout(affiche_pedalo_ivre_canvas_background, 400);
					});
				
				
			}
		},
		
		display_pattern_canvas_into_background: function (canvas_obj) {
			this.$elem.html(canvas_obj);
			
		},

		
		effect_random_highlight: function (elem1, elem2) {
			var random_color1 = Math.floor(Math.random()*256);
	   		var random_color2 = Math.floor(Math.random()*256);
   			var random_color3 = Math.floor(Math.random()*256);
   			var random_color4 = Math.random();
   			var color_target = 'rgba(' 
   					+ random_color1 + ',' 
   					+ random_color2 + ',' 
   					+ random_color3 + ',' 
   					+ random_color4 + ')';  
   			Math.floor(Math.random()*11)+ random_color1 + ',' 
   			$(elem1).effect("highlight", { color: color_target}, 1500);
   			if (elem2) {
   				$(elem2).effect("highlight", { color: color_target}, 1500);
   			}
   			return this;
		},
		
		busy: function () {
			return '<img src="/wicked6/application/views/images/ajax-loader.gif" alt="Loading.." />';
		}
	};

	$.fn.canvas_wikid_background = function (options) {
		if (this.length) {
			return this.each(function () {
				var wikid_canvas_background = Object.create(Canvas_wikid_background_Prototype);
				wikid_canvas_background.init(options, this);
				$(this).data('canvas_wikid_background', wikid_canvas_background);		
			});
		}
	}; 
}(jQuery));
