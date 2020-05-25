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
    modalingGray: false, // 是否正在弹窗（灰色）
    lastD:{}, // 上个月月份统计数据
    loading: true,  // 是否展示加载动画
    loadingAnimation: {},   // 加载动画透明度变化

    recordsLoadingCount: 0,   // 上拉加载更多次数
    noRecordsMessage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadingAnimationFunction();
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

  loadingAnimationFunction:function(){
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.opacity(0.3).step();
    this.setData({
      loadingAnimation: animation.export()
    })  
  },

  loadingAnimationInOutFunction: function () {
    this.setData({
      loading: true
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
    if (app.globalData.isLoginCompleted) {
      console.log("-- 完成登录后每次打开页面刷新")
      this.setData({
        loading:true
      })
      this.getRecentData();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      recordsLoadingCount: 0,   // 上拉加载更多次数
      noRecordsMessage: ''
    })
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
    if (this.data.noRecordsMessage) {
      return;
    }
    this.loadingAnimationInOutFunction();
    // 上拉触底时刷新更多的账单数据，追加上去
    wx.request({
      url: app.globalData.baseUrl + "api/records/record/recordsLoading",
      header: {
        sessionId: wx.getStorageSync('sessionId')
      },
      data:{
        recordsLoadingCount: this.data.recordsLoadingCount + 1
      },  
      method: "get",
      success: data => {
        var d = data.data.data;
        if(d.noMore || d.tooLong){
          var title = d.noMore ? '已经到底啦！' : '数据太多啦，去账单里继续浏览吧！'
          var that = this
          setTimeout(function(){
            that.setData({
              noRecordsMessage: title,
              loading: false
            })
          },200)
          return;
        }
        this.setData({
          recentRecords: this.data.recentRecords.concat(d.list),
          recordsLoadingCount: d.recordsLoadingCount
        })
        this.setData({
          loading: false
        })
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toMonthStatistics: function () {
    wx.navigateTo({
      url: '../statistics/month',
    })
  },

  startRecord: function() {
    wx.navigateTo({
      url: '../accounts/add-account',
    })
  },

  startRecordWithDt : function(e) {
    var dt = e.currentTarget.dataset.dt
    console.log(dt)
    wx.navigateTo({
      url: '../accounts/add-account?dt=' + dt,
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
            url: '../notes/init'
          });
          return;
        }
        if(d.note.status == 0) {
            // 展示冻结账本，提供选项解冻或创建新账本
            wx.navigateTo({
              url: '../notes/unfreeze?freezeNote=' + JSON.stringify(d.note)
            });
            return;
        }

        console.log("-- 基本数据请求成功，数据正确！", d)

        var recentRecords = d.recentRecords
        if (recentRecords) {
          for (var i = 0; i < recentRecords.length; i++) {
            recentRecords[i].totalSpending = recentRecords[i].totalSpending.toFixed(2)
            for (var j = 0; j < recentRecords[i].records.length; j++) {
              recentRecords[i].records[j].money = recentRecords[i].records[j].money.toFixed(2)
            }
          }
          console.log('-- 账目数据解析成功，数据正确！', recentRecords)
        }

        this.setData({
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
          },
          recentRecords: recentRecords
        }, () => {
          if (d.note.monthStatisticsState != 0){
            this.setData({
              loading: false
            })
          }
        })

        if (this.data.chartsData.categories.length > 0){
          console.log("-- 图表数据正确，将绘制图表")
          // 数据刷新后绘制图表，否则图表会陷入死循环
          this.createLineCharts();
        }
        
        if (d.note.monthStatisticsState == 0) {
          // 月份报告页
          wx.request({
            url: app.globalData.baseUrl + "api/notes/monthStatistics/getLastMonthStatistics",
            header: {
              sessionId: wx.getStorageSync('sessionId')
            },
            method: "get",
            success: data => {
              var lastD = data.data.data
              this.setData({
                lastD: lastD,
                modalingGray: true,
                loading: false
              })
              console.log("-- 月份结算", lastD);
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
      animation: false,
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
    this.setData({
      loading:true
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
        this.getRecentData()
      }
    });
  },

  clear: function () {
    if (this.data.modaling) {
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
    if(this.data.modalingGray){
      this.setData({
        modalingGray: false
      })
    }
  },

  importLastMonthBalance: function(event) {
    var isImport = event.currentTarget.dataset.isImport;
    wx.request({
      url: app.globalData.baseUrl + 'api/notes/monthStatistics/importLastMonthBalance',
      header: {
        sessionId: wx.getStorageSync('sessionId'),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        isImport: isImport
      },
      method: "post",
      success: data => {
        console.log("-- 上月月结数据转结", isImport == 1 ? '转结至本月' : '清零并忽略' , data)
        this.setData({
          modalingGray : false
        })
        this.getRecentData(); 
      }
    });
  },
})