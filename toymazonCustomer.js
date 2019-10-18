require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: process.env.HOST,
    port: 3306,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "toymazon"
});

var breaker = "-----------------------------"
console.log(breaker)
console.log("Welcome to Toymazon!")

function start() {
    console.log(breaker)
    inquirer
        .prompt([{
            name: "categories",
            message: "What kind of products are you interested in?",
            type: "list",
            choices: ["Toys", "Accessories", "Clothing", "Books", "Kitchenware"]
        }]).then(function (req) {
            switch (req.categories) {

                case "Toys":
                    console.log("You are in the Toys section.")
                    console.log(breaker)
                    return toys();

                case "Accessories":
                    return category();
                case "Clothing":
                    return category();
                case "Books":
                    return category();
                case "Kithenware":
                    return category();
            }
        })

};


function toys() {
    connection.query("SELECT * FROM toymazon.store WHERE category = 'Toys'"),
    errors();
    function errors(err, data) {
        if (err) {
            throw err
        } else {
            console.log(data)
        }
    }
};
start();