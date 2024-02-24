import axios from 'axios';
import oauth from 'axios-oauth-client';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync}  from 'fs';

dotenv.config(); // Load environment variables via .env file
const CLIENT_ID = 'sb-02dc3512-6690-46bf-951b-1c2e2a5bf089!b197964|mxp-broker!b197964' // process.env.CLIENT_ID;
const CLIENT_SECRET = '1$EyibINy_ViQ5_cCP2LsA3q9iyNykavjaFLJxM6q9kiQ=' // process.env.CLIENT_SECRET;
const TOKEN_URL = 'https://sapit-strategicservices-prod-falcon.authentication.eu10.hana.ondemand.com/oauth/token' //process.env.TOKEN_URL;

// Set it to an empty string for prod. For dev or test, you need to set it to -dev or -test respectively.
const ROUTE_SUFFIX = process.env.ROUTE_SUFFIX ?? '';
const WORKSPHERE_ID = '35506195-d2a9-46be-8e4b-72f9a235be3a' // 'IWS-1' // process.env.WORKSPHERE_ID;
const GATEWAY_URL = `https://acms-gateway${ROUTE_SUFFIX}.cfapps.eu10-004.hana.ondemand.com`;
const BASE_URL = `${GATEWAY_URL}/consumption/api/v2/workspheres/${WORKSPHERE_ID}/releases/latest`;
// https://acms-gateway${ROUTE_SUFFIX}.cfapps.eu10-004.hana.ondemand.com${GATEWAY_URL}/consumption/api/v2/workspheres/${WORKSPHERE_ID}/releases/latest
const getClientCredentials = oauth.clientCredentials(axios.create(), TOKEN_URL, CLIENT_ID, CLIENT_SECRET,);

const getAuthHeader = async () => {
    const auth = await getClientCredentials('');
    return { Authorization: `bearer ${auth.access_token}` };
};

const readEntries = async (entityApiIdentifier) => {
    const authHeader = await getAuthHeader();
    try {
        return await axios.get(
            `${BASE_URL}/${entityApiIdentifier}/entries?status=latest`,
            { headers: authHeader },
        );
    } catch (error) {
        console.error(error);
    }
};

const res = await readEntries('hot_topic_v2');
console.log(res.data);

// const string_output = readFileSync("path-to-file", 'utf8')
writeFileSync ("public/_mockdata/hot_topic_v2.json", JSON.stringify(res.data))