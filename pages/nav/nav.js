var app = getApp();

function navNotes() {
  // 关闭当前页面，打开新页面
  wx.redirectTo({
    url: '../notes/notes'
  });
  app.globalData.isPlus = false;
  app.globalData.currNav = "notes";

}

function navMine() {
  wx.redirectTo({
    url: '../mine/mine'
  });
  app.globalData.isPlus = false;
  app.globalData.currNav = "mine";
}

function navRecords() {
  wx.redirectTo({
    url: '../records/records'
  });
  app.globalData.isPlus = true;
  app.globalData.currNav = "records";
}

function navPlus() {
  if (!app.globalData.isCanAddRecords) {
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
    return
  }
  wx.navigateTo({
    url: '../new-record/new-record'
  });
}

module.exports.navNotes = navNotes;
module.exports.navMine = navMine;
module.exports.navRecords = navRecords;
module.exports.navPlus = navPlus;