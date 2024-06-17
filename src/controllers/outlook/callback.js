const { OutlookServices } = require("../../service/outlook.service");

module.exports = () => ({
  get: async (req, res) => {
    try {
      const query = req.query;
      const outlookServices = new OutlookServices();
      let response = await outlookServices.callback(query);
      req.session.userId = response.id;
      res.redirect(`/index`);
    } catch (error) {
      if (error?.response?.status === 400) {
        res.status(400).send({ message: "Bad Request. Invalid/Expired Code" });
      } else {
        console.error("error:",error)
        res.status(500).send(error);
      }
    }
  },
});
