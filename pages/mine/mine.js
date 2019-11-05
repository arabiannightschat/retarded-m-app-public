var nav = require("../nav/nav.js");
var style = require("../../utils/style.js");
var app = getApp();

// pages/mine/mine.js
Page({

  navNotes: function () {
    nav.navNotes();
  },
  navMine: function() {
    nav.navMine();
  },
  navRecords: function () {
    nav.navRecords();
  },
  
  change: function(){
    var idxList = style.getStyleIdxList();
    for (var i = 0; i < idxList.length ; i++) {
      if (idxList[i] == app.globalData.UI.style) {
        if(i == idxList.length - 1){
          style.changeUI(idxList[0])
        } else {
          style.changeUI(idxList[i+1])
        }
        break
      }
    }
    
    this.setData({
      globalData: app.globalData
    });
  },

  typeManager :function (){
    wx.navigateTo({
      url: '../type-manager/type-manager'
    })
  },

  feedback:function(){
    wx.navigateTo({
      url: 'feedback/feedback'
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    globalData: {}, 
    authUserInfo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      globalData: app.globalData
    });
    style.loadUI();

    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo'] == true){
          this.setData({
            authUserInfo: true
          });
        }
      }
    })

  },

  // 获取用户信息回调
  bindGetUserInfo : function(e){
    console.log(e.detail.userInfo);
    wx.request({
      url: app.globalData.baseUrl + 'api/user/addUserInfo',
      header:{
        "sessionId": wx.getStorageSync("sessionId")
      },
      data:{
        'userInfo': e.detail.userInfo
      },
      method: 'get',
      success: data => {

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