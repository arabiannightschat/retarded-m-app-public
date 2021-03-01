// pages/statistics/statistics.js
var app = getApp();
var dateUtils = require('../../utils/date.js')
var wxCharts = require('../../utils/wxcharts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    lineChartData: {
      categories: [0], // 日期
      daySpending: [0], // 日花销
      dayBudget: [0] // 日预算
    },
    ringChartsData: [],
    monthStatistics: {},
    monthText: '',
    monthDate: dateUtils.format(new Date()),
    startMonth: '',
    now: dateUtils.format(new Date())
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 获取沉浸栏高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      },
    });
    var monthText = dateUtils.getYear(new Date(this.data.monthDate)) + ' 年 ' + dateUtils.getMonth(new Date(this.data.monthDate)) + ' 月';   
    this.setData({
      monthText: monthText
    })
    this.getMonthStatistics();
  },

  getMonthStatistics() {
    console.log(this.data.monthDate)
    wx.request({
      url: app.globalData.baseUrl + "api/notes/monthStatistics/getMonthStatistics",
      header: {
        sessionId: wx.getStorageSync('sessionId')
      },
      data: {
        monthDate: dateUtils.format(new Date(this.data.monthDate))
      },
      method: "get",
      success: data => {
        var d = data.data.data
        console.log(d)
        d.monthStatistics.monthBudget = d.monthStatistics.monthBudget.toFixed(2)
        this.setData({
          lineChartData: d.lineChartData,
          ringChartsData: d.ringChartsData,
          monthStatistics: d.monthStatistics,
          startMonth: d.startMonth
        });
        if(d.lineChartData.categories.length > 0){
          this.createLineCharts();
        }
        if(d.ringChartsData.length > 0) {
          this.createRingCharts();
        }
      }
    });
  },

  bindMonthChange(e){
    var date = e.detail.value
    this.dateToMonthText(date)
    this.getMonthStatistics();
  },
  dateToMonthText: function (date) {
    date = new Date(date + "-01")
    var monthText = dateUtils.getYear(date) + ' 年 ' + dateUtils.getMonth(date) + ' 月';   
    
    this.setData({
      monthDate: date,
      monthText: monthText
    })
  },

  createLineCharts() {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth * 0.8
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    new wxCharts({
      canvasId: 'lineCanvasMonth',
      width: windowWidth,
      background: 'rgba(0,0,0,0)',
      height: 200,
      type: 'line',
      categories: this.data.lineChartData.categories,
      series: [{
        name: '日预算金额',
        color: '#feb64d',
        data: this.data.lineChartData.dayBudget,
        format: function(val, name) {
          return val.toFixed(2);
        }
      }, {
        name: '日实际消费',
        color: '#9287e7',
        data: this.data.lineChartData.daySpending,
        format: function(val, name) {
          return val.toFixed(2);
        }
      }],
      animation: true,
      xAxis: {
        disableGrid: true,
        fontColor: '#333'
      },
      yAxis: {
        format: function(val) {
          return val.toFixed(0);
        },
        min: 0,
        fontColor: '#333',
        gridColor: '#efefef',
      },
      extra: {
        lineStyle: 'curve',
        legendTextColor: '#333'
      },
      dataLabel: false,
      dataPointShape: false,
    });
    console.log("-- 绘制折线图完成")
  },

  createRingCharts: function() {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth * 0.5
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    new wxCharts({
      canvasId: 'ringCanvasMonth',
      type: 'ring',
      series: this.data.ringChartsData,
      width: windowWidth,
      height: 200,
      dataLabel: true
    });
    console.log("-- 绘制饼状图完成")
  },

  back: function() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})