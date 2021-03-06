App({

  login: function () {
    var that = this;
    console.log("-- 用户登录!");
    wx.login({
      success: res => {
        wx.request({
          url: that.globalData.baseUrl + "api/sys/login/wxLogin",
          data: {
            code: res.code,
            oldSessionId: wx.getStorageSync('sessionId')
          },
          method: "get",
          success: data => {
            var d = data.data.data;
            console.log(d)
            //服务器返回的sessionId存入缓存,在以后的每次请求中都发送这个标识
            wx.setStorageSync('sessionId', d.sessionId);
            wx.setStorageSync('chargeDayCount', d.chargeDayCount);
            console.log("-- 登录成功！")
            if (this.loginCallback) {
              this.loginCallback()
            }
            that.globalData.isLoginCompleted = true;
          }
        })
      }
    })
  },

  onLaunch: function () {
    this.login()
  },

  globalData: {
    // baseUrl:'https://127.0.0.1/', 
    baseUrl: 'https://arabiannightschat.top/',
    isLoginCompleted: false
  }
})