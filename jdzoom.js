var JDZoom = new Class({
	
	Implements: [Options],
	
	options: {
		'a': 100
	},
	
	initialize:  function(options) { 
		
		this.setOptions(options);
		
		var zoomImgs = $$('a[rel=jdzoom] img');
		zoomImgs.each(function(elm, i){
			var elmSize = elm.getSize();
			var repImg = new Element('div', {'class':'jdz_img', 'styles':{ 
				'width' : elmSize.x, 
				'height': elmSize.y, 
				'background':'url(' + elm.get('src') + ')' }});
		
			var parent_a = elm.getParent('a');
		
			repImg.replaces(elm);
			
			var repImgPos = repImg.getPosition();
			
			var jdzl = new Element('div', {'class':'jdz_looking_glass'} );
			jdzl.inject( repImg );
			jdzl.fade('hide');
			
			var jdzm = new Element('div', {'class':'jdz_magnified', 'styles':{ 
					'background':'url(' + parent_a.get('href') + ')' } } );
					
			jdzm.inject( jdzl );
			var jdzmSize = jdzm.getSize();
			
			var jdzlSize = jdzl.getSize();
			
			var hoverFire = function(){ repImg.fireEvent('mouseenter'); }
			
			repImg.addEvent('mouseover', function(){
				var windowSize = window.getSize();
				repImgPos = repImg.getPosition();
				if( Math.abs(elmSize.x - ( windowSize.x - repImgPos.x )) > jdzlSize.x ){
					jdzm.setStyle('left', '100%' );
				}else{
					jdzm.setStyle('right', jdzmSize.x );					
				}
//				if( repImgPos -  )
				
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
			
			hoverFire();
			
		});
		
	}
	
});