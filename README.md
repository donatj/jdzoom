JDZoom
======

JDZoom is a small MooTools plugin that enlarges a hovered portion of an image in a small detail box.

How to Use
----------

There are no required parameters, but it will accept a single parameter object. 

  - selector - *what to apply JDZoom on*
    - **Default**: 'a[rel=jdzoom]'
    - **Accepts**: Selector String, Element, Array of Elements
  - classes
    - placeholder - *Placeholder div which holds all the fun*
      - **Default**: 'jdz_img'
    - looking_glass - *The box hiliting the zoomed section*
      - **Default**: 'jdz_looking_glass'
    - magnified - *The div holding the magnified image*
      - **Default**: 'jdz_magnified'
  - cancel_click - *Whether to prevent default on the anchor click*
    - **Default**: true,
    - **Accepts**: Boolean
  - magnified_pos - *positioning of magnified version*
    - **Default**: 'float'
    - **Accepts**: 
      - 'float' - *Follows mouse*
      - 'fixed' - *To the right of image, unless width does not allow*

We use the load event rather than domready to ensure images are loaded.  Causes issues in Webkit otherwise.      

	#JavaScript
	window.addEvent('load',function() { 
		var jdz = new JDZoom();
	});


For more specific information visit [http://donatstudios.com/JDZoom][1]


  [1]: http://donatstudios.com/JDZoom