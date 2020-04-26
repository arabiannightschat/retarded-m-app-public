// pages/accounts/add-account.js
var app = getApp();
var dateUtils = require("../../utils/date.js");
var commUtils = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0, // 沉浸栏高度
    isShowKeyboard: true,
    money: '0.00',
    rem: '',
    types: {},
    checkedTypeId:'',
    date: '',
    dateText:'今天',
    firstDayOfMonth: '',
    now: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var dt = options.dt
    if(!dt) {
      dt = dateUtils.format(new Date())
    }
    this.dateToDateText(dt)
    console.log(this.data.date)

    var that = this
    // 获取沉浸栏高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      },
    });

    // 获取记账类型
    wx.request({
      url: app.globalData.baseUrl + "api/records/recordsType/getTypes",
      header: {
        sessionId: wx.getStorageSync('sessionId')
      },
      method: "get",
      success: data => {
        this.setData({
          types : data.data.data
        })
      }
    })

    var firstDayOfMonth = dateUtils.getFirstDayOfMonth(new Date());
    var now = dateUtils.format(new Date())
    this.setData({
      firstDayOfMonth: firstDayOfMonth,
      now: now
    })
  },

  back: function(){
    wx.navigateBack();
  },

  pickType: function(e) {
    var typeId = e.currentTarget.dataset.typeId;
    wx.vibrateShort()
    this.setData({
      checkedTypeId : typeId,
      isShowKeyboard: true
    })
  },

  
  inputRem: function(e) {
    this.setData({
      rem: e.detail.value
    })
  },

  addRecord: function() {
    console.log(this.data.checkedTypeId)
    if (!this.data.checkedTypeId){
      commUtils.toastInfo("还没选择记账类型")
      return;
    }
    wx.request({
      url: app.globalData.baseUrl + 'api/records/record/addRecord',
      header: {
        sessionId: wx.getStorageSync('sessionId'),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        recordTypeId : this.data.checkedTypeId,
        money: Number(this.data.money),
        description: this.data.rem,
        dt: new Date(this.data.date)
      },
      method: 'post',
      success : data => {
        commUtils.toastSuccessAndBack('已入账')
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
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var date = e.detail.value
    this.dateToDateText(date)
  },
  dateToDateText: function(date) {
    var dateText = ''
    switch (dateUtils.diffDays(date)) {
      case 0: dateText = '今天'; break;
      case -1: dateText = '昨天'; break;
      case -2: dateText = '前天'; break;
      default: dateText = date
    }
    this.setData({
      date: date,
      dateText: dateText
    })
  }
})