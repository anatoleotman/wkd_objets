(function ($) {
	var img_overlay_effect_prototype = {
	
		init: function (options, elem) {
			'use strict';
				this.options = $.extend({}, this.options, options);
				this.elem = elem;
				this.$elem = $(elem);
				
				this.$elem.addClass('wikid_overlay_effect');
				this._overlay_elem();
				return this;
		},
	
		options: {
	
		},
		
		_overlay_elem: function () {
		// superposer des images
			this.$elem
				.find('img')
				.each(function (index, value) {
					$(this).css({
						'position': 'absolute',
						'top': 0,
						'left': 0
					});
			});
			
			var $first_img_elem = this.$elem.find('img').first();
			this.$elem.css({
				'float': 'left',
				'width': $first_img_elem.css('width'),
				'height': $first_img_elem.css('height')
			});
			this.$elem.rotate({ 
				bind: { 
					mouseover : function() { 
				    		$(this).find('img').each(function (index, value) {
				    			$(this).rotate({
				    				animateTo:30*(index+1)
				    			})
				    		});
					},
					mouseout : function() { 
				    		$(this).find('img').each(function () {
				    			$(this).rotate({
				    				animateTo:0,
				    				callback: function () {
				    				}
				    			});
				    		});
					}
				} 
			});
		}
	};	

	$.fn.img_overlay_effect = function (options) {
		if (this.length) {
			return this.each(function () {
				var my_img_overlay_effect = Object.create(img_overlay_effect_prototype);
				my_img_overlay_effect.init(options, this);
				$(this).data('img_overlay_effect', my_img_overlay_effect);//ou encore $.data(this, 'key', var)
			});
		}
	
	};
}(jQuery))
