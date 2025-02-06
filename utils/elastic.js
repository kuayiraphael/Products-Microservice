const { Client } = require("@elastic/elasticsearch");

// ElasticSearch client setup
const elasticClient = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID, // Add to .env
  },
  auth: {
    username: process.env.ELASTIC_USERNAME, // Add to .env
    password: process.env.ELASTIC_PASSWORD, // Add to .env
  },
});

// Index product data
const indexProduct = async (product) => {
  try {
    // Ensure that the product does not include _id in the document body
    const { _id, ...productData } = product;

    const response = await elasticClient.index({
      index: "products", // Elasticsearch index
      id: _id, // Use MongoDB ID as the document ID
      document: productData, // Send product data excluding _id
    });

    console.log("Product indexed successfully:", response);
  } catch (error) {
    console.error("ElasticSearch Indexing Failed:", error.message);
    throw error;
  }
};

// module.exports = { elasticClient, indexProduct };
// Perform search with filters
const searchProducts = async (query, filters) => {
  try {
    const body = {
      query: {
        bool: {
          must: query
            ? [
                {
                  multi_match: {
                    query,
                    fields: ["name", "desc", "type"], // Adjust fields as needed
                  },
                },
              ]
            : [],
          filter: [
            ...(filters.category ? [{ term: { type: filters.category } }] : []),
            ...(filters.minPrice || filters.maxPrice
              ? [
                  {
                    range: {
                      price: {
                        ...(filters.minPrice && { gte: filters.minPrice }),
                        ...(filters.maxPrice && { lte: filters.maxPrice }),
                      },
                    },
                  },
                ]
              : []),
          ],
        },
      },
    };
    console.log("Search Query Body:", JSON.stringify(body, null, 2));
    const response = await elasticClient.search({
      index: "products",
      body,
    });

    return response.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));
  } catch (error) {
    console.error("ElasticSearch search failed:", error.message);
    throw error;
  }
};

module.exports = { elasticClient, indexProduct, searchProducts };
