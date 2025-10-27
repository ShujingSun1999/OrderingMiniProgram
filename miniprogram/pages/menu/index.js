// pages/menu/index.js
Page({
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'main', name: '主食' },
      { id: 'drink', name: '饮品' },
      { id: 'dessert', name: '甜点' },
      { id: 'snack', name: '小吃' }
    ],
    currentCategory: 'all',
    defaultFoods: [
      {
        id: 1,
        name: '红烧牛肉面',
        description: '香浓牛肉汤底，面条劲道',
        image: '../../images/default-goods-image.png',
        category: 'main'
      },
      {
        id: 2,
        name: '麻辣香锅',
        description: '多种食材，麻辣鲜香',
        image: '../../images/default-goods-image.png',
        category: 'main'
      },
      {
        id: 3,
        name: '珍珠奶茶',
        description: '香浓奶茶，Q弹珍珠',
        image: '../../images/default-goods-image.png',
        category: 'drink'
      },
      {
        id: 4,
        name: '抹茶拿铁',
        description: '日式抹茶，香醇拿铁',
        image: '../../images/default-goods-image.png',
        category: 'drink'
      },
      {
        id: 5,
        name: '提拉米苏',
        description: '意大利经典甜品',
        image: '../../images/default-goods-image.png',
        category: 'dessert'
      },
      {
        id: 6,
        name: '炸鸡翅',
        description: '外酥里嫩，香辣可口',
        image: '../../images/default-goods-image.png',
        category: 'snack'
      }
    ],
    foods: [],
    filteredFoods: [],
    cart: [],
    cartCount: 0
  },

  onLoad() {
    this.loadFoods();
    this.filterFoods('all');
    // 从本地存储加载购物车
    this.loadCart();
  },

  onShow() {
    // 页面显示时重新加载菜品，确保自定义菜品实时更新
    this.loadFoods();
    this.filterFoods(this.data.currentCategory);
  },

  // 加载菜品数据（合并默认和自定义）
  loadFoods() {
    const customFoods = wx.getStorageSync('customFoods') || [];
    const allFoods = [...this.data.defaultFoods, ...customFoods];
    this.setData({
      foods: allFoods
    });
  },

  // 切换分类
  switchCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      currentCategory: categoryId
    });
    this.filterFoods(categoryId);
  },

  // 过滤菜品
  filterFoods(categoryId) {
    let filteredFoods = this.data.foods;
    if (categoryId !== 'all') {
      filteredFoods = this.data.foods.filter(food => food.category === categoryId);
    }
    this.setData({
      filteredFoods: filteredFoods
    });
  },

  // 添加到购物车
  addToCart(e) {
    const food = e.currentTarget.dataset.food;
    let cart = this.data.cart;
    const existingItem = cart.find(item => item.id === food.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...food,
        quantity: 1
      });
    }
    
    this.setData({
      cart: cart,
      cartCount: cart.reduce((total, item) => total + item.quantity, 0)
    });
    
    // 保存到本地存储
    wx.setStorageSync('cart', cart);
    
    wx.showToast({
      title: '已添加到购物车',
      icon: 'success',
      duration: 1000
    });
  },

  // 加载购物车
  loadCart() {
    const cart = wx.getStorageSync('cart') || [];
    this.setData({
      cart: cart,
      cartCount: cart.reduce((total, item) => total + item.quantity, 0)
    });
  },

  // 跳转到购物车
  goToCart() {
    wx.navigateTo({
      url: '/pages/cart/index'
    });
  }
});
