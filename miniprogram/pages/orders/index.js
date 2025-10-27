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

  // 分享单个订单（无价格版本）
  shareOrder(e) {
    const order = e.currentTarget.dataset.order;
    
    // 构建分享内容（不含价格）
    let shareText = `💖 亲爱的点餐清单 💖\n`;
    shareText += `----------------\n`;
    
    order.items.forEach(item => {
      shareText += `${item.name} × ${item.quantity}\n`;
    });
    
    shareText += `----------------\n`;
    shareText += `下单时间: ${order.createTime}\n`;
    shareText += `订单号: ${order.id}`;
    
    wx.showModal({
      title: '分享点餐清单',
      content: shareText,
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
