const querystring = require('querystring');
const apiResult = require('@guyveut/shared/apiResults');
const signature = require('@guyveut/shared/verifySignature');
const fetch = require('@guyveut/shared/fetch');
const modal = require('./elements/leaderboard');
const getUsers = require('./utils/getTopHolders');

module.exports.message = async (event) => {
  if (!signature.isVerified(event))
    return apiResult(404, { error: 'Wrong signature' });

  var payload = querystring.parse(event.body);

  const timerange = 'Daily';

  const users = await getUsers(timerange);

  let result = await openModal(payload, timerange, users);
  if (result.error) {
    console.log(result.error);
    return { statusCode: 500 };
  }
  return { statusCode: 200 };
};

// open the dialog by calling views.open method and sending the payload
const openModal = async (payload, timerange, users) => {
  const viewData = modal.openLeaderboard({
    timerange: timerange,
    users: users,
  });
  return await fetch('https://slack.com/api/views.open', {
    method: 'POST',
    body: JSON.stringify({
      trigger_id: payload.trigger_id,
      ...viewData,
    }),
  });
};
