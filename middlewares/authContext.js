module.exports = (req, res, next) => {
  if (!req.context)
    req.context = {};

  if (req.user) {
    let user = req.user;
    req.context.userId = user._id;
    req.context.user = {
      username: user.username,
      role: user.role,
      verified: user.verified
    }
  }
  
  next();
}