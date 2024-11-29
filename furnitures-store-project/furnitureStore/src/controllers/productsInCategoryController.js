const mysql = require('promise-mysql');

const dbSettings = {
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "furniture"
};

let db;
mysql.createConnection(dbSettings).then(connection => {
    db = connection;
    console.log("Connected to the database.");
}).catch(error => {
    console.error("Database connection failed:", error);
});

async function getProductsInACategory(req, res) {
    try {
        if (!db) {
            throw new Error("Database not connected");
        }

        const cat = req.query.cat;
        const query = 'SELECT `id`, `price`, `stock`, `color` FROM `furniture` WHERE `category` = ' + cat ;
        const products = await db.query(query);

        res.status(200).json({
            message: "Successfully retrieved products",
            data: products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unexpected error",
            data: [],
        });
    }

   
    
}

module.exports = {getProductsInACategory}