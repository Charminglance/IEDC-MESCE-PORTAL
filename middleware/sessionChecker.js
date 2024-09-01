// middleware/sessionChecker.js
function sessionChecker(req, res, next) {
    if (req.session.adminId) {
        next(); // Session exists, proceed to the next middleware or route handler
    } else {
        res.redirect('/admin-login?message=Session timed out, please log in again.');
    }
}

module.exports = sessionChecker;
