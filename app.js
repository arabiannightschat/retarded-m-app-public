App({

  login: function () {
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
            // 登录成功
            console.log("登录成功！")
            if (this.loginCallback) {
              this.loginCallback()
            }
          }
        })
      }
    })
  },

  onLaunch: function () {
    this.login()
  },

  globalData: {
    baseUrl:'https://127.0.0.1/', 
  }
})