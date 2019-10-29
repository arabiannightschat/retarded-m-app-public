// pages/export/export.js
var style = require("../../utils/style.js");
var dateUtils = require("../../utils/date.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDateValue: '2018-12-12',
    endDateValue: '2018-10-12',
    contents: 'sjsjsjs',
    animationData:{},
    globalData:{} //全局变量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      globalData: app.globalData
    });
    style.loadUI();
    this.getdate();
  },

  showtimecheck:function(e){

  },

  datePickerBindChangeStart: function (e) {
    this.setData({
      startDateValue: e.detail.value
    })
  },

  datePickerBindChangeEnd: function (e) {
    this.setData({
      endDateValue: e.detail.value
    })
  },

  showChooseBox: function (e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseBox: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  hideChooseBox: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    });
    that.animation = animation;
    animation.translateY(200).step();
    that.setData({
      animationData: animation.export()
    });
    setTimeout(function () {
      animation.translateY(0).step();
      that.setData({
        animationData: animation.export(),
        chooseBox: false
      })
    }, 200)
  },

  thismonth: function (e) {
    var date = new Date();
    var day = dateUtils.getDay(date);
    var month = dateUtils.getMonth(date);
    var year = dateUtils.getYear(date);
    var endDate = dateUtils.format(date);
    var startDay = day;
    var startMonth = month;
    var startYear = year;
    if(day<'06'){
      if(month=="01"){
        startMonth = '12';
        startYear = year-1;
      }
      else{
        startMonth = month-1;
      }
    }
    var startDate = startYear+'-'+startMonth+'-'+'06';
    this.setData({
      startDateValue: startDate,
      endDateValue: endDate,
      chooseBox: false
    })
  },

  lastmonth: function (e) {
    var date = new Date();
    var endDate = dateUtils.format(date);
    var day = dateUtils.getDay(date);
    var month = dateUtils.getMonth(date);
    var year = dateUtils.getYear(date);
    var startMonth = month;
    var endMonth = month;
    var startYear = year;
    var endYear = year;
    if (day < '06') {
      if (month == "01") {
        startMonth = '11';
        endMonth = '12';
        startYear = year - 1;
        endYear = year - 1;
      }
      else if(month=='02'){
        startMonth = '12';
        endMonth = '1';
        startYear = year - 1;
      }
      else{
        endMonth = month - 1;
        startMonth = month - 2;
      }
    }
    else{
      if(month=='01'){
        endMonth = month;
        startMonth = '12';
        startYear = year - 1;
      }
      else{
        startMonth = month - 1;
      }
    }
    var startDate = startYear + '-' + startMonth + '-' + '06';
    endDate = endYear + '-' + endMonth + '-' + '05';
    this.setData({
      startDateValue: startDate,
      endDateValue: endDate,
      chooseBox: false
    })
  },
  copyText: function (e) {
    　　　　console.log(e),
    　　　　wx.setClipboardData({
      　　　　　　data: 'contents',　　
          　　　　success: function (res) {
            wx.getClipboardData({
              success:function(res){
                wx.showToast({
                  title: '复制成功'
                })
              }
            })　　　　　　
          　　　　　　　　　　}
    　　　　})
  　　},

  getdate:function (){
    wx.request({
      url: app.globalData.baseUrl + '/api/crazyNotes/getCrazyNoteInfo',
      data:{
        notesId: app.globalData.currNote
      },
      method:"get",
      success:data =>{
        console.log(data.data);
        this.setData({
          createDt: data.data.createDt,
          settleDate:data.data.settleDate
        })
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