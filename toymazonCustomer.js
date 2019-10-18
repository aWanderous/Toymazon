require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var breaker = "-----------------------------"
var buyID;
var buyProduct;
var buyQuantity;
var buyPrice;
var buyStock;


var connection = mysql.createConnection({
    host: process.env.HOST,
    port: 3306,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "toymazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(breaker)
    console.log("Welcome to Toymazon!")
    console.log("Your customer id is: " + connection.threadId);
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
            console.log("Item #: " + res[i].id + " | Product Name: " + res[i].product + " | Price: $" + priceString);
        }
        shopping();
    });
};

function shopping() {
    console.log(breaker);
    inquirer
        .prompt([{
            name: "buy",
            message: "Please enter the item # of the product you wish to purchase.",
            type: "number",
            validate: function (ans) {
                if (isNaN(ans) === false) {
                    return true;
                }
                console.log("\n", breaker);
                console.log("\nPlease enter a valid Item ID number.");
                shopping();
                return false;
            }
        }]).then(function (ans) {
            buyID = ans.buy;
            var query1 = "SELECT product, price, stock FROM toymazon.store WHERE ?"
            connection.query(query1, {id: buyID }, function (err, res){
                buyProduct = res[0].product;
                console.log("Item #: " + itemID + " | " + res[0].product)
                buyStock = res[0].stock;
                buyPrice = res[0].price;
                quantity();
                if (err) throw err;
            })
        });
};

function quantity(){
    inquirer
    .prompt([{
        name: "quantity",
        message: "How many of " + buyProduct + "(s) would you like to purchase?",
        type: "number"
    }]).then(function (ans){
        buyQuantity = ans.quantity;
        enoughStock();
    }) 
};
