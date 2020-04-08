// pages/accounts/add-account.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0, // 沉浸栏高度
    isShowKeyboard: true,
    money: '0.00',
    rem: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 获取沉浸栏高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      },
    });
  },

  back: function(){
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 键盘相关
   */
  tapNum: function (e) {
    var money = this.data.money;
    var indexOf = money.indexOf(".");
    // 最大9.99万元
    if (indexOf == -1 && money.length >= 5) {
      return;
    }
    if (money == 0 && money != '0.') {
      this.setData({
        money: e.currentTarget.dataset.num
      });
      return;
    }
    // 如果是小数点后的第三位数字不能输入
    if (indexOf < 0 || indexOf + 3 > money.length) {
      this.setData({
        money: money + e.currentTarget.dataset.num
      });
    }
  },

  tapRemove: function () {
    this.setData({
      money: this.data.money.substring(0, this.data.money.length - 1)
    })
  },

  tapPoint: function () {
    var money = this.data.money;
    // 如果不存在.则可以输入
    if (money.indexOf(".") == -1) {
      this.setData({
        money: money + "."
      });
    }
    // 如果直接输入.则意为0.
    if (money == '') {
      this.setData({
        money: "0."
      });
    }
  },

  tapDown: function () {
    this.setData({
      isShowKeyboard: false,
      money: ''
    })
  }
})