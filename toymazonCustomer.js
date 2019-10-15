var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localHost",
    port: 3306,
    user: "root",
    password: "Rebecca1!",
    database: "greatbay_db"
});