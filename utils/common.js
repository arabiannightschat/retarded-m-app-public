
function toastSuccessAndBack(info) {
  wx.showToast({
    title: info,
    icon: 'success',
    duration: 400,
    mask: true
  });
  setTimeout(function () {
    wx.navigateBack();
  }, 400)
}

function toastSuccess(info) {
  wx.showToast({
    title: info,
    icon: 'success',
    duration: 400,
    mask: true
  });
}

function toastInfo(info) {
  wx.showToast({
    title: info,
    icon: 'none',
    duration: 400
  });
}

module.exports.toastSuccessAndBack = toastSuccessAndBack;
module.exports.toastSuccess = toastSuccess;
module.exports.toastInfo = toastInfo;