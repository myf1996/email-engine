const { ElasticSearchService } = require("../service/elasticsearch.service");

module.exports = () => ({
  get: async (req, res) => {
    try {
      const { userId } = req.session;
      const elasticSearchServices = new ElasticSearchService();
      const response = await elasticSearchServices.search("email_messages", {
        query: { match: { user_id: userId } },
      });
      res.json(response);
    } catch (error) {
      if (error?.status || error?.responnse?.status) {
        res.status(error?.status || error?.responnse?.status).send(error);
      } else {
        res
          .status(500)
          .send({ ...error, message: "Something Went Wrong!" });
      }
    }
  },
});
