"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _directive = require("./directive");

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_directive2.default.install = function (Vue) {
  Vue.directive(_directive2.default.name, _directive2.default);
};

exports.default = _directive2.default;