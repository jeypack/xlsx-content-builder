/**
 * ALZA PRODUCT TEMPLATE
 * Author   : J. Pfeifer @egplusww.com
 * Created  : 06.09.2021 - 21.09.2021
 */
(function () {

  'use strict';

  var extendOSEventNames = function (options) {
      if (!options) {
        options = {};
      }
      var flag = 0;
      try {
        document.createEvent("TouchEvent");
        flag = 1;
      } catch (ed) {
        if (window.navigator.pointerEnabled) {
          flag = 2;
        } else if (window.navigator.msPointerEnabled) {
          flag = 3;
        }
      }
      switch (flag) {
        case 0:
          options.EVENT_DOWN = 'mousedown';
          options.EVENT_UP = 'mouseup';
          options.EVENT_MOVE = 'mousemove';
          break;
        case 1:
          options.EVENT_DOWN = 'touchstart';
          options.EVENT_UP = 'touchend';
          //options.EVENT_CANCEL = 'touchcancel';
          options.EVENT_MOVE = 'touchmove';
          break;
        case 2:
          options.EVENT_DOWN = 'pointerup';
          options.EVENT_UP = 'pointerdown';
          options.EVENT_MOVE = 'pointermove';
          break;
        case 3:
          options.EVENT_DOWN = 'MSPointerDown';
          options.EVENT_UP = 'MSPointerUp';
          options.EVENT_MOVE = 'MSPointerMove';
          break;
      }
      options.flag = flag;
      return options;
    },
    config = {},
    mobileWidth = 1195,
    resize = function () {
      extendOSEventNames(config);
      var body = document.getElementsByTagName("body")[0],
        winWidth = window.innerWidth;
      if (config.flag > 0 || winWidth < mobileWidth) {
        body.classList.add('mobile');
      } else if (winWidth >= mobileWidth) {
        if (body.classList.contains('mobile')) {
          body.classList.remove('mobile');
        }
      }
    };

  window.addEventListener('resize', resize, true);
  resize();

}());
