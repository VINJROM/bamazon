var mysql = require('mysql');
var inquirer = require('inquirer');

// MySQL database connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
})

connection.connect(function(err) {
    console.log("Connected as id: " + connection.threadId);
    start();
});

// asks if user would like to buy item
var start = function() {
    inquirer.prompt({
        name: "startOptions",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["View Products", "View Low Inventory", "Re-Order Inventory", "Add New Product"],
    }).then(function(answer) {
        if (answer.yesorno == "Yes") {
            buyFunction();
        } else {
            start();
        }
    })
}