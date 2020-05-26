// pages/statistics/statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaChart: null,
    statusBarHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 获取沉浸栏高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      },
    });
  },

  createAreaCharts(){

    var wxCharts = require('../../utils/wxcharts.js');
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth * 0.9
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    this.data.areaChart = new wxCharts({
      canvasId: 'areaCanvas',
      width: windowWidth,
      background: 'rgba(0,0,0,0)',
      height: 250,
      type: 'line',
      categories: ['5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '5-7', '5-8', '5-9', '5-10', '5-11', '5-12', '5-13', '5-14', '5-26', '5-26', '5-26', '5-26', '5-1', '5-2', '5-3', '5-26', '5-26', '5-26', '5-26', '5-26', '5-26', '5-26', '5-26', '5-26', '5-26', '5-26', '5-26', '5-26', '5-26', '5-26'],
      series: [{
        name: '日实际消费',
        color: '#c1acfe',
        data: [10, 100, 20, 50, 19, 62, 34, 39, 61, 10, 100, 20, 50, 19, 62, 34, 39, 61, 10, 100, 20, 50, 19, 62, 34, 39, 61, 10, 100, 20, 50, 19, 62, 34, 39, 61],
        format: function (val, name) {
          return val.toFixed(2);
        }
      },{
        name: '日预算金额',
          color: '#c1acfe',
        data: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      animation:false,
      xAxis: {
        disableGrid: true,
        fontColor: '#fff'
      },
      yAxis: {
        format: function (val) {
          return val.toFixed(0);
        },
        min: 0,
        fontColor: '#fff',
        gridColor: '#664ab7',
      },
      extra: {
        lineStyle: 'curve',
        legendTextColor: '#fff'
      },
      dataLabel: false,
      dataPointShape: false,
    });
    console.log("-- 绘制图表完成")
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
    this.createAreaCharts();
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