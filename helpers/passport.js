const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

/** DB Models */
const allModels = require("./../models");
const { Op } = require("sequelize");
const Users = allModels.Users;
/** DB Models END */

module.exports = function (passport) {

    passport.use(new LocalStrategy(async (username, password, cb) => {
        try {
            const user = await Users.findOne({
                where: { username: username }
            });
            if (user) {
                const passwordControl = await bcrypt.compare(password, user.password);
                if (passwordControl) {
                    return cb(null, user);
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
            cb(null, { id: user.userID, username: user.username, email: user.email });
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });
}