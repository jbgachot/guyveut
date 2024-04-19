const { LOG_TABLE_NAME } = require('@guyveut/shared/consts');
const {
  mergedParams,
  scan,
  searchByKeyFilterFrom,
} = require('@guyveut/shared/dynamo');
const findDate = require('@guyveut/shared/dateFinder');

module.exports = async (date) => {
  const from = findDate(date);
  const getTransactions = (from) =>
    scan(
      mergedParams(
        { TableName: LOG_TABLE_NAME },
        { ScanIndexForward: false },
        searchByKeyFilterFrom('timestamp', from)
      )
    );
  const transactions = await getTransactions(from);

  const users = [];
  for (var transaction of transactions) {
    if (typeof users[transaction.to] !== 'undefined') {
      users[transaction.to] += transaction.value;
    } else {
      users[transaction.to] = transaction.value;
    }
  }

  var topUsers = [];
  for (var key in users) topUsers.push([key, users[key]]);
  topUsers.sort(function (a, b) {
    a = a[1];
    b = b[1];
    return b < a ? -1 : b > a ? 1 : 0;
  });
  topUsers = topUsers.slice(0, 5);

  return topUsers;
};
