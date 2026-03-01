/*
---
description: JDZoom

license: MIT-style

authors:
	- Jesse G. Donat

provides: 
	- JDZoom
...
*/
var JDZoom = (function() {

	function mergeOptions(defaults, options) {
		var result = {};
		for (var key in defaults) {
			if (defaults.hasOwnProperty(key)) {
				if (typeof defaults[key] === 'object' && defaults[key] !== null) {
					result[key] = mergeOptions(defaults[key], (options && options[key]) ? options[key] : {});
				} else {
					result[key] = (options && options.hasOwnProperty(key)) ? options[key] : defaults[key];
				}
			}
		}
		return result;
	}

	function getSize(el) {
		return { x: el.offsetWidth, y: el.offsetHeight };
	}

	function getPosition(el) {
		var rect = el.getBoundingClientRect();
		return {
			x: rect.left + window.pageXOffset,
			y: rect.top + window.pageYOffset
		};
	}

	function fade(el, state) {
		if (state === 'hide' || state === 'out') {
			el.style.opacity = '0';
			el.style.visibility = 'hidden';
		} else if (state === 'in') {
			el.style.opacity = '1';
			el.style.visibility = 'visible';
		}
	}

	function limit(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	function loadImage(source, onload) {
		var image = new Image();
		image.onload = function() {
			onload(image);
		};
		image.src = source;
		if (image.complete) {
			image.onload = null;
			onload(image);
		}
	}

	function JDZoom(options) {
		var defaults = {
			'selector': 'a[rel=jdzoom]',
			'classes': {
				placeholder  : 'jdz_img',
				looking_glass: 'jdz_looking_glass',
				magnified    : 'jdz_magnified'
			},
			'cancel_click' : true,
			'magnified_pos': 'float'
		};

		this.options = mergeOptions(defaults, options);
		var that = this;

		var elements = document.querySelectorAll(this.options.selector);

		Array.prototype.forEach.call(elements, function(elm) {

			if (elm.tagName.toLowerCase() === 'a') {
				elm = elm.querySelector('img');
				if (!elm) return;
			}

			var elmSize = getSize(elm);
			var parent_a = elm.closest('a');
			if (!parent_a) return;
			var lg_href = parent_a.getAttribute('href');
			parent_a.style.position = 'relative';
			parent_a.style.display = 'block';

			if (that.options.cancel_click) {
				parent_a.addEventListener('click', function(e) {
					e.preventDefault();
				});
			}

			loadImage(lg_href, function(lgimg) {

				var repImg = document.createElement('div');
				repImg.className = that.options.classes.placeholder;
				repImg.style.width  = elmSize.x + 'px';
				repImg.style.height = elmSize.y + 'px';
				repImg.style.top    = '0px';
				repImg.style.left   = '0px';

				parent_a.appendChild(repImg);

				var jdzl = document.createElement('div');
				jdzl.className = that.options.classes.looking_glass;
				repImg.appendChild(jdzl);
				var jdzlSize = getSize(jdzl);
				fade(jdzl, 'hide');

				var jdzm = document.createElement('div');
				jdzm.className = that.options.classes.magnified;
				jdzm.style.background = 'url("' + lg_href + '")';
				jdzm.style.width  = (jdzlSize.x / elmSize.x * lgimg.width)  + 'px';
				jdzm.style.height = (jdzlSize.y / elmSize.y * lgimg.height) + 'px';

				if (that.options.magnified_pos === 'fixed') {
					repImg.appendChild(jdzm);
					fade(jdzm, 'hide');
				} else {
					jdzl.appendChild(jdzm);
				}

				var jdzmSize  = getSize(jdzm),
					repImgPos = getPosition(repImg);

				jdzlSize = getSize(jdzl);

				repImg.addEventListener('mouseover', function() {
					repImgPos = getPosition(repImg);
					if (Math.abs(elmSize.x - (window.innerWidth - repImgPos.x)) > jdzlSize.x) {
						jdzm.style.left = '100%';
					} else {
						if (that.options.magnified_pos === 'fixed') {
							jdzm.style.left = (0 - jdzmSize.x) + 'px';
						} else {
							jdzm.style.right = jdzmSize.x + 'px';
						}
					}

					fade(jdzl, 'in');
					if (that.options.magnified_pos === 'fixed') fade(jdzm, 'in');
				});

				repImg.addEventListener('mouseout', function() {
					fade(jdzl, 'out');
					if (that.options.magnified_pos === 'fixed') fade(jdzm, 'out');
				});

				repImg.dispatchEvent(new Event('mouseout'));

				repImg.addEventListener('mousemove', function(ev) {
					var posY = (ev.pageY - jdzlSize.y / 2) - repImgPos.y;
					var posX = (ev.pageX - jdzlSize.x / 2) - repImgPos.x;
					jdzl.style.top  = limit(posY, 0, elmSize.y - jdzlSize.y) + 'px';
					jdzl.style.left = limit(posX, 0, elmSize.x - jdzlSize.x) + 'px';
					jdzm.style.backgroundPosition =
						limit((posX / (elmSize.x - jdzlSize.x)) * 100, 0, 100) + '% ' +
						limit((posY / (elmSize.y - jdzlSize.y)) * 100, 0, 100) + '%';
				});

			});

		});
	}

	return JDZoom;
})();