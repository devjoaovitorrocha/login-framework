// External Dependencies

import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();


const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
// Global Variables

export const collections: { users?: mongoDB.Collection } = {}

// Initialize Connection

export async function connectToDatabase () {
    
    const connection = await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const usersCollection: mongoDB.Collection = db.collection("users");
 
    collections.users = usersCollection;

    console.log(`Successfully connected to database and collections...`);

    return db
}