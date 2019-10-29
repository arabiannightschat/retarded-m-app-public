var nav = require("../nav/nav.js");
var style = require("../../utils/style.js");
var dateUtils = require("../../utils/date.js");
var commUtils = require("../../utils/common.js")
var app = getApp();
Page({

  navNotes: function () {
    nav.navNotes();
  },
  navMine: function () {
    nav.navMine();
  },
  navRecords: function () {
    nav.navRecords();
  },
  navPlus: function () {
    nav.navPlus();
  },  

  modal: function(e){
    wx.vibrateShort()
    var index = e.currentTarget.dataset.index
    var list = this.data.recordsList
    list[index].delShow = true
    this.setData({
      recordsList :list,
      modaling:true
    })
  },

  del: function (e){
    wx.showLoading({
      title: '正在删除'
    })
    var id = e.currentTarget.dataset.id
    wx.request({
      url: app.globalData.baseUrl + 'api/records/crazyRecords/del',
      data: {
        recordsId: id
      },
      method: "get",
      success: data => {
        wx.hideLoading()
        commUtils.toastSuccess("删掉了！")
        this.getCurrRecords()
      }
    });
    this.setData({
      modaling:false
    })
  },

  clear: function(){
    if (this.data.modaling == true){
      var list = this.data.recordsList
      for(var i=0;i<list.length; i++){
        list[i].delShow = false
      }
      this.setData({
        recordsList: list,
        modaling :false
      })
    }
  },

  changeDate :function(current){
    var currDate = this.data.dateList[current].date;
    // 若超出今天跳回到今天
    if (dateUtils.diffDays(currDate) > 0) {
      var list = this.data.dateList;
      for (var i = 0; i < list.length; i++) {
        if (list[i].classText == "curr") {
          list[i].classText = "";
        }
        if (list[i].date == this.data.now) {
          var current = i - 2;
          list[i].classText = "curr";
        }
      }
      this.setData({
        dateList: list,
        current: current,
        curr: this.data.now
      });
      commUtils.toastInfo("不能选择未来的日期记账")
      return;
    }
    // 若早于账本创建日期，跳回账本创建日期
    var createDt = app.globalData.currNoteCreateDt
    var diff = dateUtils.diff(currDate,createDt)
    if (diff < 0){
      var list = this.data.dateList;
      for (var i = 0; i < list.length; i++) {
        if (list[i].classText == "curr") {
          list[i].classText = "";
        }
        if (list[i].date == createDt) {
          var current = i - 2;
          list[i].classText = "curr";
        }
      }
      this.setData({
        dateList: list,
        current: current,
        curr: createDt
      });
      commUtils.toastInfo("不能选择早于账本创建的时间记账")
      return;
    }
    // 若到达边缘，则重新加载时间条
    if (current < 3 || current > 17) {
      this.initDateList(currDate);
    } else { // 否则切换当前选中
      var list = this.data.dateList;
      for (var i = 0; i < list.length; i++) {
        if (list[i].classText == "curr") {
          list[i].classText = "";
        }
      }
      list[current].classText = "curr";
      this.setData({
        dateList: list,
        curr: currDate,
        current: current - 2
      })
    }
    this.getCurrRecords();
  },

  // 滑动事件
  change :function(e){
    if (e.detail.source == "touch") {
      var current = e.detail.current + 2;
      this.changeDate(current)
    }
  },

  dateTap: function(e){

    var date = e.currentTarget.dataset.date
    var diff = dateUtils.diff(date, this.data.curr)
    var current = this.data.current + diff
    if(e.type == 'tap'){
      this.changeDate(current + 2)
    }
  },

  // 初始化时间选择条
  initDateList: function (curr) {
    var list = [];
    for (var i = - 10; i < 11 ;i++){
      var item = dateUtils.plus(curr,i);
      var day = dateUtils.getDayOfWeek(item);
      var date = {
        classText: "",
        date: item,
        text: day
      };
      if (i == 0){
        date.classText = "curr";
      }
      var diff = dateUtils.diffDays(item);
      if (diff == 0) {
        date.text = "今天";
      }
      else if(diff == -1){
        date.text = "昨天";
      }
      else if (diff == -2){
        date.text = "前天";
      }
      else if (diff > 0){
        date.classText = "disabled";
      }
      // 日期在创建账本之前，赋值成 disabled
      var note_create_dt = app.globalData.currNoteCreateDt
      if (dateUtils.diff(item, note_create_dt) < 0){
        date.classText = "disabled";
      }
      
      list.push(date);
    }
    this.setData({
      dateList: list, 
      curr: curr,
      current:8
    });
    console.log('initDateList getCurrRecords')
    this.getCurrRecords();
  },

  getCurrRecords: function(){
    wx.request({
      url: app.globalData.baseUrl + 'api/records/crazyRecords/getCurrDateRecords',
      data:{
        notesId: app.globalData.currNote,
        dt:this.data.curr
      },
      method: "get",
      success: data => {
        var dayEnd = data.data.dayEnd == undefined ? '-' : data.data.dayEnd.toFixed(2)
        var dayStart = data.data.dayStart == undefined ? '-' : data.data.dayStart.toFixed(2)
        var daySettle = data.data.daySettle == undefined ? '' : data.data.daySettle.toFixed(2)
        var monthSettle = data.data.monthSettle == undefined ? '' : data.data.monthSettle.toFixed(2)
        var daySettleNone = data.data.daySettle == undefined ? '-' : ''
        var monthSettleNone = data.data.monthSettle == undefined ? '-' : ''
        var list = data.data.recordsList
        for (var i = 0; i < list.length; i++) {
          list[i].money = list[i].money.toFixed(2)
        }
        this.setData({
          recordsList: list,
          moneys: {
            day_end: dayEnd,
            day_start: dayStart,
            day_settle: daySettle,
            month_settle: monthSettle,
            day_settle_none: daySettleNone,
            month_settle_none: monthSettleNone
          }
        })
      }
    })
    wx.hideLoading()
  },

  exportpage:function(){
    wx.showToast({
      title: '当前版本暂不支持增加导出功能',
      duration :400,
      icon: 'none'
    })
    return
    wx.navigateTo({
      url: '../export/export'
    });
  },

  /**
   * 页面的初始数据
   */
  data: {
    globalData: {},
    dateList:[],
    curr:'', // 选中时间
    now :'', // 当前时间
    current :0, // 位于swiper的index
    recordsList:[], // 账目列表
    isFirstLoad:true, //是否第一次加载
    moneys : {
      day_start: '-',
      day_end: '-',
      day_settle: '',
      month_settle: '',
      day_settle_none : '-',
      month_settle_none : '-'
    },
    modaling: false, // 是否正在弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.load();
    app.loadUICallback = res => {
      this.load();
    }
    // 回调 -> 已经准备好的账本
    app.loadNoteCallback = res => {
      console.log('callback initDateList')
      this.initDateList(this.data.now);
      this.setData({
        isFirstLoad : false
      })
    }

    // 回调 -> 登录成功
    app.loadUICallback = res => {
      this.checkNotes()
    }
  },

  load: function(){
    var app = getApp();
    this.setData({
      globalData: app.globalData
    });
    style.loadUI();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.data.globalData.currNote != '' || !app.globalData.isCanAddRecords ){
      wx.showLoading({
        title: '正在初始化数据',
      })
      console.log('onReady initDateList')
      this.initDateList(this.data.now);
      this.setData({
        isFirstLoad: false
      })
    }
  },

  checkNotes: function(){
    console.log(wx.getStorageSync('sessionId'))
    if (wx.getStorageSync("sessionId") == ''){
      return
    }
    var that = this
    wx.request({
      url: app.globalData.baseUrl + 'api/notes/getNotes',
      header: {
        "sessionId": wx.getStorageSync("sessionId")
      },
      method: "get",
      success: data => {
        if (data.data.notesCrazy.length == 0 && data.data.notes.length == 0) {
          app.globalData.isCanAddRecords = false
          wx.showModal({
            title: '体验疯狂记账',
            content: '告诉自己每天可以花掉多少钱，阿账每天帮你把这笔钱加到账本上，你的任务是花掉他们，这会让你在总支出一定的情况下活的更精致！',
            confirmColor: '#fcdb2c',
            confirmText: '开始体验',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/new-note/new-note',
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkNotes()
    this.setData({
      now: dateUtils.format(new Date())
    });
    if(!this.data.isFirstLoad){
      wx.showLoading({
        title: '正在加载数据',
      })
      console.log('onshow getCurrRecords')
      this.getCurrRecords();
      wx.hideLoading()
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
})