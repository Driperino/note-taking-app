const GitHubStrategy = require('passport-github2').Strategy;
const { User } = require('../models/models');

const githubStrategy = new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            console.log('GitHub profile:', profile);
            let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            let user = await User.findOne({ githubId: profile.id });
            if (!user) {
                let username = profile.username;
                // Check for duplicate username and generate a unique one if needed
                while (await User.findOne({ username })) {
                    username = profile.username + Math.floor(Math.random() * 10000);
                }
                user = await User.create({
                    githubId: profile.id,
                    username: username,
                    email: email // This could be null
                });
            }
            return cb(null, user);
        } catch (error) {
            console.error('Error in GitHub strategy:', error);
            return cb(error);
        }
    });

module.exports = githubStrategy;
