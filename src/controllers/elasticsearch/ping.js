const { ElasticSearchService } = require("../../service/elasticsearch.service");

module.exports = () => ({
  get: async (req, res) => {
    try {
      const elasticSearchServices = new ElasticSearchService();
      await elasticSearchServices.ping();
      res.status(200).send({ message: "Elasticsearch cluster is up!" });
    } catch (error) {
      res
        .status(500)
        .send({ ...error, message: "Elasticsearch cluster is down!" });
    }
  },
});
