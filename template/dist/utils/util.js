"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = void 0;
var formatTime = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};
exports.formatTime = formatTime;
var formatNumber = function (n) {
    var s = n.toString();
    return s[1] ? s : '0' + s;
};

//# sourceMappingURL=util.js.map
