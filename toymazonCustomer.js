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
        shop();
    });
};

function shop() {
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
                shop();
                return false;
            }
        }]).then(function (ans) {
            buyID = ans.buy;
            var query1 = "SELECT product, price, stock FROM toymazon.store WHERE ?"
            connection.query(query1, {
                id: buyID
            }, function (err, res) {
                buyProduct = res[0].product;
                console.log(" Item #: " + buyID + " | " + res[0].product)
                buyStock = res[0].stock;
                buyPrice = res[0].price;
                quantity();
                if (err) throw err;
            })
        });
};

function quantity() {
    console.log(breaker)
    inquirer
        .prompt([{
            name: "quantity",
            message: "How many of " + buyProduct + "s would you like to purchase?",
            type: "number",
            validate: function (ans) {
                if (isNaN(ans) === false) {
                    return true;
                }
                console.log("\n", breaker);
                console.log("\nPlease enter a valid number.");
                quantity();
                return false;
            }
        }]).then(function (ans) {
            buyQuantity = ans.quantity;
            stockCheck();
        })
};

function stockCheck() {
    var quantityCheck = buyStock - buyQuantity;
    if (quantityCheck <= 0) {
        inquirer
            .prompt([{
                name: "change",
                message: "Unfortunately we currently only have " + buyStock + " available of the " + buyProduct + ".\n Would you like to:",
                type: "list",
                choices: ["Purchase another amount", "Select another item to purchase"]
            }]).then(function (ans) {

                switch (ans.change) {
                    case "Purchase another amount":
                        return quantity();
                    case "Select another item to purchase":
                        return catalogue();
                }
            });
    } else {
        sold();

        function sold() {
            console.log(breaker);
            var totalPrice = buyQuantity * buyPrice;
            var totalPriceRounded = totalPrice.toFixed(2);
            inquirer
                .prompt([{
                    name: "checkout",
                    message: "Checkout confirmation:\n Product: " + buyProduct + "\n Quantity: " + buyQuantity + "\n Total price: $" + totalPriceRounded + "\n Is this correct? ",
                    type: "confirm",
                    default: false
                }]).then(function (ans) {
                    if (ans.checkout) {
                        updateStock();
                    } else {
                        inquirer
                            .prompt([{
                                name: "more",
                                message: "Would you like to purchase another product?",
                                type: "confirm"
                            }]).then(function (ans) {
                                if (ans.more) {
                                    catalogue();
                                } else {
                                    console.log("\n Thank you for shopping at Toymazon! Have a lovely day!")
                                    console.log(breaker);
                                    connection.end();
                                }
                            })

                    }

                    function updateStock() {
                        console.log(breaker);
                        var query2 = "UPDATE toymazon.store SET ? WHERE ?";
                        connection.query(query2, [{
                                stock: quantityCheck
                            }, {
                                id: buyID
                            }],
                            function (err, res) {
                                console.log("Your order of " + buyQuantity + " " + buyProduct + "(s) will be send to you soon.");
                                inquirer
                                    .prompt([{
                                        name: "more",
                                        message: "Would you like to purchase another product?",
                                        type: "confirm"
                                    }]).then(function (ans) {
                                        if (ans.more) {
                                            catalogue();
                                        } else {
                                            console.log("\n Thank you for shopping at Toymazon! Have a lovely day!")
                                            console.log(breaker);
                                            connection.end();
                                        }
                                    })
                            })
                    }
                })

        }
    }
};