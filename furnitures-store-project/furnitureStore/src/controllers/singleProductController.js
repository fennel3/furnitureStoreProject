const mysql = require('promise-mysql');
const { convertToCM, convertToFeet, convertToInches } = require('../services/unitConverter');

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

async function getSingleProduct(req, res) {
    try {
        const id = req.query.id; 
        const unit = req.query.unit?.toLowerCase(); 


        const query = 'SELECT `category` AS `categoryID`, `width`, `height`, `depth`, `price`, `stock`, `related`, `color` FROM `furniture` WHERE `id` =' + id;
        const product = await db.query(query);


        if (!product[0]) {
            return res.status(404).json({
                message: "Product not found",
                data: null,
            });
        }


        const { width, height, depth, ...rest } = product[0];
        let convertedProduct = { width, height, depth, ...rest };


        if (unit === 'cm') {
            convertedProduct = {
                ...rest,
                width: convertToCM(width),
                height: convertToCM(height),
                depth: convertToCM(depth),
            };
        } 
        else if(unit === 'in') {
            convertedProduct = {
                ...rest,
                width: convertToInches(width),
                height: convertToInches(height),
                depth: convertToInches(depth),
            };
        } 
        else if (unit === 'ft') {
            convertedProduct = {
                ...rest,
                width: convertToFeet(width),
                height: convertToFeet(height),
                depth: convertToFeet(depth),
            } 
        } 


        res.status(200).json({
            message: "Successfully retrieved product",
            data: convertedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unexpected error",
            data: [],
        });
    }
}

module.exports = {getSingleProduct}