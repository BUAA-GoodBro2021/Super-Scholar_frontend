(function () {
  'use strict';

  var extend = function () {
    var length = arguments.length,
      target = arguments[0] || {},
      t,
      source,
      key;
    for (
      typeof target != 'object' && typeof target != 'function' && (target = {}),
        length == 1 && ((target = this), t--),
        t = 1;
      t < length;
      t++
    ) {
      source = arguments[t];
      for (key in source)
      // 使用for in会遍历数组所有的可枚举属性，包括原型。
        Object.prototype.hasOwnProperty.call(source, key) 
        && (target[key] = source[key]);
    }
    return target;
  };
    
  var isFunction = function (obj) {
    return typeof obj == 'function' && typeof obj.nodeType != 'number';
  };

  class SliderCaptcha {
    constructor(element, options) {
      this.$element = element;
      this.options = extend({}, SliderCaptcha.DEFAULTS, options);
      this.$element.style.position = 'relative';
      this.$element.style.width = this.options.width + 'px';
      this.$element.style.margin = '0 auto';
      this.init();
    }
  }
  SliderCaptcha.VERSION = '1.0';
  // t.Author = 'argo@163.com';
  SliderCaptcha.Author = 's193725@163.com';
  SliderCaptcha.DEFAULTS = {
    // canvas宽度
    width: 280,
    // canvas高度
    height: 155,
    PI: Math.PI,
    // 滑块边长
    sliderL: 42,
    // 滑块半径
    sliderR: 9,
    // 容错偏差
    offset: 5,
    loadingText: '正在加载中...',
    failedText: '再试一次',
    barText: '向右滑动填充拼图',
    // repeatIcon: 'fa fa-repeat',
    repeatIcon: 'iconfont iconfont-shuaxin',
    maxLoadCount: 3,
    localImages: function () {
      return 'images/Pic' + Math.round(Math.random() * 4) + '.jpg';
    },
    verify: function (arr, url) {
      var ret = false;
      $.ajax({
        url: url,
        data: {
          "datas": JSON.stringify(arr),
        },
        dataType: "json",
        type: "post",
        async: false,
        success: function (result) {
          ret = JSON.stringify(result);
          console.log("返回结果：" + ret)
        }
      });
      return ret;
    },
    // remoteUrl: null,
    remoteUrl: '',
  };
  
  function Plugin(option) {
    var $this = document.getElementById(option.id);
    var options = typeof option === 'object' && option;
    return new SliderCaptcha($this, options);
  }
  window.sliderCaptcha = Plugin;
  window.sliderCaptcha.Constructor = SliderCaptcha;

  var _photo = SliderCaptcha.prototype;

  _photo.init = function () {
    this.initDOM();
    this.initImg();
    this.bindEvents();
  };

  _photo.initDOM = function () {
    var createElementWithClassName = function (element, classNameOfElement) {
        var i = document.createElement(element);
        return (i.className = classNameOfElement), i;
      },
      createCanvas = function (canvasWidth, canvasHeight) {
        var i = document.createElement('canvas');
        return (i.width = canvasWidth), (i.height = canvasHeight), i;
      },
      // canvas 画布对象
      canvas = createCanvas(this.options.width - 2, this.options.height),
      // block 滑块
      block = canvas.cloneNode(true),
      sliderContainer = createElementWithClassName('div', 'sliderContainer'),
      reshIcon = createElementWithClassName('i', 'refreshIcon ' + this.options.repeatIcon),
      sliderMask = createElementWithClassName('div', 'sliderMask'),
      sliderbg = createElementWithClassName('div', 'sliderbg'),
      slider = createElementWithClassName('div', 'slider'),
      // a = n('i', 'fa fa-arrow-right sliderIcon'),
      sliderIcon = createElementWithClassName('i', 'iconfont icon-arrow-right sliderIcon'),
      sliderText = createElementWithClassName('span', 'sliderText');
      
    // block.className = 'block';
    block.className = 'slider-captcha-block';
    sliderText.innerHTML = this.options.barText;
    var el = this.$element;
    /**
     * DEBUG 2022.12.2
     * 这里由于服务器端貌似产生了一些问题，导致 el 元素内部出现了两批
     * “canvas，reshIcon，block，sliderContainer”
     * 但是本地测试完全没问题
     * 感觉可能是 teleport 在不同的环境里导致的
     */
    var child = el.lastElementChild;
    while (child) {
      el.removeChild(child);
      child = el.lastElementChild;
    }
    el.appendChild(canvas);
    el.appendChild(reshIcon);
    el.appendChild(block);
    slider.appendChild(sliderIcon);
    sliderMask.appendChild(slider);
    sliderContainer.appendChild(sliderbg);
    sliderContainer.appendChild(sliderMask);
    sliderContainer.appendChild(sliderText);
    el.appendChild(sliderContainer);
    var _canvas = {
      canvas: canvas,
      block: block,
      sliderContainer: sliderContainer,
      refreshIcon: reshIcon,
      slider: slider,
      sliderMask: sliderMask,
      sliderIcon: sliderIcon,
      text: sliderText,
      // FIXME 这里不加 {willReadFrequently:true} 会有一个警告 warning
      // https://www.dynamsoft.com/web-twain/docs/faq/chrome-106-107-warning.html
      canvasCtx: canvas.getContext('2d', {willReadFrequently:true}),
      blockCtx: block.getContext('2d', {willReadFrequently:true}),
    };

    isFunction(Object.assign) ? Object.assign(this, _canvas) : extend(this, _canvas);
  };

  _photo.initImg = function () {
    var that = this,
      // IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
      isIE = window.navigator.userAgent.indexOf('Trident') > -1,
      // 滑块实际边长
      finalLength = this.options.sliderL + this.options.sliderR * 2 + 3,
      drawImg = function (ctx, operation) {
        // 滑块边长
        var sideLength = that.options.sliderL,
        // 滑块的半径
          borderRadius = that.options.sliderR,
          PI = that.options.PI,
          x0 = that.x,
          y0 = that.y;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.arc(x0 + sideLength / 2, y0 - borderRadius + 2, borderRadius, 0.72 * PI, 2.26 * PI);
        ctx.lineTo(x0 + sideLength, y0);
        ctx.arc(x0 + sideLength + borderRadius - 2, y0 + sideLength / 2, borderRadius, 1.21 * PI, 2.78 * PI);
        ctx.lineTo(x0 + sideLength, y0 + sideLength);
        ctx.lineTo(x0, y0 + sideLength);
        ctx.arc(x0 + borderRadius - 2, y0 + sideLength / 2, borderRadius + 0.4, 2.76 * PI, 1.24 * PI, !0);
        ctx.lineTo(x0, y0);
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();
        ctx[operation]();
        ctx.globalCompositeOperation = isIE ? 'xor' : 'destination-over';
      },

      getRandomNumberByRange = function (start, end) {
        return Math.round(Math.random() * (end - start) + start);
      },
      img = new Image();

    img.crossOrigin = 'Anonymous';
    var loadCount = 0;
    img.onload = function () {
      // 随机创建滑块的位置
      that.x = getRandomNumberByRange(finalLength + 10, that.options.width - (finalLength + 10));
      that.y = getRandomNumberByRange(10 + that.options.sliderR * 2, that.options.height - (finalLength + 10));
      drawImg(that.canvasCtx, 'fill');
      drawImg(that.blockCtx, 'clip');

      that.canvasCtx.drawImage(img, 0, 0, that.options.width - 2, that.options.height);
      that.blockCtx.drawImage(img, 0, 0, that.options.width - 2, that.options.height);

      var positionY = that.y - that.options.sliderR * 2 - 1;
      var imageData = that.blockCtx.getImageData(that.x - 3, positionY, finalLength, finalLength);
      that.block.width = finalLength;
      that.blockCtx.putImageData(imageData, 0, positionY + 1);
      that.text.textContent = that.text.getAttribute('data-text');
    };

    img.onerror = function () {
      loadCount++;
      if (window.location.protocol === 'file:') {
        loadCount = that.options.maxLoadCount;
        console.error("can't load pic resource file from File protocal. Please try http or https");
      }
      if (loadCount >= that.options.maxLoadCount) {
        that.text.textContent = '加载失败';
        that.classList.add('text-danger');
        return;
      }
      img.src = that.options.localImages();
    };

    img.setSrc = function () {
      var src = '',
        xmlRequest;
      loadCount = 0;
      that.text.classList.remove('text-danger');
      isFunction(that.options.setSrc) && (src = that.options.setSrc());
      // NOTE: 给图片的src赋值，这里是采用了国外的图片库 https://xxxx.cos.ap-beijing.myqcloud.com/1/320/240
      (src && src !== '') ||
        (src =
          // 'https://picsum.photos/' +
          'https://loremflickr.com/' +
          that.options.width +
          '/' +
          that.options.height +
          '/?image=' +
          Math.round(Math.random() * 200)
        );

      
      // NOTE: 给图片的src赋值，我在这里直接采用本地图片库，避免因为开源图片库连接不上而产生error
      // src = that.options.localImages();
      
      // IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
      isIE
        ? ((xmlRequest = new XMLHttpRequest()),
          (xmlRequest.onloadend = function (that) {
            var i = new FileReader();
            i.readAsDataURL(that.target.response);
            i.onloadend = function (that) {
              img.src = that.target.result;
            };
          }),
          xmlRequest.open('GET', src),
          (xmlRequest.responseType = 'blob'),
          xmlRequest.send())
        : (img.src = src);
    };

    img.setSrc();
    this.text.setAttribute('data-text', this.options.barText);
    this.text.textContent = this.options.loadingText;
    this.img = img;
  };

  _photo.clean = function () {
    this.canvasCtx.clearRect(0, 0, this.options.width, this.options.height);
    this.blockCtx.clearRect(0, 0, this.options.width, this.options.height);
    this.block.width = this.options.width;
  };

  _photo.bindEvents = function () {
    var that = this;
    this.$element.addEventListener('selectstart', () => false);

    this.refreshIcon.addEventListener('click', function () {
      that.text.textContent = that.options.barText;
      that.reset();
      isFunction(that.options.onRefresh) && that.options.onRefresh.call(that.$element);
    });
    // 起点坐标
    var originX, originY;
    // 拖动轨迹数组
    var trail = [], isMouseDown = false;
    
    var handleDragStart = function (event) {
      if (that.text.classList.contains('text-danger')) 
        return;
      originX = event.clientX || event.touches[0].clientX;
      originY = event.clientY || event.touches[0].clientY;
      isMouseDown = true;
    };
    
    var handleDragMove = function (i) {
      if (!isMouseDown) return false;
      var eventX = i.clientX || i.touches[0].clientX,
        eventY = i.clientY || i.touches[0].clientY,
        moveX = eventX - originX,
        moveY = eventY - originY;

      if (moveX < 0 || moveX + 40 > that.options.width) 
        return false;

      that.slider.style.left = moveX - 1 + 'px'
      var blockLeft = ((that.options.width - 60) / (that.options.width - 40)) * moveX
      that.block.style.left = blockLeft + 'px'
      that.sliderContainer.classList.add('sliderContainer_active')
      that.sliderMask.style.width = moveX + 4 + 'px'
      trail.push(Math.round(moveY))
    };

    var handleDragEnd = function (u) {
      var o, e;
      if (
        !isMouseDown ||
        ((isMouseDown = !1), (o = u.clientX || u.changedTouches[0].clientX), o === originX)
      )
        return !1;
      that.sliderContainer.classList.remove('sliderContainer_active');
      that.trail = trail;
      e = that.verify();
      e.spliced && e.verified
        ? (that.sliderContainer.classList.add('sliderContainer_success'),
        // isFunction(that.options.onSuccess) && that.options.onSuccess.call(that.$element))
        /**
         * NOTE 利用 call 函数将 this 指向 that.$element，从而使得 that.$element 可以使用 onSuccess 函数
         * 这里修改了源码，将轨迹函数传给 onSuccess，这样我们在 onSuccess 也能拿到轨迹数组
         * 就可以在 onSuccess 直接和后端交互。
         */
        isFunction(that.options.onSuccess) && that.options.onSuccess.call(that.$element, trail))
        : (that.sliderContainer.classList.add('sliderContainer_fail'),
        isFunction(that.options.onFail) && that.options.onFail.call(that.$element),
          setTimeout(function () {
            that.text.innerHTML = that.options.failedText;
            that.reset();
          }, 1e3));
    };
    

    this.slider.addEventListener('mousedown', handleDragStart);
    this.slider.addEventListener('touchstart', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('mousedown', () => false);
    document.addEventListener('touchstart', () => false);
    document.addEventListener('swipe', () => false);
    
    // this.block.addEventListener('mousedown', handleDragStart);
    // this.block.addEventListener('touchstart', handleDragStart);
    // this.block.addEventListener('mousemove', handleDragMove);
    // this.block.addEventListener('touchmove', handleDragMove);
    // this.block.addEventListener('mouseup', handleDragEnd);
    // this.block.addEventListener('touchend', handleDragEnd);
    // this.block.addEventListener('mousedown', () => false);
    // this.block.addEventListener('touchstart', () => false);
    // this.block.addEventListener('swipe', () => false);

  };

  _photo.verify = function () {
    var n = this.trail,
      r = parseInt(this.block.style.left),
      t = !1;

    if (this.options.remoteUrl !== null)
      t = this.options.verify(n, this.options.remoteUrl);
    else {
      var i = function (n, t) {
          return n + t;
        },
        u = function (n) {
          return n * n;
        },
        f = n.reduce(i) / n.length,
        e = n.map(function (n) {
          return n - f;
        }),
        o = Math.sqrt(e.map(u).reduce(i) / n.length);
      t = o !== 0;
    }
    return { spliced: Math.abs(r - this.x) < this.options.offset, verified: t };
  };

  _photo.reset = function () {
    this.sliderContainer.classList.remove('sliderContainer_fail');
    this.sliderContainer.classList.remove('sliderContainer_success');
    this.slider.style.left = 0;
    this.block.style.left = 0;
    this.sliderMask.style.width = 0;
    this.clean();
    this.text.setAttribute('data-text', this.text.textContent);
    this.text.textContent = this.options.loadingText;
    this.img.setSrc();
  };
})();
//# sourceMappingURL=longbow.slidercaptcha.min.js.map
