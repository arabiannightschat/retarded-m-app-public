
function format(date){
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var fullMonth = month > 9 ? month : '0' + month;
  var day = date.getDate();
  var fullDay = day > 9 ? day : '0' + day;
  return year + '-' + fullMonth + '-' + fullDay;
}

function plus (dateString, day) {
  var date = new Date(dateString);
  var time = date.getTime() + 1000 * 60 * 60 * 24 * day;
  return format(new Date(time));
}

function getDay(dateString) {
  var date = new Date(dateString);
  var day = date.getDate();
  var fullDay = day > 9 ? day : '0' + day;
  return fullDay;
}

function getDayOfWeek(dateString) {
  var date = new Date(dateString)
  var day = date.getDay()
  var dayOfWeek = ''
  switch(day){
    case 0: dayOfWeek = '星期日'; break;
    case 1: dayOfWeek = '星期一'; break;
    case 2: dayOfWeek = '星期二'; break;
    case 3: dayOfWeek = '星期三'; break;
    case 4: dayOfWeek = '星期四'; break;
    case 5: dayOfWeek = '星期五'; break;
    case 6: dayOfWeek = '星期六'; break;
  }
  return dayOfWeek

}

function getMonth(date){
	var month = date.getMonth() + 1;
	var fullMonth = month > 9 ? month : '0' + month;
	return fullMonth;
}

function getYear(date) {
  var year = date.getFullYear();
  return year;
}

function diffDays(date) {
  var now = new Date(format(new Date()));
  var param = new Date(date); 
  var diff = param.getTime() - now.getTime();
  return diff / (1000 * 60 * 60 * 24);
}

function diff(date_1, date_2) {
  var date1 = new Date(date_1);
  var date2 = new Date(date_2);
  var diff = date1.getTime() - date2.getTime();
  return diff / (1000 * 60 * 60 * 24);
}

// 得到上月某日的日期
function getLastMonthDay(day){
  var now = new Date(format(new Date()));
  var month = now.getMonth();
  var year = now.getFullYear();
  if(month == 0) {
    month = 12;
    year--;
  }
  var fullMonth = month > 9 ? month : '0' + month;
  var fullDay = day > 9 ? day : '0' + day;
  return year + "-" + fullMonth + "-" + fullDay;
}

module.exports = {
  format : format,
  plus : plus,
  getDay: getDay,
  getDayOfWeek: getDayOfWeek,
  diffDays: diffDays,
  diff:diff,
  getMonth: getMonth,
  getYear: getYear,
  getLastMonthDay: getLastMonthDay
}