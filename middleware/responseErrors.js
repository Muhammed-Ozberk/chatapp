function missingFieldInBody(res, field, message) {

    var responseObj = {
        status: false,
        error: {
            code: 4000,
            type: "missingFieldInBody",
            field: field,
            message: message || `'${field}' field required but not exist in body or empty`
        }
    };

    res.status(400).json(responseObj);
}

function missingFieldInHeader (res, field, message) {
    var responseObj = {
        status: false,
        error: {
            code: 4001,
            type: "missingFieldInHeader",
            field: field,
            message: message || `'${field}' field required but not exist in header or empty`
        }
    };

    res.status(400).json(responseObj);
}

function missingFieldInQuery(res, field, message) {
    var responseObj = {
        status: false,
        error: {
            code: 4002,
            type: "missingFieldInQuery",
            field: field,
            message: message || `'${field}' field required but not exist in query or empty`
        }
    };

    res.status(400).json(responseObj);
}

function parameterTypeError(res, field, type, message) {
    var responseObj = {
        status: false,
        error: {
            code: 4003,
            type: "parameterTypeError",
            field: field,
            message: message || `'${field}' field must be ${type}`
        }
    };

    res.status(400).json(responseObj);
}

function throttle(res, code, message) {
    var responseObj = {
        status: false,
        error: {
            code: code || 4290,
            type: "throttle",
            message: message
        }
    };

    res.status(429).json(responseObj);
}

function unacceptableParameter(res, field, code, message) {
    var responseObj = {
        status: false,
        error: {
            code: code || 5000,
            type: "unacceptableParameter",
            field: field,
            message: message
        }
    };

    res.status(422).json(responseObj);
}

function notAcceptable(res, allowedType) {
    var responseObj = {
        status: false,
        error: {
            code: 4600,
            type: "contentType",
            field: null,
            message: `Not Acceptable Content Type. Content Type must be: '${allowedType}'`
        }
    };

    res.status(406).json(responseObj);
}

function notFound(res, param) {
    var responseObj = {
        status: false,
        error : {
            code: 4007,
            type: "notFound",
            field: null,
            message: `${param} Not Found.`
        }
    }

    res.status(404).json(responseObj);
}

var middleware = function(req,res,next) {
    res.missingField = function(location,field,message) {
        if(location==="body") {
            missingFieldInBody(res, field, message)
        } else if(location==="header") {
            missingFieldInHeader(res, field, message)
        } else if(location==="query") {
            missingFieldInQuery(res, field, message)
        } else {
            res.status(500).end();
        }
    };

    res.parameterTypeError = function(field, type, message) {
        parameterTypeError(res, field, type, message);
    };

    res.unacceptableParameter = function(field, code, message) {
        unacceptableParameter(res, field, code, message);
    };

    res.throttle = function(code, message) {
        throttle(res, code, message);
    };

    res.notAcceptable = function(allowedType) {
        notAcceptable(res, allowedType);
    };

    res.notFound = function(param) {
        notFound(res, param);
    }

    res.sysError = function(errorCode) {
        var responseObj = {
            status: false,
            error: {
                code: errorCode,
                message: null
            }
        };

        switch (errorCode) {
            case 1:
                responseObj.error.message = "Unexpected system error";
                break;

            case 2:
                responseObj.error.message = "Unexpected database error";
                break;

            case 3:
                responseObj.error.message = "Unexpected subService error";
                break;

            default:
                responseObj.error.message = "Unexpected system error";
                break;
        }

        res.status(500).json(responseObj);
    }

    res.rejectUnauthorizedAccess = function() {
        res.status(401).json({
            status: false,
            error: {
                code: 401,
                message: "Unauthorized Access"
            }
        });
        //res.status(401).end();
    }

    next();
};

module.exports = middleware;