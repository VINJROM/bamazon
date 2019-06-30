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
        name: "yesorno",
        type: "rawlist",
        message: "Would you like to buy an item?",
        choices: ["Yes", "No"],
    }).then(function(answer) {
        if (answer.yesorno == "Yes") {
            buyFunction();
        } else {
            start();
        }
    })
}

// user picks from list of items to buy
var buyFunction = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log(res);
        inquirer.prompt({
            name: "choice",
            type: "rawlist",
            // forloop displays products as array-objects
            choices: function(value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].item_name);
                }
                return choiceArray;
            },
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
                        // verifies numerical quantity
                        validate: function(value) {
                                if (isNaN(value) == false) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            // checks if answer is lower than product quantity
                    }).then(function(answer) {
                        if (chosenItem.stock_quantity > parseInt(answer.qty)) {

                            // if answer is less than stock quantity, reduce stock quantity
                            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + answer.qty + " WHERE id = " + chosenItem.id);
                            console.log("Item successfully ordered!");
                            start();
                            // console.log("New " + chosenItem.item_name + " qty = " + chosenItem.stock_quantity)
                        } else {
                            console.log("Sorry, we are out of stock for that item.");
                            start();
                        }
                    })
                }
            }
        })
    })
}