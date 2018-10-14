// collection of constants and functions to be used throughout
import {MongoClient} from 'mongodb';

// Mongo DB object. Would be nice to not have to initialise this every time we need to retrieve/write data
let db;

const initDB = () => {
    // const dbString = 'mongodb://admin:admin1453@ds125423.mlab.com:25423/translation';
    const dbString = 'mongodb://localhost:27017/translation';
    const dbPV = MongoClient.connect(dbString);

    db = dbPV;
};

const getDB = () => {
    // just in case call wasn't made in app.js
    if( db === undefined ) initDB();

    return db;
};

module.exports = {
    db,
    initDB,
    getDB
};