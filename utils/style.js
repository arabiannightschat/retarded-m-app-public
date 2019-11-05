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

function getStyleIdxList(){
  return ["yellow_01", "yellow_02", "blue_01", "gray_01", "red_01"]; 
}

//修改UI
function changeUI(style) {
  app.globalData.UI.style = style;
  if (style == "yellow_01") {
    app.globalData.UI.color = "#fcdb2c";
    app.globalData.UI.frontColor = "#000000";
    app.globalData.UI.secondColor = "#FFF68F";
  } else if (style == "yellow_02") {
    app.globalData.UI.color = "#E6A23C";
    app.globalData.UI.frontColor = "#ffffff";
    app.globalData.UI.secondColor = "#faecd8";
  } else if (style == "blue_01") {
    app.globalData.UI.color = "#409EFF";
    app.globalData.UI.frontColor = "#ffffff"; 
    app.globalData.UI.secondColor = "#b3d8ff";
  } else if (style == "gray_01") {
    app.globalData.UI.color = "#909399";
    app.globalData.UI.frontColor = "#ffffff";
    app.globalData.UI.secondColor = "#e9e9eb";
  } else if (style == "red_01") {
    app.globalData.UI.color = "#F56C6C";
    app.globalData.UI.frontColor = "#ffffff";
    app.globalData.UI.secondColor = "#fde2e2";
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
module.exports.getStyleIdxList = getStyleIdxList;
