const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const passport = require('passport');
require('../helpers/passport')(passport);
const authorize = require('../middleware/authorize').notLoggedIn;


/** DB Models */
const allModels = require("./../models");
const { Op } = require("sequelize");
const Users = allModels.Users;
/** DB Models END */

router.get('/login',authorize, (req, res, next) => {
    res.render('pages/login', { title: "Login" });
});


router.get('/login', (req, res, next) => {
    res.render('pages/login', { title: "Login" });
});

router.get('/register', (req, res, next) => {
    res.render('pages/register', { title: "Register" });
});

router.post('/login-post',authorize, (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/chats',
        failureRedirect: '/login',
        failureMessage: true
    })(req, res, next);    
});

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


router.post('/register-post', async (req, res, next) => {

    const viewPath = "pages/register";
    let { username, email, password } = req.body;
    const userID = uuidv4();

    if (!username) {
        return res.redirect(400, '/register');
    } else if (!email) {
        return res.redirect(400, '/register');
    } else if (!password) {
        return res.redirect(400, '/register');
    } else {
        try {
            const user = await Users.findOne({
                where: {
                    [Op.or]: [{ email: email }, { username: username }]
                }
            });

            if (!user) {
                const hashPassword = await bcrypt.hash(password, 10);
                const newUser = await Users.create({
                    userID,
                    username,
                    email,
                    password: hashPassword,
                });
                if (newUser) {
                    res.redirect('/login');
                } else {
                    return res.render(viewPath, {
                        status: false,
                        error: "Kullanıcı kaydedilirken bir hata oluştu"
                    });
                }
            } else {
                if (user.userName == username) {
                    return res.render(viewPath, {
                        status: false,
                        error: "Bu kullanıcı adı başka bir hesap tarafından kullanılmakta"
                    });
                } else {
                    return res.render(viewPath, {
                        status: false,
                        error: "Bu email değeri başka bir hesap tarafından kullanılmakta"
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
});




module.exports = router;