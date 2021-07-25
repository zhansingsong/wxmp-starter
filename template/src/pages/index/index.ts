// index.ts
// 获取应用实例
const app = getApp<IAppOption>(); // eslint-disable-line

Page({
  data: {
    showDialog: false,
    oneButton: [{ text: 'gogogo🚀' }],
  },
  onLoad() {
  },
  tapDialog() {
    this.setData({
      showDialog: true,
    });
  },
  tapDialogButton() {
    this.setData({
      showDialog: false,
    });
  },
});
