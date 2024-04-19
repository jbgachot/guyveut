const querystring = require('querystring');
const apiResult = require('@guyveut/shared/apiResults');
const signature = require('@guyveut/shared/verifySignature');
const fetch = require('@guyveut/shared/fetch');
const modal = require('./elements/leaderboard');
const getUsers = require('./utils/getTopHolders');

module.exports.update = async (event) => {
  if (!signature.isVerified(event))
    return apiResult(404, { error: 'Wrong signature' });

  const payload = JSON.parse(querystring.parse(event.body).payload);

  const timerange = payload.actions[0].action_id;

  const users = await getUsers(timerange);

  console.log(users);

  const result = await updateModal(payload, timerange, users);
  if (result.error) {
    console.log(result.error);
    return { statusCode: 500 };
  }
  return { statusCode: 200 };
};

// update the dialog by calling views.update method and sending the payload
const updateModal = async (payload, timerange, users) => {
  const viewData = modal.openLeaderboard({
    timerange: timerange,
    users: users,
  });
  return await fetch('https://slack.com/api/views.update', {
    method: 'POST',
    body: JSON.stringify({
      view_id: payload.container.view_id,
      ...viewData,
    }),
  });
};
