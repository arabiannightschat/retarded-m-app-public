var nav = require("../nav/nav.js");
var style = require("../../utils/style.js");
var commUtils = require("../../utils/common.js")
var app = getApp();
Page({

  navNotes: function () {
    nav.navNotes();
  },
  navMine: function () {
    nav.navMine();
  },
  navRecords : function() {
    nav.navRecords();
  },

  modal: function (e) {
    wx.vibrateShort()
    var index = e.currentTarget.dataset.index
    var list = this.data.notesCrazy
    list[index].opShow = true
    this.setData({
      notesCrazy: list,
      modaling: true
    })
  },

  del: function (e) {
    var that = this
    wx.showModal({
      title: '删除账本',
      content: '删除账本，记账记录和统计数据，删除后不可恢复，真的要删除吗',
      confirmText:'删除',
      confirmColor: '#fcdb2c',
      success: function(res){
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除'
          })
          var id = e.currentTarget.dataset.id
          wx.request({
            url: app.globalData.baseUrl + 'api/crazyNotes/del',
            data: {
              crazyNotesId: id
            },
            method: "get",
            success: data => {
              wx.hideLoading()
              commUtils.toastSuccess("删掉了！")
              app.getNotes()
              that.getNotes()
              // 回调 -> 已经准备好的账本
              app.loadNoteCallback = res => {
                that.setData({
                  globalData: app.globalData
                })
              }
              that.setData({
                modaling: false
              })
            }
          });
        }
      }
    })
  },

  clear: function () {
    if (this.data.modaling == true) {
      var list = this.data.notesCrazy
      for (var i = 0; i < list.length; i++) {
        list[i].opShow = false
      }
      this.setData({
        notesCrazy: list,
        modaling: false
      })
    }
  },

  addNote : function(){
    wx.navigateTo({
      url: '../new-note/new-note',
    });
  },

  changeShowDieds: function(){
    this.setData({
      isShowDieds : !this.data.isShowDieds
    });
    wx.setStorageSync("isShowDieds", this.data.isShowDieds);
  },

  /**
   * 页面的初始数据
   */
  data: {
    globalData: {},
    isExistDieds : false, // 是否存在结束的账本
    isShowDieds: true,  // 是否显示结束的账本
    notes:[], // 普通账本
    dieds:[], // 已结束的普通账本
    notesCrazy:[],  // 疯狂账本
    diedsCrazy:[],   // 已结束的疯狂账本
    modaling :false   //是否正在显示 modal
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    style.loadUI();
  },

  // 切换疯狂账本
  changeCrazyNotes: function(e){
    var crazyId = e.currentTarget.dataset.crazyId;
    var createDt = e.currentTarget.dataset.createDt;
    // 得到疯狂账本Id
    app.globalData.currNote = crazyId;
    app.globalData.currNoteCreateDt = createDt;
    app.globalData.currNoteType = 1; //0.普通账本，1.疯狂账本
    this.setData({
      globalData: app.globalData
    });
    
  },

  toNavRecords: function(){
    console.log(1233111)
    nav.navRecords();
  },

  // 打开普通账本
  openNotes: function (e) {
    var notesId = e.currentTarget.dataset.notesId;
    // 得到疯狂账本Id
    app.globalData.currNote = notesId;
    console.log("selectedNotesId:" + notesId)
    app.globalData.currNoteType = 0; //0.普通账本，1.疯狂账本
    nav.navRecords();
  },

  // 获取全部账本
  getNotes: function(){
    wx.request({
      url: app.globalData.baseUrl + 'api/notes/getNotes',
      header: {
        "sessionId": wx.getStorageSync("sessionId")
      },
      method: "get",
      success: data => {
        this.setData({
          notes: data.data.notes,
          dieds: data.data.dieds,
          notesCrazy: data.data.notesCrazy,
          diedsCrazy: data.data.diedsCrazy
        });
        if (data.data.dieds.length > 0 || data.data.diedsCrazy.length > 0){
          this.setData({
            isExistDieds : true
          })
        }
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
    wx.showNavigationBarLoading()
    // 获取全部账本
    this.getNotes();

    var isShowDieds = wx.getStorageSync("isShowDieds");
    isShowDieds == '' ? true : isShowDieds;
    this.setData({
      isShowDieds: isShowDieds,
      globalData: app.globalData
    });
    wx.hideNavigationBarLoading()
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