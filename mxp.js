import axios from 'axios';
import oauth from 'axios-oauth-client';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables via .env file
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_URL = process.env.TOKEN_URL;
const ROUTE_SUFFIX = process.env.ROUTE_SUFFIX ?? '';
const WORKSPHERE_ID = process.env.WORKSPHERE_ID;
const GATEWAY_URL = `https://acms-gateway${ROUTE_SUFFIX}.cfapps.eu10-004.hana.ondemand.com`;
const BASE_URL = `${GATEWAY_URL}/consumption/api/v2/workspheres/${WORKSPHERE_ID}/releases/latest`;

const getClientCredentials = oauth.clientCredentials(
    axios.create(),
    TOKEN_URL, CLIENT_ID, CLIENT_SECRET,
);

const getAuthHeader = async () => {
    const auth = await getClientCredentials('');
    return { Authorization: `bearer ${auth.access_token}` };
};


const authHeader = await getAuthHeader();
try {
    const data = await axios.get(
        `${BASE_URL}/vuehtml/entries?metadata=false`,
        { headers: authHeader },
    );
    console.log(data);
} catch (error) {
    console.error(error);
}
