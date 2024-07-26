// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login.html'); // Redirect to login page if not authenticated
    }
}

module.exports = ensureAuthenticated;
