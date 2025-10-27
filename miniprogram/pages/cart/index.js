// pages/cart/index.js
Page({
  data: {
    cart: [],
    totalItems: 0
  },

  onLoad() {
    this.loadCart();
  },

  onShow() {
    this.loadCart();
  },

  // 加载购物车
  loadCart() {
    const cart = wx.getStorageSync('cart') || [];
    this.setData({
      cart: cart,
      totalItems: cart.reduce((total, item) => total + item.quantity, 0)
    });
  },

  // 增加数量
  increaseQuantity(e) {
    const foodId = e.currentTarget.dataset.id;
    let cart = this.data.cart;
    const item = cart.find(item => item.id === foodId);
    
    if (item) {
      item.quantity += 1;
      this.setData({
        cart: cart,
        totalItems: cart.reduce((total, item) => total + item.quantity, 0)
      });
      wx.setStorageSync('cart', cart);
    }
  },

  // 减少数量
  decreaseQuantity(e) {
    const foodId = e.currentTarget.dataset.id;
    let cart = this.data.cart;
    const itemIndex = cart.findIndex(item => item.id === foodId);
    
    if (itemIndex !== -1) {
      const item = cart[itemIndex];
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart.splice(itemIndex, 1);
      }
      
      this.setData({
        cart: cart,
        totalItems: cart.reduce((total, item) => total + item.quantity, 0)
      });
      wx.setStorageSync('cart', cart);
    }
  },

  // 结算
  checkout() {
    if (this.data.cart.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    
    // 创建订单
    const order = {
      id: Date.now(),
      items: this.data.cart,
      status: 'pending',
      createTime: new Date().toLocaleString()
    };
    
    // 保存订单
    const orders = wx.getStorageSync('orders') || [];
    orders.unshift(order);
    wx.setStorageSync('orders', orders);
    
    // 清空购物车
    wx.setStorageSync('cart', []);
    this.setData({
      cart: [],
      totalItems: 0
    });
    
    wx.showToast({
      title: '下单成功！',
      icon: 'success',
      duration: 1500
    });
    
    // 跳转到订单页面
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/orders/index'
      });
    }, 1500);
  },

  // 返回菜单
  goToMenu() {
    wx.navigateBack();
  }
});
