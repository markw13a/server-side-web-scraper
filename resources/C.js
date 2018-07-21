import {MongoClient} from 'mongodb';
import credentials from './credentials';

/**Returns initialised MongoDB object as a promise */
const initDB = () => {
    const mongodb = `mongodb://${credentials.Mongo.login}:${credentials.Mongo.password}@ds247047.mlab.com:47047/visadb`;
    const db = MongoClient.connect(mongodb);
    return db;
};

/**Download all jobs from DB */
const downloadJobs = ({db}) => {
    return db.db('visadb')
            .collection('opportunities')
            .find({});
};

module.exports = {
    initDB,
    downloadJobs
};
