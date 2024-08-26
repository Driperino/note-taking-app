const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/models');
const crypto = require('crypto');

const localStrategy = new LocalStrategy(async (username, password, cb) => {
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return cb(null, false, { message: "Incorrect username or password." });
        }

        crypto.pbkdf2(password, Buffer.from(user.passwordSalt, 'base64'), 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) {
                return cb(err);
            }

            if (!crypto.timingSafeEqual(Buffer.from(user.passwordHash, 'base64'), hashedPassword)) {
                return cb(null, false, { message: "Incorrect username or password." });
            }

            return cb(null, user);
        });
    } catch (error) {
        return cb(error);
    }
});

module.exports = localStrategy;
