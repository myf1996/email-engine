const { OutlookServices } = require("../../service/outlook.service");

module.exports = () => ({
  post: async (req, res) => {
    try {
      const body = req.body;
      const outlookServices = new OutlookServices();
      await outlookServices.webhook(body);
      res.send({ message: "OK" });
    } catch (error) {
      console.error("error:", error);
      res.status(500).send(error);
    }
  },
});
