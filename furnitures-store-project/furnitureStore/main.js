const express = require('express');
const cors = require('cors');
const mysql = require('promise-mysql');

const { allCategories } = require('./src/controllers/categoriesController');
const { getProductsInACategory } = require('./src/controllers/productsInCategoryController');
const { getSingleProduct } = require('./src/controllers/singleProductController');

const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Database connection settings
const dbSettings = {
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "furniture"
};

// Connect to MySQL database
let db;
mysql.createConnection(dbSettings).then(connection => {
    db = connection;
    console.log("Connected to the database.");
}).catch(error => {
    console.error("Database connection failed:", error);
});

// /products endpoint to get all products
app.get('/categories', allCategories)
app.get('/products', getProductsInACategory)
app.get('/product', getSingleProduct)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
