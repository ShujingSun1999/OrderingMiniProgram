// pages/orders/index.js
Page({
  data: {
    orders: []
  },

  // 手动刷新
  refreshOrders() {
    wx.showLoading({ title: '刷新中', mask: true });
    this.loadOrders();
    setTimeout(() => wx.hideLoading(), 1000);
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  onPullDownRefresh() {
    this.loadOrders();
    setTimeout(() => wx.stopPullDownRefresh(), 600);
  },

  // 加载订单
  loadOrders() {
    const localOrders = wx.getStorageSync('orders') || [];
    this.setData({ orders: localOrders }); // 先显示本地，避免白屏

    // 尝试从云端拉取同一 pairCode 的订单
    try {
      const db = wx.cloud.database();
      db.collection('orders')
        .orderBy('createTimeTs', 'desc')
        .get({
          success: (res) => {
            if (Array.isArray(res.data)) {
              this.setData({ orders: res.data });
              wx.setStorageSync('orders', res.data); // 回写本地，保持一致
            }
          },
          fail: (err) => {
            console.error('云端拉取失败', err);
          }
        });
    } catch (e) {
      console.error('云端未初始化或权限问题', e);
    }
  },

  // 切换订单状态：pending <-> completed
  toggleStatus(e) {
    const id = e.currentTarget.dataset.id;
    const orders = wx.getStorageSync('orders') || [];
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      const newStatus = orders[idx].status === 'pending' ? 'completed' : 'pending';
      orders[idx].status = newStatus;
      // 本地更新
      wx.setStorageSync('orders', orders);
      this.setData({ orders });
      // 云端更新
      try {
        const db = wx.cloud.database();
        db.collection('orders').where({ id }).update({
          data: { status: newStatus }
        }).then(() => {
          this.loadOrders();
        }).catch(err => console.error('云端更新失败', err));
      } catch (e) { console.error('未初始化云环境', e); }
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
