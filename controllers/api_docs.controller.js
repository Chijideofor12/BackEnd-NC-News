const endpointsJson = require("../endpoints.json");

const getApiDocs = (req, res) =>{
res.status(200).send({endpoints: endpointsJson});
}

module.exports = getApiDocs;