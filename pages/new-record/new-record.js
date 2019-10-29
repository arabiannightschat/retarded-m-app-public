var style = require("../../utils/style.js");
var app = getApp();
Page({

  // 修改账目的类型
  changeRecordsType: function (e) {
    var recordsType = e.currentTarget.dataset.type;
    var currType = '';
    if (recordsType == 0){
      if (this.data.expendList.length > 0){
        currType = this.data.expendList[0].typeId;
      }else {
        currType = ''
      }
    } else {
      if(this.data.incomeList.length > 0){
        currType = this.data.incomeList[0].typeId; 
      } else {
        currType = ''
      }
    }
    this.setData({
      recordsType: recordsType,
      currType: currType
    });
  },

  pickType: function (e) {
    if(!this.data.isShowKeyboard){
      this.setData({
        isShowKeyboard: true
      });
    }
    this.setData({
      currType: e.currentTarget.dataset.type,
    });
  },

  navigateToSet: function(){
    wx.navigateTo({
      url: '../type-manager/type-manager'
    });
  }, 

  /**
   * 页面的初始数据
   */
  data: {
    globalData: {},
    recordsType: 0, // 0.支出，1.收入
    currType:'', // 当前选中类型
    isShowKeyboard:true, // 是否显示键盘
    money:'', // 金额
    incomeList:[], // 收入类型list
    expendList:[], // 支出类型list
    curr : ''// 上一页选择的时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      globalData: app.globalData
    });
    style.loadUI();

    // 获取前一页的数据
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    this.setData({
      curr: prevPage.data.curr
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
    // 查询用户的支出收入类型
    wx.request({
      url: app.globalData.baseUrl + 'api/records/recordsType/getUserRecordsType',
      header: {
        "sessionId": wx.getStorageSync("sessionId")
      },
      method: "get",
      success: data => {
        var currTypeId = data.data.expendList.length > 0 ? data.data.expendList[0].typeId : ''
        this.setData({
          incomeList: data.data.incomeList,
          expendList: data.data.expendList,
          currType: currTypeId
        })
      }
    })  
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

  addCrazyRecords: function(){
    if (this.data.money == 0){
      return;
    }
    wx.request({
      url: app.globalData.baseUrl + 'api/records/crazyRecords/add',
      data:{
        crazyRecords: {
          notesId: app.globalData.currNote,
          typeId: this.data.currType,
          money: this.data.money,
          dt: this.data.curr
        }
      },
      method: "get",
      success: data => {
        wx.showToast({
          title: '已入账',
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
   * 键盘相关
   */
  tapNum: function(e) {
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
    if(indexOf < 0 || indexOf+3 > money.length){
      this.setData({
        money: money + e.currentTarget.dataset.num
      });
    }
  },

  tapRemove: function() {
    this.setData({
      money: this.data.money.substring(0, this.data.money.length - 1)
    })
  },

  tapPoint: function(){
    var money = this.data.money;
    // 如果不存在.则可以输入
    if(money.indexOf(".") == -1){
      this.setData({
        money: money + "."
      });
    }
    // 如果直接输入.则意为0.
    if (money == ''){
      this.setData({
        money: "0."
      });
    }
  },

  tapDown: function(){
    this.setData({
      isShowKeyboard : false,
      money : ''
    })
  }
})