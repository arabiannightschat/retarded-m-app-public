var style = require("../../utils/style.js");
var app = getApp();
Page({

  // 修改账目的类型
  changeRecordsType: function (e) {
    var recordsType = e.currentTarget.dataset.type;
    this.setData({
      recordsType: recordsType
    });
  },

  del :function(e){
    var ix = e.currentTarget.dataset.ix;
    var list = this.getList();
    for (var i = ix + 1; i < list.length ; i++){
      list[i].ix --;
      list[i].color = this.data.colorList[list[i].ix % 5]
    }
    // 如果是默认类型，删除后添加到下方默认类型中
    if (list[ix].isDefault == 1) {
      var defaultList = this.getDefaultList();
      defaultList.push(list[ix]);
      this.setDefaultList(defaultList);
    }
    // 删除类型
    list.splice(ix, 1);
    this.setList(list);
  },

  newType:function(){
    wx.showToast({
      title: '当前版本还不支持此功能，敬请期待',
      icon: 'none',
      duration: 400
    })
  },

  getList : function(){
    var list = null;
    if (this.data.recordsType == 0) {
      list = this.data.expendList;
    } else {
      list = this.data.incomeList;
    }
    return list
  },

  setList: function(list){
    if (this.data.recordsType == 0) {
      this.setData({
        expendList: list
      });
    } else {
      this.setData({
        incomeList: list
      });
    }
  },

  getDefaultList: function () {
    var list = null;
    if (this.data.recordsType == 0) {
      list = this.data.defaultExpendList;
    } else {
      list = this.data.defaultIncomeList;
    }
    return list
  },

  setDefaultList: function (list) {
    if (this.data.recordsType == 0) {
      this.setData({
        defaultExpendList: list
      });
    } else {
      this.setData({
        defaultIncomeList: list
      });
    }
  },

  down: function(e){
    var list = this.getList();
    var ix = e.currentTarget.dataset.ix;
    if (ix == list.length - 1) {
      return;
    } else {
      for (var i = 0; i < list.length; i++) {
        if (i == ix + 1) {
          list[i].ix--;
          list[i - 1].ix++;
          var temp = list[i];
          list[i] = list[i - 1];
          list[i - 1] = temp;
          break;
        }
      }
      this.setList(list);
    }
  },

  up :function(e){
    var ix = e.currentTarget.dataset.ix;
    if(ix == 0){
      return;
    } else {
      var list = this.getList();
      for (var i = 0; i < list.length; i++) {
        if (i == ix - 1) {
          list[i].ix ++;
          list[i+1].ix --;
          var temp = list[i];
          list[i] = list[i+1];
          list[i+1] = temp; 
          break;
        }
      }
      this.setList(list);
    }
    // 同理取一下ix，ix是默认生成排序的，向上移动的话，判断是不是0，如果是0不操作
    // 不是0则和上一条记录更换ix并更换位置，向指定位置插入
  },

  add: function (e) {
    var typeId = e.currentTarget.dataset.type;
    var defaultList = this.getDefaultList();
    var list = this.getList();
    for (var i = 0; i < defaultList.length; i ++){
      if (defaultList[i].typeId == typeId){
        defaultList[i].ix = list.length;
        defaultList[i].color = this.data.colorList[defaultList[i].ix % 5]
        list.push(defaultList[i]);
        defaultList.splice(i,1);
        break;
      }
    }
    this.setList(list);
    this.setDefaultList(defaultList);
  },

  reset: function(){
    // 查询用户的支出收入类型
    wx.request({
      url: app.globalData.baseUrl + 'api/records/recordsType/getUserAndUnusedDefaultType',
      header: {
        "sessionId": wx.getStorageSync("sessionId")
      },
      method: "get",
      success: data => {
        var incomeList = data.data.incomeList;
        var expendList = data.data.expendList;
        for (var i = 0; i < incomeList.length; i++) {
          incomeList[i].ix = i;
          incomeList[i].color = this.data.colorList[i % 5]
        }
        for (var i = 0; i < expendList.length; i++) {
          expendList[i].ix = i;
          expendList[i].color = this.data.colorList[i % 5]
        }
        this.setData({
          incomeList: incomeList,
          expendList: expendList,
          defaultIncomeList: data.data.defaultIncomeList,
          defaultExpendList: data.data.defaultExpendList
        })
      }
    })
  },

  // 保存修改
  commit: function(){
    var comm = require("../../utils/common.js");
    var list = [];
    list = list.concat(this.data.incomeList);
    list = list.concat(this.data.expendList);
    var commitList = [];
    for(var i = 0 ; i < list.length ; i++){
      commitList.push({
        typeId: list[i].typeId,
        ix: list[i].ix
      })
    }
    wx.request({
      url: app.globalData.baseUrl + 'api/records/recordsType/updateUserTypeList',
      header: {
        "sessionId": wx.getStorageSync("sessionId")
      },
      data:{
        listJson: commitList
      },
      method: "get",
      success: data => {
        comm.toastSuccessAndBack('保存成功')
      }
    })
  },

  bindShowDefault: function(){
    this.setData({
      isShowDefault: !this.data.isShowDefault
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    globalData: {},
    recordsType: 0, // 0.支出，1.收入
    incomeList: [], // 收入类型list
    expendList: [],  // 支出类型list
    defaultIncomeList: [], // 收入类型list
    defaultExpendList: [],  // 支出类型list
    colorList:[
      '#FFE4E1',
      '#FFF68F',
      '#C0FF3E',
      '#FFDEAD',
      '#D1DDFF'
    ], // 颜色列表
    isShowDefault: true //是否展示默认类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      globalData: app.globalData
    });
    style.loadUI();

    this.reset();
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