const fetch = require('@guyveut/shared/fetch');

module.exports = (payload, message) => {
  if (!Object.prototype.hasOwnProperty.call(payload.event, 'thread_ts')) {
    return fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      body: JSON.stringify({
        token: payload.token,
        channel: payload.event.channel,
        thread_ts: payload.event.ts,
        text: message,
      }),
    });
  }
};
