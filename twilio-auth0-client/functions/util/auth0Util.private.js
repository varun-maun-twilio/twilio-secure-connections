var axios = require("axios").default;
var moment = require('moment');

const syncPath = Runtime.getFunctions()['util/syncUtil'].path;
const { fetchSyncDocument, createSyncDocument, updateSyncDocument } = require(syncPath);




/*

a. Read Access token from sync
b?. If token not available / token expired,
    b1.1 fetch new token
    b1.2 save token in sync
c. return access token

*/
const getAuth0Token = async () => {



    const cachedTokenData = await fetchSyncDocument(process.env.TWILIO_SYNC_TOKEN_DOC)



    let newTokenRequired = false;

    if (cachedTokenData == null || cachedTokenData.access_token == null) {
        newTokenRequired = true;
    }
    else if (cachedTokenData.expires_at == null || moment().isAfter(moment(cachedTokenData.expires_at))) {
        newTokenRequired = true;
    }


    if (newTokenRequired == true) {
        const newTokenResponse = await fetchNewAuth0Token();

        newTokenResponse.expires_at = moment().add(newTokenResponse.expires_in, 'seconds').subtract(10, 'minutes').valueOf();

        if (cachedTokenData == null) {
            await createSyncDocument(process.env.TWILIO_SYNC_TOKEN_DOC, newTokenResponse);
        } else {

            await updateSyncDocument(process.env.TWILIO_SYNC_TOKEN_DOC, newTokenResponse);
        }

        return newTokenResponse.access_token;
    } else {
        return cachedTokenData.access_token;
    }









}


const fetchNewAuth0Token = async () => {
    var options = {
        method: 'POST',
        url: process.env.AUTH0_TOKEN_URL,
        data: {
            grant_type: 'client_credentials',
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE
        }
    };

    return await axios.request(options).then(r => r.data).catch(e => { console.error(e); return { access_token: null } });

}




module.exports = {
    getAuth0Token
}
