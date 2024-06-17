module.exports = () => ({
  get: async (req, res) => {
    req.session.userId = null;
    res.redirect("/index");
  },
});
