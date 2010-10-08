/**
* JDZoom Image Detail Popup
* 
* @description Mootools/JavaScript image detail zoom window
* @author Jesse G. Donat
*/

var JDZoom = new Class({

	Implements: [Options],
	Images: [],
	options: {
		'selector': 'a[rel=jdzoom]',
		'classes': {
			placeholder  : 'jdz_img',
			looking_glass:'jdz_looking_glass',
			magnified: 'jdz_magnified'
		},
		'cancel_click' : true,
		'magnified_pos': 'float'
	},

	initialize:  function(options) { 
		this.setOptions(options);		
		this.Images = $$( this.options.selector + ' img' );
		var that = this;
		
		this.Images.each(function(elm, i){
			
			var elmSize = $(elm).getSize();
			var parent_a = elm.getParent('a');
			var lg_href = parent_a.get('href');
			parent_a.setStyles({'position':'relative','display':'block'});
			var rel_pos = parent_a.getPosition( elm );
			
			if( that.options.cancel_click ) {
				parent_a.addEvent('click', function(e){
					e.preventDefault();
				});
			}
			
			var lgimg = that.image( lg_href, { 'onload' : function(){
				
				var repImg = new Element('div', {'class':that.options.classes.placeholder, 'styles':{ 
						'width' : elmSize.x, 
						'height': elmSize.y, 
						'top'   : rel_pos.x,
						'left'  : rel_pos.y
				}});						

				repImg.inject( parent_a );

				var jdzl = new Element('div', {'class':that.options.classes.looking_glass} ).inject( repImg );
				jdzlSize = jdzl.getSize();
				jdzl.fade('hide');

				var jdzm = new Element('div', {'class':that.options.classes.magnified, 'styles':{ 
						'background': 'url(' + escape(lg_href) + ')',
						'width'     : jdzlSize.x / elmSize.x * lgimg.width,
						'height'    : jdzlSize.y / elmSize.y * lgimg.height
				}});
				
				if( that.options.magnified_pos == 'fixed' ) {
					jdzm.inject( repImg );
				}else{
					jdzm.inject( jdzl );
				}
				
				var jdzmSize  = jdzm.getSize(),
					jdzlSize  = jdzl.getSize(),
					repImgPos = repImg.getPosition();

				repImg.addEvent('mouseover', function(){

					var windowSize = window.getSize();
					repImgPos = repImg.getPosition();
					if( Math.abs(elmSize.x - ( windowSize.x - repImgPos.x )) > jdzlSize.x ){
						jdzm.setStyle('left', '100%' );
					}else{
						if( that.options.magnified_pos == 'fixed' ) {
							jdzm.setStyle('left',  0 - jdzmSize.x );
						}else{
							jdzm.setStyle('right', jdzmSize.x );
						}
					}

					jdzl.fade('in');
					if( that.options.magnified_pos == 'fixed' ) jdzm.fade('in');
				});

				repImg.addEvent('mouseout', function(){
					jdzl.fade('out');
					if( that.options.magnified_pos == 'fixed' ) jdzm.fade('out');
				});
				
				repImg.fireEvent('mouseout');

				repImg.addEvent('mousemove', function(ev){
					var posY = (ev.page.y - jdzlSize.y / 2) - repImgPos.y;
					var posX = (ev.page.x - jdzlSize.x / 2) - repImgPos.x;
					jdzl.setStyle('top', posY.limit(0, elmSize.y - jdzlSize.y ) );
					jdzl.setStyle('left', posX.limit(0, elmSize.x - jdzlSize.x ) );
					jdzm.setStyle('background-position', ((posX / (elmSize.x - jdzlSize.x)) * 100).limit(0,100) + '% ' + ((posY / (elmSize.y - jdzlSize.y)) * 100).limit(0,100) + '%' );

				});

				//Internet Explorer Garbage
				if( Browser.Engine.trident ) {
					repImg.setStyles({ 'background':'url('+escape(elm.get('src'))+')' });
					repImg.addEvent('mouseover', function(){ $$('select').fade('out');});
					repImg.addEvent('mouseout',  function(){ $$('select').fade('in'); });
				}

			}});

		});
	},
	
	/** Borrowed from Mootools More - Assets **/
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