// pages/orders/index.js
Page({
  data: {
    orders: []
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  // 加载订单
  loadOrders() {
    const orders = wx.getStorageSync('orders') || [];
    this.setData({
      orders: orders
    });
  },

  // 切换订单状态：pending <-> completed
  toggleStatus(e) {
    const id = e.currentTarget.dataset.id;
    const orders = wx.getStorageSync('orders') || [];
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = orders[idx].status === 'pending' ? 'completed' : 'pending';
      wx.setStorageSync('orders', orders);
      this.setData({ orders });
      wx.showToast({
        title: orders[idx].status === 'completed' ? '烹饪完成！' : '烹饪中...',
        icon: 'success'
      });
    }
  },

  // 分享单个订单（无价格版本）
  shareOrder(e) {
    const order = e.currentTarget.dataset.order;
    
    // 构建分享内容（不含价格）
    let shareText = `💖 囡囡的点餐清单 💖\n`;
    shareText += `----------------\n`;
    
    order.items.forEach(item => {
      shareText += `${item.name} × ${item.quantity}\n`;
    });
    
    shareText += `----------------\n`;
    shareText += `下单时间: ${order.createTime}\n`;
    if (order.remark) {
      shareText += `备注: ${order.remark}\n`;
    }
    
    const modalContent = shareText.replace(/\n/g, '\r\n'); // 兼容不同平台换行
    wx.showModal({
      title: '分享点餐清单',
      content: modalContent,
      showCancel: true,
      cancelText: '取消',
      confirmText: '复制内容',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: shareText,
            success: () => {
              wx.showToast({
                title: '已复制到剪贴板',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  // 页面分享功能
  onShareAppMessage() {
    return {
      title: '我的点餐清单',
      path: '/pages/orders/index',
      imageUrl: '../../images/icons/business.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '我的点餐清单',
      imageUrl: '../../images/icons/business.png'
    };
  },

  // 返回菜单
  goToMenu() {
    wx.navigateTo({
      url: '/pages/menu/index'
    });
  }
});
