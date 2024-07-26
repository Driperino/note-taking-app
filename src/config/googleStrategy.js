const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/models');

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            console.log('Google profile:', profile);
            let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                let username = profile.displayName.replace(/\s+/g, ''); // Remove spaces
                // Check for duplicate username and generate a unique one if needed
                while (await User.findOne({ username })) {
                    username = profile.displayName.replace(/\s+/g, '') + Math.floor(Math.random() * 10000);
                }
                user = await User.create({
                    googleId: profile.id,
                    username: username,
                    email: email // This could be null
                });
            }
            return cb(null, user);
        } catch (error) {
            console.error('Error in Google strategy:', error);
            return cb(error);
        }
    });

module.exports = googleStrategy;
