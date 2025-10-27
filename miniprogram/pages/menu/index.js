// pages/menu/index.js
Page({
  data: {
    categories: [
      { id: 'main', name: '主食' },
      { id: 'cook', name: '炒菜' },
      { id: 'soup', name: '汤' },
      { id: 'snack', name: '小吃' },
      { id: 'breakfast', name: '早餐' },
      { id: 'dessert', name: '甜点' },
      { id: 'drink', name: '饮品' },
      { id: 'all', name: '全部' }
    ],
    currentCategory: 'main',
    defaultFoods: [
      {
        id: 1,
        name: '番茄鸡蛋打卤面',
        description: '番茄鸡蛋加上黑木耳，面条劲道',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/番茄鸡蛋打卤面.png',
        category: 'main'
      },
      {
        id: 2,
        name: '鸡汤',
        description: '冷冷的冬天来一碗热热的鸡汤',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/鸡汤.png',
        category: 'soup'
      },
      {
        id: 3,
        name: '奶茶',
        description: '无糖乌龙茶配上鲜奶',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/奶茶.png',
        category: 'drink'
      },
      {
        id: 4,
        name: '抹茶拿铁',
        description: '日式抹茶，香醇拿铁',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/抹茶拿铁.png',
        category: 'drink'
      },
      {
        id: 5,
        name: '提拉米苏',
        description: '意大利经典甜品',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/default-goods-image.png',
        category: 'dessert'
      },
      {
        id: 6,
        name: '炸鸡柳',
        description: '外酥里嫩，就一个字香！',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/炸鸡柳.png',
        category: 'snack'
      },
      {
        id: 7,
        name: '牛排',
        description: 'T骨优先！没有就选肉眼哦',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/牛排.png',
        category: 'main'
      },
      {
        id: 8,
        name: '咖喱鸡排饭',
        description: '搭配红薯和蘑菇的特制咖喱饭',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/咖喱鸡排饭.png',
        category: 'main'
      },
      {
        id: 9,
        name: '螺狮粉',
        description: '臭臭特制螺蛳粉',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/螺蛳粉.png',
        category: 'main'
      },
      {
        id: 10,
        name: '避风塘虾',
        description: '阿根廷红虾配上蒜香的面包糠，甜甜咸咸美滋味',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/避风塘虾.png',
        category: 'cook'
      },
      {
        id: 11,
        name: '糖醋小排',
        description: '糖醋小排味道好极了！',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/default-goods-image.png',
        category: 'cook'
      },
      {
        id: 12,
        name: '披萨',
        description: '备注想吃什么口味的披萨哦',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/default-goods-image.png',
        category: 'main'
      },
      {
        id: 13,
        name: '芥末虾球',
        description: '清爽的虾球',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/default-goods-image.png',
        category: 'cook'
      },
      {
        id: 14,
        name: '清炒土豆丝',
        description: '小宝爱吃，我就多做！',
        image: 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/foods/default-goods-image.png',
        category: 'main'
      },
    ],
    foods: [],
    filteredFoods: [],
    cart: [],
    cartCount: 0,
    cartIconSrc: ''
  },

  onLoad() {
    this.loadFoods();
    this.filterFoods('all');
    // 从本地存储加载购物车
    this.loadCart();
    // 处理云文件ID为临时URL，避免他人设备无法直接展示
    this.resolveCloudImage();
  },

  onShow() {
    // 页面显示时重新加载菜品，确保自定义菜品实时更新
    this.loadFoods();
    this.filterFoods(this.data.currentCategory);
    // 从本地存储同步购物车数量，避免返回菜单后角标未更新
    this.loadCart();
    this.resolveCloudImage();
  },

  // 将 fileID 转换为可访问的临时 URL
  resolveCloudImage() {
    const fileID = 'cloud://cloud1-7g986hb4f0e18df6.636c-cloud1-7g986hb4f0e18df6-1384394849/icon/cart.png';
    if (!wx.cloud) return;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: (res) => {
        const url = res.fileList && res.fileList[0] && res.fileList[0].tempFileURL;
        if (url) this.setData({ cartIconSrc: url });
      },
      fail: (e) => {
        console.error('获取临时URL失败', e);
      }
    });
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
