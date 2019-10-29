// pages/mine/feedback/feedback.js
var style = require("../../../utils/style.js");
var commUtils = require("../../../utils/common.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData:{},
    content:'',
    wechatId:''
  },

  commit: function(){
    wx.request({
      url: app.globalData.baseUrl + 'api/sys/receiveFeedback',
      header: {
        "sessionId": wx.getStorageSync("sessionId")
      },
      data: {
        'content': this.data.content,
        'wechatId': this.data.wechatId
      },
      method: 'get',
      success: data => {
        commUtils.toastSuccessAndBack("已提交！");
      }
    })
  },

  bindContentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  bindWechatIdInput: function (e) {
    this.setData({
      wechatId: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      globalData: app.globalData
    });
    style.loadUI();
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