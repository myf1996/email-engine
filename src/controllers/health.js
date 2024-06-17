module.exports = () => ({
  get: async (req, res) => {
    res.json({ message: "Innoscripta is healthy." });
  },
});
