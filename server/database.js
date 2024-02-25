require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/";

const options = {
  ServerApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationError: true,
  },
};
let client;
const connectToMongoDB = async () => {
    if (!client) {
      try {
        client = await MongoClient.connect(uri, options);
        console.log("Connected to MongoDB");
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; 
      }
    }
    return client;
  };
  

const getConnectedClient = () => client;

module.exports = { connectToMongoDB, getConnectedClient };
