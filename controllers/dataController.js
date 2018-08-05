import {initDB} from '../resources/C';

const dataController = {};

dataController.opportunities = (req, res) => {
    const resultsPerPage = parseInt(req.query.resultsPerPage || 50);
    const page = parseInt(req.query.page || 0);

    let collectionSize = 0;
    // worth caching the result of initDB() somewhere?
    const db = initDB()
                .then(db => {
                    // fetch records
                    const collection = db.db("visadb").collection("opportunities");
                    // collectionSize and collection.find() returned as promises, need to wrap in Promise.all
                    return Promise.all(
                        [collection.count(), collection.find({}, {skip: page * resultsPerPage, limit: resultsPerPage})]
                    );
                })
                .then(array => {
                    collectionSize = array[0];
                    return array[1].toArray();
                })
                .then(data => res.json({
                    collectionSize,
                    data
                }));
};

module.exports = dataController;
