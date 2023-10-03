const express = require('express');
const dotenv = require('dotenv');
const server =express();
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const productRouter = require("./routes/Products");
const morgan = require('morgan');
const categoriesRouter= require("./routes/Categories");
const brandsRouter = require("./routes/Brands");

// Process ENV variables
dotenv.config();
const PORT = process.env.PORT || 5004;
const MONGO_URL = process.env.MONGO_URL || "";

// Config Database Configuration
mongoConnection().catch(err => console.error(err));
async function mongoConnection(){
    await mongoose.connect(MONGO_URL);
    console.log('database connection established');
} 
// middleware
server.use(cors({
    exposedHeaders:['X-Total-Count']
}));
server.use(express.json());
server.use(helmet());
server.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
server.use(morgan("common"));



// routes
server.use("/products", productRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/categories", categoriesRouter.router);



server.listen(PORT,() => {
    console.log(`Server listening on ${PORT}`);
})