const apiResult = require('@guyveut/shared/apiResults');
const signature = require('@guyveut/shared/verifySignature');
const findDate = require('@guyveut/shared/dateFinder');
const {
  withId,
  mergedParams,
  query,
  searchByPKFilterFrom,
  put,
} = require('@guyveut/shared/dynamo');
const {
  LOG_TABLE_NAME,
  MAX_POINT_PER_DAY,
  REACT_SYMBOL,
  REACT_NEGATIVE_SYMBOL,
  REWARD_PLURAL,
} = require('@guyveut/shared/consts');
const parseMessage = require('./utils/parseMessage');
const notifyViaEmoji = require('./utils/notifyViaEmoji');
// const notifyViaThread = require('./utils/notifyViaThread');
const sendMessage = require('./utils/sendMessage');

module.exports.message = async (event) => {
  if (!signature.isVerified(event))
    return apiResult(404, { error: 'Wrong signature' });

  const body = JSON.parse(event.body);

  // for verification actions
  if (body.type === 'url_verification') {
    return {
      statusCode: 200,
      body: body.challenge,
    };
  }

  const message = body.event;

  // the main function will go here
  if (message.type === 'message' && message.client_msg_id) {
    // parse the message
    const parsedMessage = parseMessage(body);

    if (!parsedMessage.isValid) {
      if (parsedMessage.errorMessage) {
        await notifyViaEmoji(body, REACT_NEGATIVE_SYMBOL);
        await sendMessage(body, message.user, parsedMessage.errorMessage);
      }
      return apiResult(200, {
        error: parsedMessage.errorMessage || 'Message is not valid',
      });
    }

    const daily = findDate('daily');
    const getTransactionByFrom = (user, date) =>
      query(
        mergedParams(
          { TableName: LOG_TABLE_NAME },
          { ScanIndexForward: false },
          searchByPKFilterFrom('user', user, 'timestamp', date)
        )
      );
    const transactions = await getTransactionByFrom(message.user, daily);

    const totalSpentToday = transactions.reduce(function (total, transaction) {
      return total + transaction.value;
    }, 0);

    if (totalSpentToday + parsedMessage.totalPoint > MAX_POINT_PER_DAY) {
      await notifyViaEmoji(body, REACT_NEGATIVE_SYMBOL);
      await sendMessage(
        body,
        message.user,
        'Sorry... You can only give up to *' +
          MAX_POINT_PER_DAY +
          '* ' +
          REWARD_PLURAL +
          ' per day, and you already gave *' +
          totalSpentToday +
          '* :confused:. Maybe you can try again tomorrow ?'
      );
      return apiResult(200, { error: 'User gave too much cookies today.' });
    }

    console.log('giverFound', transactions);

    // log the message for each user into the database
    for (let i = 0; i < parsedMessage.targetUserList.length; i++) {
      const to = parsedMessage.targetUserList[i];
      const payload = {
        user: message.user,
        timestamp: body.event_time,
        to: to.user_id,
        value: parseFloat(parsedMessage.pointPerUser),
        note: parsedMessage.note,
        channel: message.channel,
        messageId: message.client_msg_id,
      };

      await put({
        TableName: LOG_TABLE_NAME,
        Item: withId(payload),
      })
        .then((ref) => ref.id)
        .catch();
    }

    await notifyViaEmoji(body, REACT_SYMBOL);
    // to respond in thread
    // await notifyViaThread(body, "Ok i will");

    return apiResult(200, {
      success:
        message.user +
        ' gave ' +
        parsedMessage.totalPoint +
        ' ' +
        REWARD_PLURAL,
      note: parsedMessage.note || 'No note given',
    });
  }

  return apiResult(200, { message: 'Nothing to do...' });
};
