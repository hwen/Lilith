// YYYY/MM/DD HH:mm:ss
function formatDate(fmt, date) {
  date = date ? new Date(date) : new Date();
  var o = {
    'M+': date.getMonth() + 1, // Month
    'D+': date.getDate(), // date
    'H+': date.getHours(), // hours
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    S: date.getMilliseconds(), // milliseconds
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
}

function randomMes(arr) {
  const range = arr.length - 1;
  const randomIdx = Math.round((Math.random() * range) % range);
  return arr[randomIdx];
}

function get(obj = {}, path = '') {
  return path
    .replace(/\[(.+?)\]/g, '.$1')
    .split('.')
    .reduce((o, key) => o && o[key], obj);
}

function handleErr(err) {
  console.log(`==== 【err】 ====`);
  console.log(err);
}

module.exports = {
  formatDate,
  randomMes,
  get,
  handleErr,
};
