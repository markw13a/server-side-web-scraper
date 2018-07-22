import {initDB, fetchFromDB} from '../resources/C';

const dataController = {};

dataController.opportunities = (req, res) => {
    //Worth caching the result of initDB() somewhere?
    const db = initDB()
                .then(db => fetchFromDB({db, dbName: "visadb", collection: "opportunities"}))
                .then(v => v.toArray())
                .then(data => res.json(data));
};

module.exports = dataController;
