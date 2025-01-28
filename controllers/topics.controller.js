const endpointsJson = require("../endpoints.json");

const getTopics = (req, res) => {
    res.status(200).send ({topics: endpointsJson})

    .catch((err) =>{
        next (err)
    })
}

module.exports = getTopics;