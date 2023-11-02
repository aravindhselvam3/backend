const config = require('./utils/config');
const mongoose = require('mongoose');
const app = require('./app');
const { prototype } = require('jsonwebtoken/lib/TokenExpiredError');

console.log("Connecting to MongoDB");
mongoose.connect(config.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
        app.listen(config.PORT, () => {
            console.log(`Server running on PORT ${config.PORT}`);
        });
    })
    .catch((error) => {
        console.error('error connecting to MongoDB',error);
    });