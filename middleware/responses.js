function success(res, body) {
    var responseOBJ = {
        status: true,
        error: null,
        data: body
    }

    res.status(200).json(responseOBJ);
}

var middleware = function(req,res,next) {
    res.successful = function(body) {
        if(typeof body==='undefined') {
            success(res,null);
        } else {
            success(res, body);
        }
    };
    next();
};

module.exports = middleware;