require('dotenv').config();

const ENV = process.env.ENV || 'development'; // either 'development' or 'production'
const PORT = 3000;

// dev
const DEV_UPS_URL = 'http://localhost:8080';
const DEV_QS_URL = 'http://localhost:8081';
const DEV_COMM_S_URL = 'http://localhost:7000';
const DEV_COLLAB_S_URL = 'http://localhost:5005';

// prod
const PROD_ALL_SERVICES_URL =
    'http://PeerP-ECSAL-VRMX8RRXSKZT-117450592.ap-southeast-1.elb.amazonaws.com';

// routes
const SIGNUP = '/api/user/create';
const LOGIN = '/api/user/login';
const MATCHING_SOCKET = '/api/user';
const COLLAB_SOCKET = '/api/collab';
const CHAT_SOCKET = '/api/comm';
const GET_QN_METADATA = '/api/question/questions/metadata';
const GET_ALLOCATED_ROOM = '/api/question/room/username/';
const GET_QN_DATA = '/api/question/room/';

const configs = {
    development: {
        PORT: PORT || 3000,
        signupEndpoint: DEV_UPS_URL + SIGNUP,
        loginEndpoint: DEV_UPS_URL + LOGIN,
        matchingSocketEndpoint: DEV_UPS_URL + MATCHING_SOCKET,
        collabSocketEndpoint: DEV_COLLAB_S_URL + COLLAB_SOCKET,
        chatSocketEndpoint: DEV_COMM_S_URL + CHAT_SOCKET,
        getCollabQuestionEndpoint: DEV_QS_URL + GET_QN_DATA,
        getQuestionMetadataEndpoint: DEV_QS_URL + GET_QN_METADATA,
        getAllocatedRoomEndpoint: DEV_QS_URL + GET_ALLOCATED_ROOM,
    },
    production: {
        PORT: PORT || 3000,
        signupEndpoint: PROD_ALL_SERVICES_URL + SIGNUP,
        loginEndpoint: PROD_ALL_SERVICES_URL + LOGIN,
        matchingSocketEndpoint: PROD_ALL_SERVICES_URL + MATCHING_SOCKET,
        collabSocketEndpoint: PROD_ALL_SERVICES_URL + COLLAB_SOCKET,
        chatSocketEndpoint: PROD_ALL_SERVICES_URL + CHAT_SOCKET,
        getCollabQuestionEndpoint: PROD_ALL_SERVICES_URL + GET_QN_DATA,
        getQuestionMetadataEndpoint: PROD_ALL_SERVICES_URL + GET_QN_METADATA,
        getAllocatedRoomEndpoint: PROD_ALL_SERVICES_URL + GET_ALLOCATED_ROOM,
    },
};

module.exports = configs[ENV];
