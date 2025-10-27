// pages/food-manage/index.js
Page({
  data: {
    categories: ['主食', '饮品', '甜点', '小吃'],
    categoryValues: ['main', 'drink', 'dessert', 'snack'],
    categoryIndex: null,
    foodName: '',
    foodDesc: '',
    foodImage: '',
    foods: []
  },

  onLoad() {
    this.loadFoods();
  },

  // 加载菜品列表
  loadFoods() {
    const foods = wx.getStorageSync('customFoods') || [];
    this.setData({
      foods: foods
    });
  },

  // 菜品名称输入
  onFoodNameInput(e) {
    this.setData({
      foodName: e.detail.value
    });
  },

  // 菜品描述输入
  onFoodDescInput(e) {
    this.setData({
      foodDesc: e.detail.value
    });
  },

  // 分类选择
  onCategoryChange(e) {
    this.setData({
      categoryIndex: e.detail.value
    });
  },

  // 选择图片 - 支持HEIC格式
  chooseImage() {
    wx.showModal({
      title: '图片格式提示',
      content: '微信小程序暂不支持直接选择HEIC格式图片。建议：\n1. 在iPhone设置中将相机格式改为"兼容性最佳"\n2. 或使用JPG/PNG格式图片',
      showCancel: false,
      success: () => {
        this.tryChooseImage(['compressed']);
      }
    });
  },

  // 尝试选择图片（支持重试不同的参数）
  tryChooseImage(sizeTypes, retryCount = 0) {
    wx.chooseImage({
      count: 1,
      sizeType: sizeTypes,
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        console.log('选择的图片路径:', tempFilePath);
        
        // 检查图片格式
        const fileExt = this.getFileExtension(tempFilePath);
        console.log('检测到文件格式:', fileExt);
        
        // HEIC格式处理 - 直接使用
        if (fileExt === 'heic') {
          wx.showModal({
            title: 'HEIC格式提示',
            content: '检测到HEIC格式图片，可能会影响显示效果。是否继续使用？',
            success: (res) => {
              if (res.confirm) {
                // 用户选择继续使用HEIC
                this.setData({
                  foodImage: tempFilePath
                });
                console.log('使用HEIC格式图片:', tempFilePath);
              }
            }
          });
          return;
        }
        
        // 其他格式直接显示
        this.setData({
          foodImage: tempFilePath
        });
        
        console.log('图片设置成功:', this.data.foodImage);
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        
        // 取消选择时不提示
        if (err.errMsg.includes('cancel')) {
          console.log('用户取消了图片选择');
          return;
        }
        
        // 如果是格式不支持的错误，尝试使用original模式
        if (err.errMsg.includes('format') && retryCount === 0) {
          console.log('检测到格式不支持错误，尝试使用original模式');
          this.tryChooseImage(['original'], 1);
          return;
        }
        
        let errorMsg = '选择图片失败';
        if (err.errMsg.includes('permission')) {
          errorMsg = '请授权相册访问权限';
        } else if (err.errMsg.includes('format')) {
          errorMsg = '图片格式不支持，请选择JPG或PNG格式';
        }
        
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 获取文件扩展名
  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  },

  // 添加菜品
  addFood() {
    const { foodName, foodDesc, categoryIndex, foodImage, categoryValues } = this.data;
    
    if (!foodName.trim()) {
      wx.showToast({
        title: '请输入菜品名称',
        icon: 'none'
      });
      return;
    }
    
    if (categoryIndex === null) {
      wx.showToast({
        title: '请选择分类',
        icon: 'none'
      });
      return;
    }
    
    if (!foodImage) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      });
      return;
    }
    
    // 检查图片格式
    const fileExt = this.getFileExtension(foodImage);
    const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'heic'];
    
    if (!supportedFormats.includes(fileExt)) {
      wx.showToast({ title: '图片格式不支持', icon: 'none' });
      return;
    }
    
    // 所有格式都使用原图（包括HEIC）
    const newFood = {
      id: Date.now(),
      name: foodName.trim(),
      description: foodDesc.trim(),
      category: categoryValues[categoryIndex],
      image: foodImage
    };
    
    const foods = [...this.data.foods, newFood];
    wx.setStorageSync('customFoods', foods);
    
    this.setData({
      foods: foods,
      foodName: '',
      foodDesc: '',
      categoryIndex: null,
      foodImage: ''
    });
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  // 删除菜品
  deleteFood(e) {
    const foodId = e.currentTarget.dataset.id;
    const foods = this.data.foods.filter(food => food.id !== foodId);
    
    wx.setStorageSync('customFoods', foods);
    this.setData({
      foods: foods
    });
    
    wx.showToast({
      title: '删除成功',
      icon: 'success'
    });
  }
});
