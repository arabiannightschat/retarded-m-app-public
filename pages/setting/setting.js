// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    monthBudget:'', // 月预算
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  // 月预算不能超过10万,非法输入被禁止
  limitInputs: function (e) {
    var v1 = e.detail.value;
    if (v1 >= 100000) {
      v1 /= 10;
    }
    this.setData({
      monthBudget: v1
    })
  },
  // 格式化为两位小数
  limitInputsBlur: function (e) {
    var v1 = e.detail.value;
    if (v1 == '') {
      v1 = '';
    } else {
      var v1 = parseFloat(v1).toFixed(2);
    }
    this.setData({
      monthBudget: v1
    })
  },
})