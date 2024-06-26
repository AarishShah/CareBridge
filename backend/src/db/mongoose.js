const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");

const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const clusterUrl = encodeURIComponent(process.env.DB_CLUSTER_URL);
const dbName = encodeURIComponent(process.env.DB_NAME);
const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/${dbName}?retryWrites=true&w=majority`;

mongoose.connect
    (
        uri,
        {}
    ).catch(error =>
    {
        if (error.name === 'MongooseServerSelectionError')
        {
            console.error("Database connection failed: IP not registered");
        } else if (error.code === 'ECONNREFUSED')
        {
            console.error("Database connection failed: Connection refused (likely due to no internet connection)");
        } else
        {
            console.error("Database connection failed:", error);
        }
        process.exit(1); // Optionally exit the process if unable to connect
    });

// will keep listening to the events and throw error if any during the entire connection process
mongoose.connection.on('error', err =>
{
    console.error('Mongoose connection error:', err);
});

// to check only once if the connection is "open"
mongoose.connection.once('open', () =>
{
    console.log('Connected to MongoDB successfully!');
});