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
    ringChartsData: []
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
    this.getMonthStatistics();
  },

  getMonthStatistics() {
    wx.request({
      url: app.globalData.baseUrl + "api/notes/monthStatistics/getMonthStatistics",
      header: {
        sessionId: wx.getStorageSync('sessionId')
      },
      data: {
        monthDate: dateUtils.format(new Date)
      },
      method: "get",
      success: data => {
        var d = data.data.data
        console.log(d)
        this.setData({
          lineChartData: {
            categories: d.categories, // 日期
            daySpending: d.daySpending, // 日花销
            dayBudget: d.dayBudget // 日预算
          },
          ringChartsData: d.ringChartsData
        });
        this.createLineCharts();
        this.createRingCharts();
      }
    });
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
    console.log("-- 绘制图表完成")
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