function formatDate(template, date) {
  var specs = 'YYYY:MM:DD:HH:mm:ss'.split(':');
  date = new Date(date || Date.now() - new Date().getTimezoneOffset() * 6e4);
  return date
    .toISOString()
    .split(/[-:.TZ]/)
    .reduce(function(template, item, i) {
      return template.split(specs[i]).join(item);
    }, template);
}

function randomMes(arr) {
  const range = arr.length - 1;
  const randomIdx = Math.round((Math.random() * range) % range);
  return arr[randomIdx];
}

module.exports = {
  formatDate,
  randomMes,
};
