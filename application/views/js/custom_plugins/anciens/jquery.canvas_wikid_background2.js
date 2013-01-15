(function ($) {
	var Canvas_wikid_background_Prototype = {
	
		init: function (options, elem) {
			'use strict';
			this.options = $.extend({}, this.options, options);
			this.elem = elem;
			this.$elem = $(elem);
			
			this.build_canvas_elem();
			this.eventify();
;			this.$elem_cadre_back = $('#cadre_back'); // pour changer la couleur du cadre lors de l'affichage du canvas
			return this;
		},
		
		options: {
		
		},
		
		build_canvas_elem: function () {
			var $canvas_span = $('<span>', {
				id: 'canvas_span'	
			});
			var $canvas_background = $( '<canvas>', {
					id: 'canvas_background'	
			});
			$canvas_span.append($canvas_background);
			$('body').append($canvas_span);
			return this;                                    
		},
		
		set_canvas_dimensions: function () {
			
			this.$elem_canvas_back.width = $(document).width();
			this.$elem_canvas_back.height = $(document).height();
			return this;
		},
		
		eventify: function () {
		
			this.$elem.on('mouseenter', 'big', this.HANDLER_on_mouseenter);
			//this.$elem.on('mouseleave', 'big', this.HANDLER_on_mouseleave);
		},
		
		HANDLER_on_mouseenter: function (event) {
			console.info(event.target);
			console.info(event.relatedTarget);
			console.info(event.currentTarget);
			var $image = $('img', this);
			if ($image.length) {
				var offset = $image.offset()
       				var x = event.pageX - offset.left;
				var y = event.pageY - offset.top;
				var w = $image.width();
				var h = $image.height();
				var case_direction;
				if ( (y - h*x/w) > 0 && (y + h*x/w - h) > 0) {case_direction = 'down';}
				if ( (y - h*x/w) < 0 && (y + h*x/w - h) > 0) {case_direction = 'right';}
				if ( (y - h*x/w) > 0 && (y + h*x/w - h) < 0) {case_direction = 'left';}
				if ( (y - h*x/w) < 0 && (y + h*x/w - h) < 0) {case_direction = 'up';}
				
				var canvas = $('#canvas_background');
				//canvas.hide('fade', 'fast');
				canvas[0].height = $(document).height();
				canvas[0].width = $(document).width();
				var ctx = canvas[0].getContext("2d");
    				// create pattern
       				
       				ctx.fillStyle = ctx.createPattern($image[0], "repeat");
       				ctx.globalAlpha = 0.5;
       				ctx.fillRect($(window).scrollLeft(), $(window).scrollTop(), $(window).width(), $(window).height());
       				
       				canvas.show('slide', {direction: case_direction}, 'easeIn');
       				
       				console.info(case_direction);
       				console.info(x);
       				console.info(y);
			}
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
