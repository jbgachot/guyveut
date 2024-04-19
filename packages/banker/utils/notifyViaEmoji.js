const fetch = require('@guyveut/shared/fetch');

module.exports = (payload, reaction) => {
  return fetch('https://slack.com/api/reactions.add', {
    method: 'POST',
    body: JSON.stringify({
      token: payload.token,
      channel: payload.event.channel,
      timestamp: payload.event.ts,
      name: reaction,
    }),
  });
};
