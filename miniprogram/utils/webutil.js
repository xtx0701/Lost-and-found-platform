const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = formatNumber(date.getHours())
  const minute = formatNumber(date.getMinutes())
  const second = formatNumber(date.getSeconds())

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  // return [hour, minute].map(formatNumber).join(':')
  return year+'年'+month+'月'+day+'日 '+hour+':'+minute;
}

const formatTime8 = date => {
  date.setTime(date.setHours(date.getHours() + 8));

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = formatNumber(date.getHours())
  const minute = formatNumber(date.getMinutes())

  return year+'年'+month+'月'+day+'日 '+hour+':'+minute;
}

const formatDate = date => {
  date.setTime(date.setHours(date.getHours() + 8));

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return year+'年'+month+'月'+day+'日';
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//数组去重
function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

module.exports = {
  formatTime: formatTime,
  formatTime8:formatTime8,
  formatDate,formatDate,
  contains: contains
}

