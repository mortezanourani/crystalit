module.exports = (req, res, next) => {
  if (!req.context)
    req.context = {};

  if (req.user) {
    let user = req.user;
    req.userId = user._id;
    req.user = {
      username: user.username,
      role: user.role,
      verified: user.verified
    }
  }
  
  next();
}