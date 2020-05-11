// pages/notes/unfreeze.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    freezeNote:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var freezeNote = JSON.parse(options.freezeNote)
    console.log(freezeNote);
    this.setData({
      freezeNote: freezeNote
    })
  },

  unfreeze : function(){
    wx.showLoading({
      title: '正在解冻账本',
    })
    wx.request({
      url: app.globalData.baseUrl + 'api/notes/note/unfreeze',
      header: {
        sessionId: wx.getStorageSync('sessionId'),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "post",
      success: data => {
        wx.hideLoading()
        wx.showToast({
          title: '已解冻账本',
          icon: 'success',
          duration: 400,
          mask: true
        });
        setTimeout(function () {
          wx.navigateBack();
        }, 400)
      }
    })
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

  }
})