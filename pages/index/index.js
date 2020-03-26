// pages/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0, // 沉浸栏高度
    lineChart: null, // 图表对象
    chargeDayCount: wx.getStorageSync('chargeDayCount'), // 记账天数
    simpleData: {
      balance:'-', // 账本余额
      dayToNextMonth: '-', //距离月末天数
      year: '-', // 当前年
      month: '-' // 当前月
    },
    chartsData: {
      categories: [], // 日期
      daySpending: [], // 日花销
      dayBudget: [], // 日预算
      dynamicDayBudget: [] //日动态预算
    }

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
    this.getRecentData();
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
   * 获取最近数据
   */
  getRecentData: function () {
    console.log("-- 准备请求数据：",wx.getStorageSync('sessionId'))
    wx.request({
      url: app.globalData.baseUrl + "api/notes/dayStatistics/getRecentData",
      header: {
        sessionId: wx.getStorageSync('sessionId')
      },
      method: "get",
      success: data => {
        if(data.data == null){
          console.log("检测到没有账本，跳转到基本设置页！")
        } else {
          var datas = data.data;
          this.setData({
            simpleData: {
              balance: datas.balance, // 账本余额
              dayToNextMonth: datas.dayToNextMonth, //距离月末天数
              year: datas.year, // 当前年
              month: datas.month // 当前月
            },
            chartsData: {
              categories: datas.categories, // 日期
              daySpending: datas.daySpending, // 日花销
              dayBudget: datas.dayBudget, // 日预算
              dynamicDayBudget: datas.dynamicDayBudget //日动态预算
            }
          })
        }
      }
    })
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

    this.data.lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: this.data.chartsData.categories,
      animation: true,
      legend: true,
      series: [{
        name: '日实际消费',
        data: this.data.chartsData.daySpending,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }, {
        name: '日预算金额',
          data: this.data.chartsData.dayBudget,
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