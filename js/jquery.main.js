// page init
jQuery(function() {
	initZoomImage();
});

// init zoom image
function initZoomImage() {
	jQuery('.zoom-image-holder').zoomImage();
}

/*
 *  jQuery zoom image plugin
 */
;(function($) {
	'use strict';

	var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch || /Windows Phone/.test(navigator.userAgent);

	var ZoomImage = function(options) {
		this.options = $.extend({}, ZoomImage.DEFAULTS, options);
		this.init();
	};

	ZoomImage.prototype = {
		init: function() {
			if (this.options.holder && !isTouchDevice) {
				this.initStructure();
				this.initWrapImage();
				this.initWrapZoom();
				this.initImageZoom();
				this.attachEvents();
				this.makeCallback('onInit', this);
			}
		},
		initStructure: function() {
			this.holder = $(this.options.holder);
			this.image = this.holder.find(this.options.image);
			this.imageSRC = this.holder.data('src') || this.image.attr('src');
		},
		initWrapImage: function() {
			this.imageWrap = $('<div class="zoom-image"></div>');
			this.imageWrap.prependTo(this.holder);
			this.imageWrap.prepend(this.image);
		},
		initWrapZoom: function() {
			this.zoomContainer = $('<div class="zoom-container"></div>');
			this.zoomContainer.appendTo(this.holder);
			this.zoomContainer.css({ height: this.holder.height() * this.options.factor, width: this.holder.width() * this.options.factor });
		},
		initImageZoom: function() {
			this.imageZoom = $('<img />').attr({ src: this.imageSRC });
			this.imageZoom.appendTo(this.zoomContainer);
			this.imageZoom.css({ height: this.holder.height() * this.options.factor, width: this.holder.width() * this.options.factor });
		},
		attachEvents: function() {
			this.bindHandlers();
			this.imageWrap.on('mouseover',  this.onShowZoomWrap);
			this.imageWrap.on('mousemove',  this.onMoveZoomWrap);
			this.imageWrap.on('mouseleave', this.onHideZoomWrap);
		},
		onShowZoomWrap: function() {
			this.zoomContainer.css({ opacity: 1, visibility: 'visible' });
			this.makeCallback('onShow', this);
		},
		onMoveZoomWrap: function(event) {
			var x = event.pageX - this.holder.offset().left;
			var y = event.pageY - this.holder.offset().top;
			var xFactor = (this.imageZoom.width() - this.holder.width()) / this.image.width();
			var yFactor = (this.imageZoom.height() - this.holder.height()) / this.image.height();

			this.imageZoom.css({ left: -x * xFactor, top: -y * yFactor });
		},
		onHideZoomWrap: function() {
			this.zoomContainer.css({ opacity: 0, visibility: 'hidden' });
			this.makeCallback('onHide', this);
		},
		destroy: function() {
			this.image.prependTo(this.holder);
			this.imageWrap.remove();
			this.zoomContainer.removeAttr('style').remove();
			this.imageWrap.off('mouseover',  this.onShowZoomWrap);
			this.imageWrap.off('mousemove',  this.onMoveZoomWrap);
			this.imageWrap.off('mouseleave', this.onHideZoomWrap);
			this.makeCallback('onDestroy', this);
		},
		bindHandlers: function() {
			var self = this;

			$.each(self, function(propName, propValue) {
				if (propName.indexOf('on') === 0 && $.isFunction(propValue)) {
					self[propName] = function() {
						return propValue.apply(self, arguments);
					};
				}
			});
		},
		makeCallback: function(name) {
			var args = Array.prototype.slice.call(arguments);

			if ($.isFunction(this.options[name])) {
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	ZoomImage.DEFAULTS = {
		image: 'img[src]',
		factor: 1.5,
		animatedClass: 'animated'
	};

	// jQuery plugin interface
	$.fn.zoomImage = function(options) {
		return this.each(function() {
			var settings = $.extend({}, options, { holder: this });
			var instance = new ZoomImage(settings);

			$.data(this, 'ZoomImage', instance);
		});
	};
}(jQuery));
