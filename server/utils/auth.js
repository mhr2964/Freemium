export function formatUser(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    isPremium: user.isPremium,
    createdAt: user.createdAt
  };
}

export function setSessionUser(req, user) {
  req.session.user = {
    id: user._id.toString(),
    username: user.username,
    isPremium: user.isPremium
  };
}
