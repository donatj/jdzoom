/**
* JDZoom Image Detail Popup
* 
* @description Mootools/JavaScript image detail zoom window
* @author Jesse G. Donat
*/

var JDZoom = new Class({

	Implements: [Options],

	options: {
		'selector': 'a[rel=jdzoom] img'
	},

	initialize:  function(options) { 
		this.setOptions(options);		
		var zoomImgs = $$( this.options.selector );
		var that = this;
		
		zoomImgs.each(function(elm, i){
			
			var elmSize = $(elm).getSize();
			var parent_a = elm.getParent('a');
			var lg_href = parent_a.get('href');
			parent_a.setStyles({'position':'relative','display':'block'});
			var rel_pos = parent_a.getPosition( elm );
			var lgimg = that.image( lg_href, { 'onload' : function(){
				
				var repImg = new Element('div', {'class':'jdz_img', 'styles':{ 
						'width' : elmSize.x, 
						'height': elmSize.y, 
						'top'   : rel_pos.x,
						'left'  : rel_pos.y
				}});						

				repImg.inject( parent_a );

				var jdzl = new Element('div', {'class':'jdz_looking_glass'} );
				jdzl.inject( repImg );
				jdzlSize = jdzl.getSize();
				jdzl.fade('hide');
				//alert( jdzlSize.x / elmSize.x * lgimgImgSize.x );
				var jdzm = new Element('div', {'class':'jdz_magnified', 'styles':{ 
						'background': 'url(' + lg_href + ')',
						'width'     : jdzlSize.x / elmSize.x * lgimg.width,
						'height'    : jdzlSize.y / elmSize.y * lgimg.height
				}});

				jdzm.inject( jdzl );
				var jdzmSize = jdzm.getSize();
				var jdzlSize = jdzl.getSize();			
				var repImgPos = repImg.getPosition();

				repImg.addEvent('mouseover', function(){

					var windowSize = window.getSize();
					repImgPos = repImg.getPosition();
					if( Math.abs(elmSize.x - ( windowSize.x - repImgPos.x )) > jdzlSize.x ){
						jdzm.setStyle('left', '100%' );
					}else{
						jdzm.setStyle('right', jdzmSize.x );
					}

					jdzl.fade('in');
				});

				repImg.addEvent('mouseout', function(){
					jdzl.fade('out');
				});

				repImg.addEvent('mousemove', function(ev){

					var posY = (ev.page.y - jdzlSize.y / 2) - repImgPos.y;
					var posX = (ev.page.x - jdzlSize.x / 2) - repImgPos.x;
					jdzl.setStyle('top', posY.limit(0, elmSize.y - jdzlSize.y ) );
					jdzl.setStyle('left', posX.limit(0, elmSize.x - jdzlSize.x ) );

					jdzm.setStyle('background-position', ((posX / (elmSize.x - jdzlSize.x)) * 100).limit(0,100) + '% ' + ((posY / (elmSize.y - jdzlSize.y)) * 100).limit(0,100) + '%' );

				});

				//Internet Explorer Garbage
				if( Browser.Engine.trident ) {
					repImg.setStyles({ 'background':'url('+elm.get('src')+')' });
					repImg.addEvent('mouseover', function(){ $$('select').fade('out');});
					repImg.addEvent('mouseout', function(){ $$('select').fade('in'); });
				}

			}});

		});
	},
	
	image: function(source, properties){
		properties = $merge({
			onload: $empty,
			onabort: $empty,
			onerror: $empty
		}, properties);
		var image = new Image();
		var element = document.id(image) || new Element('img');
		['load', 'abort', 'error'].each(function(name){
			var type = 'on' + name;
			var cap = name.capitalize();
			if (properties['on' + cap]) properties[type] = properties['on' + cap];
			var event = properties[type];
			delete properties[type];
			image[type] = function(){
				if (!image) return;
				if (!element.parentNode){
					element.width = image.width;
					element.height = image.height;
				}
				image = image.onload = image.onabort = image.onerror = null;
				event.delay(1, element, element);
				element.fireEvent(name, element, 1);
			};
		});
		image.src = element.src = source;
		if (image && image.complete) image.onload.delay(1);
		return element.set(properties);
	}
	
});