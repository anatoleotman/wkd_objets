(function($){$.fn.approach=function(styles,distance,callback){var settings={"interval":50,"distance":400},lastRun,elements=[];if(distance)$.extend(settings,{"distance":distance});this.each(function(i,obj){var proxStyles=[],colorStyles=['backgroundColor','borderBottomColor','borderLeftColor','borderRightColor','borderTopColor','color','outlineColor'];$.each(styles,function(style,val){var from,to,unit;if($.inArray(style,colorStyles)>-1&&$.fx.step[style]){from={"number":getRGB($(obj).css(style))};to={"number":getRGB(val)};}else if(style=="opacity"&&!jQuery.support.opacity){opacity=$(obj).css("filter").match(/opacity=(\d+)/)?RegExp.$1/100:"";opacity=opacity===""?"1":opacity;from=getParts(opacity);to=getParts(val);}else{from=getParts($(obj).css(style)),to=getParts(val);}if(from&&to){if(to.relative)to.number=((to.relative=="-="?-1:1)*to.number)+from.number;unit=to.unit||"";proxStyles.push({"name":style,"from":from.number,"to":to.number,"unit":unit});}});$(obj).data("jquery-approach",proxStyles);elements.push(obj);});$(document).bind("mousemove",function(e){var thisRun=new Date().getTime();if(thisRun-lastRun<settings.interval)return;lastRun=thisRun;$.each(elements,function(){var self=this,center=getCenter(self),distance=parseInt(Math.sqrt(Math.pow(e.pageY-center.y,2))),distanceRatio=(settings.distance-distance)/settings.distance,calcStyles={};$.each($(self).data("jquery-approach"),function(){var style=this,calcVal,color;if($.isArray(style.to)){color=(distance>settings.distance)?style.from:$.map(style.from,function(v,k){return parseInt((distanceRatio*(style.to[k]-style.from[k]))+style.from[k]);});calcVal="rgb("+color.join(",")+")";}else{calcVal=(distance>settings.distance)?style.from:(distanceRatio*(style.to-style.from))+style.from;calcVal+=style.unit;}calcStyles[style.name]=calcVal;});$(self).animate(calcStyles,settings.interval-1);});});function getCenter(obj){var offset=$(obj).offset();return{x:offset.left+($(obj).width()/2),y:offset.top+($(obj).height()/2)}};function getParts(val){var parts=val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),relative,number,unit;if(parts){relative=parts[1];number=parseFloat(parts[2]);unit=parts[3];}return{"relative":relative,"number":number,"unit":unit}};if(callback)callback();return this;};function getRGB(color){var result;if(color&&color.constructor==Array&&color.length==3)return color;if(result=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))return[parseInt(result[1],10),parseInt(result[2],10),parseInt(result[3],10)];if(result=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))return[parseFloat(result[1])*2.55,parseFloat(result[2])*2.55,parseFloat(result[3])*2.55];if(result=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))return[parseInt(result[1],16),parseInt(result[2],16),parseInt(result[3],16)];if(result=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))return[parseInt(result[1]+result[1],16),parseInt(result[2]+result[2],16),parseInt(result[3]+result[3],16)];if(result=/rgba\(0, 0, 0, 0\)/.exec(color))return colors['transparent'];return colors[$.trim(color).toLowerCase()];};var colors={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]};})(jQuery);