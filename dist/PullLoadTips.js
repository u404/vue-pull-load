"use strict";

;(function () {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _status = require("./status");

  var _status2 = _interopRequireDefault(_status);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  exports.default = {
    name: "pull-load-tips",
    props: {},
    data: function data() {
      return {
        status: _status2.default.ready
      };
    }
  };
})();
if (module.exports.__esModule) module.exports = module.exports.default;
var __vue__options__ = typeof module.exports === "function" ? module.exports.options : module.exports;
__vue__options__.render = function render() {
  var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "pull-load-tips", class: "status-" + _vm.status }, [_c('i', { staticClass: "pull-load-tips-icon" }), _vm._v(" "), _c('span', { staticClass: "pull-load-tips-text" })]);
};
__vue__options__.staticRenderFns = [];