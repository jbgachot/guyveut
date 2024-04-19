module.exports = function findDate(which = 'current') {
  var now = new Date();

  switch (which.toLowerCase()) {
    case 'daily':
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      now.setMilliseconds(0);
      break;
    case 'weekly':
      var day = now.getDay();
      var diff = now.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      now.setDate(diff);
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      now.setMilliseconds(0);
      break;
    case 'monthly':
      now.setDate(1);
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      now.setMilliseconds(0);
      break;
  }

  return parseFloat((now / 1000).toFixed(0));
};
