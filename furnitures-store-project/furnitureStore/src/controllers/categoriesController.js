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


async function allCategories (req, res) {
    try {
        if (!db) {
            throw new Error("Database not connected");
        }

        
        const query = "SELECT `categories`.`id`, `categories`.`name`, COUNT(`furniture`.`category`) AS `products` FROM `categories` LEFT JOIN `furniture` ON `categories`.`id` = `furniture`.`category` GROUP BY `categories`.`id`, `categories`.`name`;";
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

module.exports = {allCategories}