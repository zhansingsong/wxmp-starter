"use strict";
var app = getApp();
Page({
    data: {
        showDialog: false,
        oneButton: [{ text: 'gogogo🚀' }],
    },
    onLoad: function () {
    },
    tapDialog: function () {
        console.log('单击了', this.data);
        this.setData({
            showDialog: true,
        });
    },
    tapDialogButton: function () {
        this.setData({
            showDialog: false,
        });
    },
});

//# sourceMappingURL=index.js.map
