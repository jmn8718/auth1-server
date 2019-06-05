module.exports.checkLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/users');
  }
  next();
};

module.exports.ensureAuthenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};
