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
connection.connect(function (err) {
    if (err) throw err;
    console.log(breaker)
    console.log("Welcome to Toymazon!")
    console.log("Your customer id is: " + connection.threadId + "\n");
    catalogue();
});

function catalogue() {
    console.log(breaker);
    console.log("Here is the items available in store at the moment:\n");
    connection.query("SELECT * FROM toymazon.store", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            var price = res[i].price
            var priceString = price.toFixed(2);
            console.log("Item#: " + res[i].id + " |" + " Product Name: " + res[i].product + " |" + " Price: " + "$" + priceString);
        }

    });
}