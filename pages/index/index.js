// pages/index/index.js
var app = getApp();
var commUtils = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0, // 沉浸栏高度
    lineChart: null, // 图表对象
    chargeDayCount: wx.getStorageSync('chargeDayCount'), // 记账天数
    isExistNote: false, // 用户是否拥有账本
    isExistRecords: false, // 账本是否拥有近期数据
    simpleData: {
      balance:'', // 账本余额
      dayToNextMonth: '', //距离月末天数
      year: '', // 当前年
      month: '' // 当前月
    },
    chartsData: {
      categories: [0], // 日期
      daySpending: [0], // 日花销
      dayBudget: [0], // 日预算
      dynamicDayBudget: [0] //日动态预算
    },
    recentRecords:[],
    modaling: false, // 是否正在弹窗

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isGotData = false;
    console.log("-- 主页面 index - onLoad");
    var that = this
    // 获取沉浸栏高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      },
    });
    app.loginCallback = res => {
      // 登录回调后获取最近数据
      console.log("-- 登录回调事件触发")
      this.getRecentData(); 
    }
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
    console.log("-- 主页面 index - onShow");
    if (app.globalData.isLoginCompleted) {
      console.log("-- 完成登录后每次打开页面刷新")
      this.getRecentData();
    }
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

  startRecord: function() {
    wx.navigateTo({
      url: '../accounts/add-account',
    })
  },

  /**
   * 获取最近数据
   */
  getRecentData: function () {
    console.log("-- 准备请求最近数据 ",wx.getStorageSync('sessionId'))
    wx.request({
      url: app.globalData.baseUrl + "api/notes/dayStatistics/getRecentData",
      header: {
        sessionId: wx.getStorageSync('sessionId')
      },
      method: "get",
      success: data => {
        var d = data.data.data;
        if (d == null){
          console.log("-- 检测到没有账本，跳转到基本设置页！")
          wx.navigateTo({
            url: '../setting/setting'
          });
          return;
        }
        
        console.log("-- 基本数据请求成功，数据正确！", d)
        this.setData({
          isExistNote: true,
          simpleData: {
            balance: d.balance.toFixed(2), // 账本余额
            dayToNextMonth: d.dayToNextMonth, //距离月末天数
            year: d.year, // 当前年
            month: d.month // 当前月
          },
          chartsData: {
            categories: d.categories, // 日期
            daySpending: d.daySpending, // 日花销
            dayBudget: d.dayBudget, // 日预算
            dynamicDayBudget: d.dynamicDayBudget //日动态预算
          }
        })

        if (this.data.chartsData.categories.length > 0){
          console.log("-- 图表数据正确，将绘制图表")
          this.setData({
            isExistRecords: true
          })
          // 数据刷新后绘制图表，否则图表会陷入死循环
          this.createLineCharts();
        } else {
          console.log("-- 近期没有记账记录，不刷新图表")
        }
      }
    })

    // 请求账目数据
    wx.request({
      url: app.globalData.baseUrl + "api/records/record/getRecentRecords",
      header: {
        sessionId: wx.getStorageSync('sessionId')
      },
      method: "get",
      success: data => {
        var d = data.data.data;
        for(var i = 0 ; i < d.length; i++){
          d[i].totalSpending = d[i].totalSpending.toFixed(2)
          for(var j = 0 ; j < d[i].records.length ; j++) {
            d[i].records[j].money = d[i].records[j].money.toFixed(2)
          }
        }
        console.log('-- 账目数据请求成功，数据正确！',d)
        this.setData({
          recentRecords:d
        })
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
      }, {
        name: '动态预算金额',
          data: this.data.chartsData.dynamicDayBudget,
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
    console.log("-- 绘制图表完成")
  },

  modal: function (e) {
    wx.vibrateShort()
    var p_index = e.currentTarget.dataset.p_index
    var index = e.currentTarget.dataset.index
    console.log(p_index, index)
    var list = this.data.recentRecords
    list[p_index].records[index].delShow = true
    this.setData({
      recentRecords: list,
      modaling: true
    })
    console.log(this.data.recentRecords)
  },

  del: function (e) {
    wx.showLoading({
      title: '正在删除'
    })
    var id = e.currentTarget.dataset.id
    wx.request({
      url: app.globalData.baseUrl + 'api/records/record/delRecord',
      header: {
        sessionId: wx.getStorageSync('sessionId'),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        recordId: id
      },
      method: "post",
      success: data => {
        wx.hideLoading()
        commUtils.toastSuccess("删掉了！")
        this.getRecentData()
      }
    });
    this.setData({
      modaling: false
    })
  },

  clear: function () {
    if (this.data.modaling == true) {
      var list = this.data.recentRecords
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list[i].records.length; j++) {
          list[i].records[j].delShow = false
        }
      }
      this.setData({
        recentRecords: list,
        modaling: false
      })
    }
  },

  // 跳转到初始设置页
  goToSetting: function(){
    wx.navigateTo({
      url: '../setting/setting'
    });
  }
})