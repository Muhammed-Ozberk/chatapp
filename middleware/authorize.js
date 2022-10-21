const loggedIn = function (req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login');
    } 
}

const notLoggedIn = function (req, res, next) {

    if (!req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/chats');
    } 
}

// const notLoggedIn = function (req, res, next) {
//     if (!req.isAuthenticated()) {
//         return next();
//     }
//     else {
//         res.redirect('/yonetim');
//     }
// }

module.exports = { loggedIn, notLoggedIn };