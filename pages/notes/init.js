// pages/notes/init.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    monthBudget:'', // 月预算
    authUserInfo: false
  },

  bindGetUserInfo: function(e){
    if(!this.data.authUserInfo) {
      wx.request({
        url: app.globalData.baseUrl + 'api/sys/user/addUserInfo',
        header: {
          "sessionId": wx.getStorageSync("sessionId"),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          'userInfo': JSON.stringify(e.detail.userInfo)
        },
        method: 'post',
        success: data => {
          console.log("-- 微信授权登录成功" + e.detail.userInfo)
        }
      })
    }
    this.createNote();
  },

  createNote: function (){
    var that = this;
    // 校验数据
    if (this.data.monthBudget == 0 || this.data.monthBudget == '') {
      wx.showToast({
        title: '您还没有设定月预算呀',
        icon: 'none',
        duration: 400
      })
      return;
    }

    wx.showLoading({
      title: '正在创建',
    })
    wx.request({
      url: app.globalData.baseUrl + 'api/notes/note/createNote',
      header: {
        sessionId: wx.getStorageSync('sessionId'),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        monthBudget: that.data.monthBudget
      },
      method: "post",
      success: data => {
        wx.hideLoading()
        wx.showToast({
          title: '已创建',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo'] == true) {
          this.setData({
            authUserInfo: true
          });
        }
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