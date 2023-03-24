/**
 * Flex Slider
 * Author   : J. Pfeifer @egplusww.com
 * Version  : 1.0.1
 */
(function () {
  "use strict";

  var p,
    isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  //extend Math
  function distance(ax, ay, bx, by) {
    var vx = bx - ax,
      vy = by - ay;
    if (vx !== 0 || vy !== 0) {
      return Math.sqrt(vx * vx + vy * vy);
    }
    return 0.001;
  }

  function extendOptions(options, props) {
    var name;
    for (name in props) {
      if (props.hasOwnProperty(name)) {
        options[name] = props[name];
      }
    }
    return options;
  }

  /**
   * Order
   * @param {Number} max
   * @param {Number} start
   */
  function Order(max, start) {
    this.initialize(max, start);
  }

  p = Order.prototype;

  p.initialize = function (max, start) {
    this.max = max || this.max;
    this.start = start || this.start;
    this.cols = [];
    var i;
    for (i = 0; i < this.max; i++) {
      this.cols.push(i + this.start);
    }
  };

  //unused at the moment
  p.setOrderAt = function (index, order) {
    this.cols[index] = order;
  };

  p.prev = function () {
    var first = this.cols.shift();
    this.cols.push(first);
  };

  p.next = function () {
    var last = this.cols.pop();
    this.cols.unshift(last);
  };

  /**
   * FlexSlider
   * @param {String} selector
   */
  function FlexSlider(selector, options) {
    this.options = extendOptions(FlexSlider.options, options);
    this.selector = selector;
    this.currentMedia = null;
    this.slider = document.querySelector(selector);
    this.table = this.slider.querySelector(".table");
    this.colsPlain = this.slider.querySelectorAll(".col:not(.col-logo)");
    this.cols = [];
    //get table rows and loop through to find all cols
    var i,
      cols,
      dot,
      rows = this.table.querySelectorAll(".row"),
      navigation = this.slider.querySelector(".navigation"),
      l = rows.length;
    for (i = 0; i < l; i++) {
      //console.log("FlexSlider", "row:", this.rows[i]);
      cols = rows[i].querySelectorAll(".col:not(.col-logo)");
      if (i > 1) {
        rows[i].classList.add("col-hover");
      }
      //console.log("FlexSlider", "cols:", cols);
      this.cols.push(cols);
    }
    //create order instance via standard
    this.order = new Order(cols.length, 1);
    //this.slider.dataset.(camelCase);
    if (navigation) {
      this.slideLeft = navigation.querySelector(".slide-left");
      this.slideRight = navigation.querySelector(".slide-right");
      this.pagination = navigation.querySelector(".pagination");
      this.handleDots = this.handleDots.bind(this);
      this.handleSlide = this.handleSlide.bind(this);
      this.handleResize = this.handleResize.bind(this);
      //add dot class indicies
      if (this.pagination) {
        this.dots = navigation.querySelectorAll(".dot");
        l = this.dots.length;
        for (i = 0; i < l; i++) {
          dot = this.dots[i];
          dot.classList.add("dot-" + i);
        }
        this.pagination.addEventListener("click", this.handleDots);
      }
      if (this.slideLeft && this.slideRight) {
        this.slideLeft.addEventListener("click", this.handleSlide);
        this.slideRight.addEventListener("click", this.handleSlide);
      }
      window.addEventListener("resize", this.handleResize);
      this.handleResize();
    } else {
      this.setSize();
    }
    this.navigation = navigation;
    //
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    if (this.options.flag > 0) {
      this.table.addEventListener(
        this.options.EVENT_DOWN,
        this.handlePointerDown
      );
    }
    console.log("FlexSlider", "slider:", this.slider);
    console.log("FlexSlider", "navigation:", this.navigation);
    console.log("FlexSlider", "slideLeft:", this.slideLeft);
    console.log("FlexSlider", "slideRight:", this.slideRight);
    console.log("FlexSlider", "pagination:", this.pagination);
    //console.log("FlexSlider", "rows:", rows);
    //console.log("FlexSlider", "dots:", this.dots);
    //console.log("FlexSlider", "cols:", this.cols);
    //console.log("FlexSlider", "colsPlain:", this.colsPlain);
    console.log("FlexSlider", "order:", this.order);
  }

  p = FlexSlider.prototype;

  FlexSlider.options = {
    // @see index.scss .slider
    media: [
      { width: 360, cols: 2 },
      { width: 380, cols: 2 },
      { width: 480, cols: 3 },
      { width: 768, cols: 4 },
      { width: 860, cols: 5 },
      { width: 992, cols: 6 },
    ],
    loop: false,
    minDistanceToDrag: 2,
    minDistanceYToCancel: 30,
    minDistanceToSwipe: 40,
    gutters: 16,
  };

  FlexSlider.extendOSEventNames = function (options) {
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
        options.EVENT_DOWN = "mousedown";
        options.EVENT_UP = "mouseup";
        options.EVENT_MOVE = "mousemove";
        break;
      case 1:
        options.EVENT_DOWN = "touchstart";
        options.EVENT_UP = "touchend";
        //options.EVENT_CANCEL = 'touchcancel';
        options.EVENT_MOVE = "touchmove";
        break;
      case 2:
        options.EVENT_DOWN = "pointerup";
        options.EVENT_UP = "pointerdown";
        options.EVENT_MOVE = "pointermove";
        break;
      case 3:
        options.EVENT_DOWN = "MSPointerDown";
        options.EVENT_UP = "MSPointerUp";
        options.EVENT_MOVE = "MSPointerMove";
        break;
    }
    options.flag = flag;
    return options;
  };

  FlexSlider.extendOSEventNames(FlexSlider.options);

  FlexSlider.instances = [];

  /**
   * FlexSlider factory method - without param 'selector' this function returns the last Instance created
   * @param {String} selector
   * @returns {FlexSlider}
   */
  FlexSlider.get = function (selector, options) {
    var i,
      flexSlider,
      instances = FlexSlider.instances,
      l = instances.length;
    //early out
    if (!selector) {
      return instances.length ? instances[0] : null;
    }
    //3-2-1 loop
    for (i = 0; i < l; i++) {
      flexSlider = instances[i];
      if (flexSlider.selector === selector) {
        return flexSlider;
      }
    }
    flexSlider = new FlexSlider(selector, options);
    FlexSlider.instances.push(flexSlider);
    return flexSlider;
  };

  p.handlePointerDown = function (e) {
    var opts = this.options;
    opts.origX = e.clientX || e.touches[0].clientX;
    opts.origY = e.clientY || e.touches[0].clientY;
    //console.log("FlexSlider", "handlePointerDown", "opts:", opts);
    this.table.addEventListener(opts.EVENT_MOVE, this.handlePointerMove);
    document.body.addEventListener(opts.EVENT_UP, this.handlePointerUp);
  };

  p.handlePointerMove = function (e) {
    var opts = this.options;
    opts.x = e.clientX || e.touches[0].clientX;
    opts.y = e.clientY || e.touches[0].clientY;
    opts.distance = distance(opts.origX, opts.origY, opts.x, opts.y);
    opts.distanceY = Math.abs(opts.y - opts.origY);
    if (opts.x < opts.origX) {
      opts.direction = "left";
    } else if (opts.x > opts.origX) {
      opts.direction = "right";
    }
    if (opts.distanceY < opts.minDistanceYToCancel) {
      e.preventDefault();
    }
    //console.log("FlexSlider", "handlePointerMove", "opts:", opts);
  };

  p.handlePointerUp = function (e) {
    var opts = this.options;
    document.body.removeEventListener(opts.EVENT_UP, this.handlePointerUp);
    this.table.removeEventListener(opts.EVENT_MOVE, this.handlePointerMove);
    opts.distance = distance(opts.origX, opts.origY, opts.x, opts.y);
    opts.distanceY = Math.abs(opts.y - opts.origY);
    if (
      opts.distanceY < opts.minDistanceYToCancel &&
      opts.distance > opts.minDistanceToSwipe
    ) {
      if (opts.direction === "left") {
        this.next();
      } else if (opts.direction === "right") {
        this.prev();
      }
    }
    //console.log("FlexSlider", "handlePointerUp", "opts:", opts);
  };

  p.handleResize = function () {
    this.setSize();
    this.setPagination();
    this.setArrowState();
  };

  p.handleSlide = function (e) {
    var direction = e.target.classList.contains("slide-left") ? -1 : 1;
    console.log(
      "FlexSlider",
      "handleSlide",
      "event:",
      e,
      "order:",
      this.order,
      "direction:",
      direction
    );
    if (direction > 0) {
      this.next();
    } else if (direction < 0) {
      this.prev();
    }
  };

  p.handleDots = function (e) {
    var i,
      dot,
      dots = this.dots,
      l = dots.length,
      index = 0,
      count = 0,
      list = e.target.classList,
      isDot = list.contains("dot") && list.contains("unvisible");
    if (isDot) {
      index = parseInt(e.target.classList.item(1).split("dot-")[1], 10);
      for (i = index - 1; i >= 0; i--) {
        dot = dots[i];
        count++;
        if (!dot.classList.contains("unvisible")) {
          break;
        }
        if (i === 0) {
          count = 0;
        }
      }
      if (count === 0) {
        for (i = index + 1; i < l; i++) {
          dot = dots[i];
          count--;
          if (!dot.classList.contains("unvisible")) {
            break;
          }
        }
        //prev
        for (i = 0; i < Math.abs(count); i++) {
          this.prev();
        }
      } else {
        //next
        for (i = 0; i < count; i++) {
          this.next();
        }
      }
      console.log(
        "FlexSlider",
        "handleDots",
        "index:",
        index,
        "count:",
        count,
        "order:",
        this.order.cols[index],
        "visibleCols:",
        this.visibleCols
      );
    }
  };

  p.removeOrder = function () {
    var i,
      j,
      cols,
      l = this.order.max;
    for (i = 0; i < this.cols.length; i++) {
      cols = this.cols[i];
      for (j = 0; j < cols.length; j++) {
        cols[j].classList.remove("order-" + this.order.cols[j]);
        //console.log("FlexSlider", "removeOrder", "col:", cols[j], "order:", this.order.cols[j]);
      }
    }
  };

  p.resetOrder = function () {
    this.removeOrder();
    this.order.initialize();
    this.setOrder();
  };

  p.setOrder = function () {
    var i,
      j,
      cols,
      l = this.order.max;
    for (i = 0; i < this.cols.length; i++) {
      cols = this.cols[i];
      for (j = 0; j < cols.length; j++) {
        cols[j].classList.add("order-" + this.order.cols[j]);
        //console.log("FlexSlider", "setOrder", "col:", cols[j], "order:", this.order.cols[j]);
      }
    }
  };

  p.setPagination = function () {
    var i,
      dot,
      col,
      dots = this.dots,
      cols = this.order.cols,
      l = this.order.max;
    for (i = 0; i < l; i++) {
      col = cols[i];
      dot = dots[i];
      dot.classList.remove("unvisible");
      if (col > this.visibleCols) {
        dot.classList.add("unvisible");
      }
    }
  };

  p.setSize = function () {
    console.log("FlexSlider", "setSize", "*");
    var i,
      col,
      media,
      colWidth,
      highestMedia,
      maxWidth,
      maxCols,
      tableWidth,
      opts = this.options,
      mediaLength = opts.media.length,
      //breakpoint behavior
      winWidth = window.innerWidth,
      //our main container inside celek with padding left and right
      availableWidth = 1,
      colLogoWidth = 100,
      //this ist the visible part of the table without logo and gutters
      colSpace = winWidth;
    if (document.body.querySelector("#celek > .main")) {
      availableWidth =
        document.body.querySelector("#celek > .main").clientWidth;
    }
    //
    colLogoWidth = this.table.querySelector(".col-logo").clientWidth;
    colSpace = availableWidth - colLogoWidth - opts.gutters * 2;

    this.visibleCols = 1;
    for (i = 0; i < mediaLength; i++) {
      if (opts.media[i].width > availableWidth) {
        break;
      }
    }
    media = opts.media[i - 1];
    //console.log("FlexSlider", "setSize", "availableWidth:", availableWidth);
    //console.log("FlexSlider", "setSize", "media:", media);
    //console.log("FlexSlider", "setSize", "this.currentMedia:", this.currentMedia);
    this.visibleCols = media.cols;

    //console.log("FlexSlider", "setSize", "media:", media);
    colWidth = Math.ceil(colSpace / this.visibleCols);
    highestMedia = opts.media[mediaLength - 1];
    maxWidth = highestMedia.width;
    console.log(
      "FlexSlider",
      "setSize",
      "colSpace:",
      colSpace,
      "colWidth:",
      colWidth
    );
    if (winWidth < maxWidth) {
      if (this.currentMedia !== media) {
        this.resetOrder();
      }

      maxCols = highestMedia.cols;
      tableWidth = Math.ceil(colLogoWidth + colWidth * maxCols);

      console.log(
        "FlexSlider",
        "setSize",
        "colLogoWidth:",
        colLogoWidth,
        "+ colWidth:",
        colWidth,
        "maxCols:",
        maxCols
      );
      this.table.style.width = tableWidth + "px";
      for (i = 0; i < this.colsPlain.length; i++) {
        col = this.colsPlain[i];
        col.style.flex = "0 1 " + colWidth + "px";
        col.style.maxWidth = colWidth + "px";
        //console.log("FlexSlider", "setSize", "col:", col);
      }
    } else {
      this.table.style.removeProperty("width");
      for (i = 0; i < this.colsPlain.length; i++) {
        this.colsPlain[i].removeAttribute("style");
      }
      this.resetOrder();
    }
    this.currentMedia = media;
    /* console.log("FlexSlider", "setSize", "media -> winWidth:", winWidth);
    console.log("FlexSlider", "setSize", "'#celek>.main -> availableWidth:", availableWidth);
    console.log("FlexSlider", "setSize", "colSpace:", colSpace);
    console.log("FlexSlider", "setSize", "colWidth:", colWidth);
    console.log("FlexSlider", "setSize", "tableWidth:", tableWidth);
    console.log("FlexSlider", "setSize", "colLogoWidth:", colLogoWidth);
    console.log("FlexSlider", "setSize", "highestMedia:", highestMedia);
    console.log("FlexSlider", "setSize", "maxCols:", maxCols);
    console.log("FlexSlider", "setSize", "maxWidth:", maxWidth);
    console.log("FlexSlider", "setSize", "media:", media);
    console.log("FlexSlider", "setSize", "currentMedia:", this.currentMedia);
    console.log("FlexSlider", "setSize", "visibleCols:", this.visibleCols); */
  };

  p.setArrowState = function () {
    var opts = this.options;
    if (this.slideLeft && this.slideRight) {
      this.slideLeft.classList.remove("disabled");
      this.slideRight.classList.remove("disabled");
      //prev
      if (!opts.loop && this.order.cols[0] <= this.visibleCols) {
        this.slideLeft.classList.add("disabled");
      }
      //next
      if (
        !opts.loop &&
        this.order.cols[this.order.max - 1] <= this.visibleCols
      ) {
        this.slideRight.classList.add("disabled");
      }
    }
  };

  p.prev = function () {
    var opts = this.options;
    //console.log("FlexSlider", "prev", "first:", this.order.cols[0], "visibleCols:", this.visibleCols);
    if (opts.loop || this.order.cols[0] > this.visibleCols) {
      this.removeOrder();
      this.order.prev();
      this.setPagination();
      this.setOrder();
      this.setArrowState();
    }
  };

  p.next = function () {
    var opts = this.options;
    //console.log("FlexSlider", "next", "last:", this.order.cols[this.order.max - 1], "visibleCols:", this.visibleCols);
    if (opts.loop || this.visibleCols < this.order.cols[this.order.max - 1]) {
      this.removeOrder();
      this.order.next();
      this.setPagination();
      this.setOrder();
      this.setArrowState();
    }
  };

  // *ENTRY POINT*
  if (!window.EGP) {
    window.EGP = {};
  }

  window.EGP.FlexSlider = FlexSlider;

  /*
  function init() {
    console.log("INSIDE EGP init");
    FlexSlider.get('.slider');
    console.log("INSIDE EGP init", "FlexSlider.get()", FlexSlider.get('.slider'));
    //stop scaling on iOS
    //window.document.addEventListener('touchmove', function (e) { if (e.scale !== 1) { e.preventDefault(); } }, { passive: false });
  }
  //
  window.initEGP = init; */
})();
