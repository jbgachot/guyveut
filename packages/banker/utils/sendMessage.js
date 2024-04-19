const fetch = require('@guyveut/shared/fetch');

module.exports = (payload, channel, message) => {
  return fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    body: JSON.stringify({
      token: payload.token,
      channel: channel,
      text: message,
    }),
  });
};
