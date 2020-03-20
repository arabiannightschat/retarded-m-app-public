// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    lineChart: null
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
    // 绘制图表
    this.createLineCharts();
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
   * 图表详细数据展示
   */
  touchHandler: function (e) {
    this.data.lineChart.showToolTip(e, {
      background: '#fe5856',
      format: function (item, category) {
        return category + ' ' + item.name + ' : ￥' + item.data
      }
    });
  },

  /**
   * 获取图表数据方法
   */
  getChartsData: function () {
    var categories = ['3-18', '3-19', '3-20', '3-21', '3-22', '3-23', '3-24',];
    var data = [23, 40, 102, 13, 35, null, null];
    var budget = [48.5, 48.5, 48.5, 48.5, 48.5, 48.5, 48.5];
    return {
      categories: categories,
      data: data,
      budget :budget
    }
  },

  /**
   * 创建曲线图
   */
  createLineCharts: function() {
    var wxCharts = require('../../utils/wxcharts.js');
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth * 0.8
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var chartsData = this.getChartsData();
    this.data.lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: chartsData.categories,
      animation: true,
      legend: true,
      series: [{
        name: '日实际消费',
        data: chartsData.data,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }, {
        name: '日预算金额',
          data: chartsData.budget,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: true,
        fontColor :'#333'
      },
      yAxis: {
        format: function (val) {
          return val.toFixed(0);
        },
        min: 0,
        fontColor: '#333',
        gridColor :'#eee'
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  }
})