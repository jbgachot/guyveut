const nodeFetch = require('node-fetch');
const BOT_TOKEN = process.env.BOT_TOKEN;

module.exports = (url, options = {}) => {
  console.log('fetch', url, options);
  return nodeFetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${BOT_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
    .then((resp) => resp.json())
    .then((body) => {
      console.log('result', body);
      return body;
    });
};
