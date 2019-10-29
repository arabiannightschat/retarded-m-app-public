App({

  login: function(){
    var that = this;
    console.log("用户登录!");
    wx.login({
      success: res => {
        wx.request({
          url: that.globalData.baseUrl + "api/login/wxLogin",
          data: {
            code: res.code,
            oldSessionId: wx.getStorageSync('sessionId')
          },
          method: "get",
          success: data => {
            //服务器返回的sessionId存入缓存,在以后的每次请求中都发送这个标识
            wx.setStorageSync('sessionId', data.data.sessionId);
            if (data.data.isFirstLogin) { 
              console.log("用户首次登录!");
              that.addAlternative2User();
              var style = require("utils/style.js");
              style.recordUI();
              that.getNotes();
            }else {
              that.getUI();
            }
            // 登录成功时，回调
            if (this.loginCallback) {
              this.loginCallback()  
            }
          }
        })
      }
    })
  },

  addAlternative2User : function(){
    var that = this;
    wx.request({
      url: that.globalData.baseUrl + 'api/records/recordsType/addAlternative2User',
      header: {
        "sessionId": wx.getStorageSync("sessionId")
      },
      method: 'get',
      success: data => {
        console.log("把初始类型给用户！");
      }
    })
  },

  getUI : function(){
    var that = this;
    // 读取用户UI喜好
    wx.request({
      url: that.globalData.baseUrl + 'api/user/getUI',
      header: {
        "sessionId": wx.getStorageSync("sessionId")
      },
      method: 'get',
      success: data => {
        //如果redis丢失，则查不到对应的用户，就重新登录
        if(data.data == null){
          console.log("后台登录态丢失，重新登录");
          that.login();
          return;
        }
        that.globalData.UI.color = data.data.color;
        that.globalData.UI.style = data.data.style;
        that.globalData.UI.frontColor = data.data.frontColor;
        that.globalData.UI.secondColor = data.data.secondColor;
        if (this.loadUICallback) {
          this.loadUICallback(data);
        }
        that.getNotes();
        console.log(that.globalData.baseUrl);
      }
    })
  },

  getNotes: function() {
    var that = this;
    wx.request({
      url: that.globalData.baseUrl + 'api/notes/getNotes',
      header: {
        "sessionId": wx.getStorageSync("sessionId")
      },
      method: "get",
      success: data => {
        if (data.data.notesCrazy.length > 0){
          that.globalData.currNote = data.data.notesCrazy[0].crazyId;
          that.globalData.currNoteCreateDt = data.data.notesCrazy[0].createDt;
          that.globalData.currNoteType = 1;
        } else if (data.data.notes.length > 0){
          that.globalData.currNote = data.data.notes[0].notesId;
          that.globalData.currNoteType = 0;
        }
        if (this.loadNoteCallback){
          this.loadNoteCallback(that.globalData.currNote)
        }
      }
    })
  },

  onLaunch: function () {
    var that = this;
    wx.checkSession({
      fail: function (res) {
      　that.login();
      },
      success: function(){
        if (wx.getStorageSync('sessionId') == ""){
          console.log("可能是清除了缓存，缓存中没有sessionId");
          that.login();
        }else {
          that.getUI();
        }
      }
    });
  },

  globalData: {
    baseUrl:'https://xx/',
    // baseUrl:'https://127.0.0.1/', 
    isPlus : true,
    currNav : "records",
    currNote: '',
    currNoteCreateDt:'',
    currNoteType: 1,  //0.普通账本，1.疯狂账本
    UI:{
      style: "5",
      color: "#fcdb2c",
      frontColor: "#000000",
      secondColor: "#FFF68F"
    },
    isCanAddRecords: true  // 是否可以记账
  }
})