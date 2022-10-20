const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const passport = require('passport');
require('../helpers/passport')(passport);


/** DB Models */
const allModels = require("./../models");
const { Op } = require("sequelize");
const Users = allModels.Users;
/** DB Models END */

router.get('/login', (req, res, next) => {
    res.render('pages/login', { title: "Login" });
});

router.post('/login-post', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureMessage: true
    })(req, res, next);
    console.log(req.isAuthenticated());
    
});

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


router.get('/register', (req, res, next) => {
    res.render('pages/register', { title: "Register" });
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
            uuidv4();
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
                    console.log(newUser);
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