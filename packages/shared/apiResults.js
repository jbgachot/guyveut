const apiResult = (statusCode, payload) => {
  console.log('apiResult', statusCode, payload);

  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(payload),
  };
};

module.exports = apiResult;
