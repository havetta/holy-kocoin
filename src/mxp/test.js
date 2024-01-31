import axios from 'axios';
import oauth from 'axios-oauth-client';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables via .env file

// The three variables below are loaded from your environment so that you do not need to put secrets into the code.
// Just setup environment variables for CLIENT_ID, CLIENT_SECRET and TOKEN_URL with the values found in your api client.
const CLIENT_ID = 'sb-02dc3512-6690-46bf-951b-1c2e2a5bf089!b197964|mxp-broker!b197964'
// process.env.CLIENT_ID;
const CLIENT_SECRET = '1$EyibINy_ViQ5_cCP2LsA3q9iyNykavjaFLJxM6q9kiQ='
//process.env.CLIENT_SECRET;
const TOKEN_URL = 'https://sapit-strategicservices-prod-falcon.authentication.eu10.hana.ondemand.com/oauth/token'
//process.env.TOKEN_URL;

// To select the correct stage, you need to set up the ROUTE_SUFFIX environment variable. You can set it to an empty
// string for prod. For dev or test, you need to set it to -dev or -test respectively.
const ROUTE_SUFFIX = process.env.ROUTE_SUFFIX ?? '';

const WORKSPHERE_ID = '35506195-d2a9-46be-8e4b-72f9a235be3a' // 'IWS-1' // process.env.WORKSPHERE_ID;
const GATEWAY_URL = `https://acms-gateway${ROUTE_SUFFIX}.cfapps.eu10-004.hana.ondemand.com`;
const BASE_URL = `${GATEWAY_URL}/consumption/api/v2/workspheres/${WORKSPHERE_ID}/releases/latest`;

const getClientCredentials = oauth.clientCredentials(
    axios.create(),
    TOKEN_URL,
    CLIENT_ID,
    CLIENT_SECRET,
);

const getAuthHeader = async () => {
    const auth = await getClientCredentials('');
    return { Authorization: `bearer ${auth.access_token}` };
};

// This method creates a new entry specified by the payload for the given entity api identifier.
// const createEntry = async (
//     entityApiIdentifier: string,
//     payload: EntryPayload,
// ) => {
//     const authHeader = await getAuthHeader();

//     try {
//         return await axios.post(
//             `${BASE_URL}/${entityApiIdentifier}/entries`,
//             payload,
//             {
//                 headers: authHeader,
//             },
//         );
//     } catch (error) {
//         console.error(error);
//     }
// };

// This method read an entry specified by the given entity api identifier.
const readEntry = async (entityApiIdentifier, entryId) => {
    const authHeader = await getAuthHeader();

    try {
        return await axios.get(
            `${BASE_URL}/${entityApiIdentifier}/entries/${entryId}?status=latest`,
            { headers: authHeader },
        );
    } catch (error) {
        console.error(error);
    }
};

// This method reads all entries specified by the given entity api identifier.
// You might have to add pagination since the api only returns 10 entries if not specified otherwise.
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

// Here we define the content of the entry, please note that this will only work for entities with the correct fields.
// In this example, we have an entity with two text fields: title and description. 'title' and 'description' are the
// api identifiers of the fields.
// If you are not sure how it would look like for your entity, you can refer to the api docs page of your worksphere
// to get a better understanding of the structure of your own entities.
const newEntry = {
    title: 'Example title',
    description:
        'This is just an example for demo purposes. You probably want to change this.',
};

// We are calling the createEntry method with the api identifier of the entity as the first argument
// and the content of the entry as the second argument.
// const response = await createEntry('entityApiIdentifier', newEntry);

// Now you can access the uuid of the created entry
// const uuid = response.data.uuid;
const uuid = '70af60c2-4a22-42cd-bd0f-7a9662fe1bcb';

// With the api identifier and the uuid you can also read a specific entry
// await readEntry('industry_white_spaces', uuid);

// Last but not least, we read all entries from the API and log them to the console.
const data = await readEntries('hot_topic_v2');

console.log(data);