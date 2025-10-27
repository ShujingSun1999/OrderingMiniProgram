// pages/index/index.js
Page({
  data: {},

  // 跳转到菜单页面
  goToMenu() {
    wx.navigateTo({
      url: '/pages/menu/index'
    });
  },

  // 跳转到订单页面
  goToOrders() {
    wx.navigateTo({
      url: '/pages/orders/index'
    });
  },

  // 跳转到菜品管理页面
  goToFoodManage() {
    wx.navigateTo({
      url: '/pages/food-manage/index'
    });
  }
});
