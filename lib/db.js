import { MongoClient } from 'mongodb';

export const DB_NAME = 'auth';
export const COLLECTION_NAME = 'users';

export const connectToDatabase = async ()=>{
  const client = MongoClient.connect(process.env.MONGO_DB_URI);
  return client;
};