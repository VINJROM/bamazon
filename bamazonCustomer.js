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

// user picks from list of items to buy
var buyingList = function() {
        connection.query("SELECT * FROM products", function(err, res) {
            console.log(res);
            inquirer.prompt({
                name: "choice",
                type: "rawlist",
                // forloop displays products as array-objects
                choices: function(value) { var productsArray = []; for (var i = 0; i < res.length; i++) { productsArray.push(res[i].item_name); } return choiceArray; },
                message: "What would you like to buy?"
                    // calls product items,
            }).then(function(answer) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_name == answer.choice) {
                        var chosenItem = res[i];
                        inquirer.prompt({
                            name: "qty",
                            type: "input",
                            message: "How many would you like to buy?",
                            validate: function(value) {
                                    if (isNaN(value) == false) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                                // checks if answer is lower than product quantity
                        }).then(function(answer) {
                            if (chosenItem.stock_quantity < parseInt(answer.qty)) {
                                connection.query("UPDATE auctions SET ? WHERE ?", [{
                                    stock_quantity: answer.qty
                                }, {
                                    id: chosenItem.id
                                }], function(err, res) {
                                    console.log("Bid successfully placed!\n");
                                    start();
                                });
                            } else {
                                console.log("\nYour qty was too low. Try again...");
                                start();
                            }
                        })
                    }
                }
            })
        })