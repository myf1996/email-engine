const elasticsearch = require("elasticsearch");
const config = require("../config");

const esClient = new elasticsearch.Client({
  host: config.elasticsearch.baseUrl,
  // log: 'trace'
});

class ElasticSearchService {
  constructor() { }

  async ping() {
    return await esClient.ping({ requestTimeout: 3000 });
  }

  // Add Index
  async add(index, data) {
    return esClient.index({
      index: index,
      id: data.id,
      body: data,
    });
  }

  // Get Index Data
  async get(index, data) {
    return esClient.get({ index, ...data });
  }

  // Search Data based on index and query
  async search(index, query) {
    const result = await esClient.search({
      index: index,
      body: query,
    });
    return result?.hits?.hits?.map((hit) => hit?._source);
  }

  // update data
  async update(index, id, data) {
    return await esClient.update({
      index,
      id,
      body: {
        doc: data,
      },
    });
  }

  // Add Bulk data
  async bulk(data) {
    return esClient.bulk(data);
  }
}

module.exports = {
  ElasticSearchService,
};
