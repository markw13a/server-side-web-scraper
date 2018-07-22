import {MongoClient} from 'mongodb';
import credentials from './credentials';

/**Returns initialised MongoDB object as a promise */
const initDB = () => {
    const mongodb = `mongodb://${credentials.Mongo.login}:${credentials.Mongo.password}@ds247047.mlab.com:47047/visadb`;
    const db = MongoClient.connect(mongodb);
    return db;
};

/**Download all records from given collection.
 * Note: Returns MongoDB Object. Need to do output.toArray() to access data 
 * @param dbObj MongoDb Object as returned from initDB
 * @param dbName Name of DB you wish to query
 * @param collection Name of collection 
*/
const fetchFromDB = ({db, dbName, collection, query={}}) => {
    return db.db(dbName).collection(collection).find(query);
};

module.exports = {
    initDB,
    fetchFromDB
};
