var app = getApp();

//写入UI
function recordUI(){
  console.log("写入用户UI喜好！");
  wx.request({
    url: app.globalData.baseUrl + 'api/user/recordUI',
    header: {
      "sessionId": wx.getStorageSync("sessionId")
    },
    data: {
      user: {
        "style": app.globalData.UI.style,
        "color": app.globalData.UI.color,
        "frontColor": app.globalData.UI.frontColor,
        "secondColor": app.globalData.UI.secondColor
      }
    },
    method: 'get'
  })
}

//修改UI
function changeUI(style) {
  app.globalData.UI.style = style;
  if(style == "3"){
    app.globalData.UI.color = "#ed1054";
    app.globalData.UI.frontColor = "#ffffff";
    app.globalData.UI.secondColor = "#FFE4E1";
  } else if(style == "5"){
    app.globalData.UI.color = "#fcdb2c";
    app.globalData.UI.frontColor = "#000000";
    app.globalData.UI.secondColor = "#FFF68F";
  } else if (style == "6") {
    app.globalData.UI.color = "#86d2f9";
    app.globalData.UI.frontColor = "#000000";
    app.globalData.UI.secondColor = "#D1DDFF";
  }
  loadUI();
  recordUI();
}
//加载UI
function loadUI() {
  // 修改颜色喜好
  wx.setNavigationBarColor({
    frontColor: app.globalData.UI.frontColor,
    backgroundColor: app.globalData.UI.color,
  });
}
module.exports.recordUI = recordUI;
module.exports.loadUI = loadUI;
module.exports.changeUI = changeUI;