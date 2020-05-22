"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require("vue");

var _vue2 = _interopRequireDefault(_vue);

var _status = require("./status");

var _status2 = _interopRequireDefault(_status);

var _PullLoadTips = require("./PullLoadTips");

var _PullLoadTips2 = _interopRequireDefault(_PullLoadTips);

var _bezierEasing = require("bezier-easing");

var _bezierEasing2 = _interopRequireDefault(_bezierEasing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var easing = (0, _bezierEasing2.default)(0.250, 0.100, 0.250, 1.000);

// const easeOut = bezierEasing(0, 0, 0.58, 1)

// const easeIn = bezierEasing(0.42, 0, 1, 1)

var inserted = function inserted(el, binding) {
  var tipsInstance = el.pullLoadTips;
  if (!tipsInstance) {
    var Tips = _vue2.default.extend(_PullLoadTips2.default);
    tipsInstance = el.pullLoadTips = new Tips({
      el: document.createElement("div")
    });
    el.prepend(el.pullLoadTips.$el);
    el.classList.add("vue-pull-load");
  }

  var options = Object.assign({
    loadHandler: binding.value || function () {
      return Promise.resolve();
    },
    bindToWrapper: false
  }, binding.value);

  var scrollingElement = options.bindToWrapper ? el.parentNode : document.scrollingElement;

  var tipsEl = tipsInstance.$el;
  var tipsHeight = tipsEl.clientHeight;
  var state = {
    useTransform: true,
    enabled: true,
    touching: false,
    bouncing: false,
    bounceTime: 600,
    y: 0,
    minY: 0,
    status: _status2.default.ready,
    distance: tipsHeight
  };
  var helpers = {
    bounceTimer: null,
    tempState: {
      startY: 0,
      lastY: 0,
      y: 0,
      s: 0
    },
    handles: {},
    addEvent: function addEvent(name, handle) {
      if (!this.handles[name]) {
        this.handles[name] = [];
      }
      this.handles[name].push(handle);
      el.addEventListener(name, handle);
    },
    removeEvent: function removeEvent(name, handle) {
      var _this = this;

      if (!name) {
        Object.keys(this.handles).forEach(function (name) {
          _this.removeEvent(name);
        });
        return;
      }
      if (!this.handles[name]) return;
      if (!handle) {
        this.handles[name].forEach(function (h) {
          el.removeEventListener(name, h);
        });
        this.handles[name] = [];
      } else {
        el.removeEventListener(name, handle);
        var index = this.handles[name].findIndex(function (h) {
          return h === handle;
        });
        this.handles[name].splice(index, 1);
      }
    },
    setTimer: function setTimer(callback) {
      this.bounceTimer = window.requestAnimationFrame(callback);
    },
    bounce: function bounce() {
      var _this2 = this;

      if (state.y === state.minY) {
        return;
      }
      state.bouncing = true;
      var len = state.minY - state.y;
      var y = state.y;
      var timeStart = 0;
      var _bounce = function _bounce(oldTime) {
        _this2.setTimer(function (time) {
          if (oldTime) {
            var percent = (time - timeStart) / state.bounceTime;
            if (percent > 1) percent = 1;
            _this2.translateTo(y + easing(percent) * len);
            if (percent === 1) {
              _this2.stopBounce();
              return;
            }
          } else {
            timeStart = time;
          }
          _bounce(time);
        });
      };

      _bounce();
    },
    stopBounce: function stopBounce() {
      state.bouncing = false;
      if (this.bounceTimer) {
        window.cancelAnimationFrame(this.bounceTimer);
        this.bounceTimer = null;
      }
    },
    initEvent: function initEvent() {
      var _this3 = this;

      this.removeEvent();
      this.addEvent("touchstart", function (e) {
        state.touching = true;
        _this3.stopBounce();
        _this3.tempState.y = e.targetTouches[0].screenY;
      });
      this.addEvent("touchmove", function (e) {
        if (!state.enabled) return;
        if (scrollingElement.scrollTop > 0) return;
        if (state.touching) {
          _this3.tempState.lastY = _this3.tempState.y;
          _this3.tempState.y = e.targetTouches[0].screenY;
          _this3.tempState.s = _this3.tempState.y - _this3.tempState.lastY;
          if (_this3.tempState.s > 0 || state.y > 0) {
            e.preventDefault();
            var len = _this3.tempState.s / 3;
            if (state.y + len < 0) {
              len = 0 - state.y;
            }
            _this3.translate(len);
            _this3.setPullingStatus();
          }
        }
      });
      this.addEvent("touchend", function (e) {
        state.touching = false;
        _this3.setLoadingStatus();
        _this3.bounce();
      });
    },
    translateTo: function translateTo(y) {
      // 滚动到y
      state.y = y;
      if (state.useTransform) {
        el.style.webkitTransform = "translateZ(0) translateY(" + y + "px)";
        el.style.transform = "translateZ(0) translateY(" + y + "px)";
      } else {
        el.style.marginTop = y + "px";
      }
    },
    translate: function translate() {
      var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      // 滚动内容
      this.translateTo(state.y + len);
    },
    setStatus: function setStatus(status) {
      state.status = status;
      tipsInstance.status = status;
    },
    setPullingStatus: function setPullingStatus() {
      if (state.status !== _status2.default.loading) {
        if (state.y >= state.distance) {
          this.setStatus(_status2.default.pre);
        } else {
          this.setStatus(_status2.default.ready);
        }
      }
    },
    setLoadingStatus: function setLoadingStatus() {
      var _this4 = this;

      if (state.status === _status2.default.pre) {
        this.setStatus(_status2.default.loading);
        state.minY = state.distance;
        state.enabled = false;
        this.load().then(function () {
          _this4.stopBounce();
          _this4.setStatus(_status2.default.done);
          state.minY = 0;
          state.enabled = true;
          _this4.bounce();
        }).catch(function () {
          _this4.setStatus(_status2.default.error);
          state.enabled = true;
        });
      }
    },
    load: function load() {
      return options.loadHandler();
    }
  };

  helpers.initEvent();

  el.helpers = helpers;
};

var unbind = function unbind(el, binding) {
  el.helpers.removeEvent();
};

exports.default = {
  name: "pull-load",
  inserted: inserted,
  unbind: unbind
};