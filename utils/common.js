
function toastSuccessAndBack(info) {
  toastSuccess(info)
  setTimeout(function () {
    wx.navigateBack();
  }, 800)
}

function toastSuccess(info) {
  wx.showToast({
    title: info,
    icon: 'success',
    image: '../../images/icon/success.png',
    duration: 800,
    mask: true
  });
}

function toastWarning(info) {
  wx.showToast({
    title: info,
    image: '../../images/icon/warning.png',
    duration: 1000
  })
}

module.exports.toastSuccessAndBack = toastSuccessAndBack;
module.exports.toastSuccess = toastSuccess;
module.exports.toastWarning = toastWarning;