var style = require("../../utils/style.js");
var app = getApp();
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    globalData: {},
    noteType:1, // 0.普通账本，1.疯狂账本
    dailyLimit:'',  //日消费额度
    settleDate: 0,  //月结日
    focus: 'dailyLimit', // 聚焦在
    canCreateCrazy:true, //能否创建疯狂账本
    isShowInfo :false  //是否显示说明
  },

  bindShowInfo : function(){
    this.setData({
      isShowInfo: !this.data.isShowInfo
    })
  },

  tapSettleDate: function(e) {
    this.setData({
      focus:'settleDate'
    })
  },

  taoDailyLimit : function(e){
    this.setData({
      isShowInfo : false,
      focus: 'dailyLimit'
    })
  },

  create: function(){
    
    // 校验数据
    if (this.data.dailyLimit == 0 || this.data.dailyLimit == ''){
      wx.showToast({
        title: '还没有填写每日花销额度',
        icon: 'none',
        duration: 400
      })
      return;
    }
    wx.showLoading({
      title: '正在创建',
    })
    wx.request({
      url: app.globalData.baseUrl + 'api/crazyNotes/addCrazyNote',
      header:{
        sessionId: wx.getStorageSync('sessionId')
      },
      data: {
        dailyLimit: this.data.dailyLimit,
        settleDate: this.data.settleDate
      },
      method: "get",
      success: data => {
        wx.hideLoading()
        wx.showToast({
          title: '已创建',
          icon: 'success',
          duration: 400,
          mask: true
        });
        app.globalData.currNote = data.data.crazyId;
        app.globalData.currNoteCreateDt = data.data.createDt;
        app.globalData.currNoteType = 1;
        app.globalData.isCanAddRecords = true
        setTimeout(function () {
          wx.navigateBack();
        }, 400)
      }
    })
  },

  // 每日额度最高999.99,非法输入会被改掉
  limitInputs: function (e) {
    var v1 = e.detail.value;
    if(v1 >= 1000) {
      v1 /= 10;
    }
    this.setData({
      dailyLimit: v1
    })
  },
  // 每日额度格式化为2位小数
  limitInputsBlur : function(e){
    var v1 = e.detail.value;
    if(v1 == ''){
      v1 = '';
    } else {
      var v1 = parseFloat(v1).toFixed(2);
    }
    this.setData({
      dailyLimit: v1
    })
  },
  // 结算日期格式化为01-28之间的数字
  dateInputsBlur: function (e) {
    var v1 = e.detail.value;
    if(v1 == ''){
      this.setData({
        settleDate:''
      })
      return;
    }
    if(v1 < 1) {
      v1 = 1;
    } else if(v1 > 28) {
      v1 = 28;
    }
    if(v1 <= 10) {
      v1 = '0' + v1.charAt(v1.length - 1);
    }
    this.setData({
      settleDate: v1
    })
  },

  // 修改创建账本的类型
  changeType :function(e){
    if (!this.data.canCreateCrazy){
      return;
    }
    this.setData({
      noteType: e.currentTarget.dataset.type 
    });
  },

  // temp
  tempNotSupport: function(){
    wx.showToast({
      title: '暂不支持创建普通账本，先体验一下疯狂账本吧',
      icon: 'none',
      duration: 400
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