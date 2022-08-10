const httpUtilPath = Runtime.getFunctions()['util/httpUtil'].path;
const { httpProxyRequest } = require(httpUtilPath);


exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');
  try {
    const apiResponse = await httpProxyRequest({
      url: 'http://localhost:7000/secure',
      method: 'GET'
    })

    response.setBody({
      responseData: apiResponse.data,
    });
    return callback(null, response);
  } catch (e) {
    return callback(e);
  }
};
