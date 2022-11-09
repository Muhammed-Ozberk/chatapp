const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

/** DB Models */
const allModels = require("./../models");
const Users = allModels.Users;
const sequelize = require('../models/index').sequelize;
/** DB Models END */

module.exports = function (passport) {

    passport.use(new LocalStrategy(async (username, password, cb) => {
        try {
            const user = await sequelize.query(`select * from users where username="${username}"`);
            if (user) {
                const passwordControl = await bcrypt.compare(password, user[0][0].password);
                if (passwordControl) {
                    return cb(null, user[0][0]);
                } else {
                    return cb(null, false, { message: 'Giriş bilgileri hatalı' });
                }
            } else {
                return cb(null, false, { message: 'Giriş bilgileri hatalı' });
            }
        } catch (err) {
            return cb(err);
        }
    }));

    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            cb(null, { id: user.userID, username: user.username, themeMode: user.themeMode, email: user.email });
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });
}