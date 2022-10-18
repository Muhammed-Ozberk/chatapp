let baseResponse = {};
const config = require("./../config/config")

module.exports = {
    success: (response, message, data) => {
        response.setHeader("iVersion", config.version);
        baseResponse = {};
        response.status(200);
        baseResponse.successCode = 200;
        baseResponse.message = message;
        baseResponse.data = data;
        return response.json(baseResponse);
    },
    error: (response, responseCode, errorCode, message) => {
        response.setHeader("iVersion", config.version);
        baseResponse = {};
        response.status(responseCode);
        baseResponse.errorCode = errorCode;
        baseResponse.message = message;
        return response.json(baseResponse);
    },
    sysError: (response, error) => {
        response.setHeader("iVersion", config.version);
        baseResponse = {};
        response.status(500);
        baseResponse.errorCode = 500;
        baseResponse.message = error.message;
        return response.json(baseResponse);
    }
};
