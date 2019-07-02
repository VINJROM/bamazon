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

// displays choices
var start = function() {
    inquirer.prompt({
        name: "startOptions",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["View Inventory", "View Low Inventory", "Re-Order Inventory", "Add New Product"],
    }).then(function(answer) {
        if (answer.startOptions == "View Inventory") {
            viewInventory();
        } else if (answer.startOptions == "View Low Inventory") {
            viewLowInventory();
        } else if (answer.startOptions == "Re-Order Inventory") {
            reOrderInventory();
        } else if (answer.startOptions == "Add New Product") {
            addNewProduct();
        }
    })
}

var viewInventory = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("View Inventory\n")
        console.log(res);
        console.log("\n")
        start();
    })
}

var viewLowInventory = function() {
    inquirer.prompt([{
        name: "user_number",
        type: "input",
        message: "What is the quantity threshold?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        connection.query("SELECT * FROM products WHERE stock_quantity < " + value, function(err, res) {
            console.log("View Low Inventory\n")
            console.log(res);
            console.log("\n")
            start();
        })
    })
}

var reOrderInventory = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log(res);
        inquirer.prompt({
            name: "inventoryChoices",
            type: "rawlist",
            // forloop displays products as array-objects
            choices: function(value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].item_name);
                }
                return choiceArray;
            },
            message: "What would you like to re-order?"
                // calls product items,
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_name == answer.choice) {
                    var chosenItem = res[i];
                    inquirer.prompt({
                        name: "qty",
                        type: "input",
                        message: "How many would you like to order?",
                        // verifies numerical quantity
                        validate: function(value) {
                                if (isNaN(value) == false) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            // user input "qty" not affecting quantity
                    }).then(function(answer) {
                        connection.query("UPDATE products SET stock_quantity = stock_quantity + " + answer.qty + " WHERE id = " + chosenItem.id);
                        console.log("Item successfully ordered!");
                        start();
                    })
                }
            }
        })
    })
}

var addNewProduct = function() {
    inquirer.prompt([{
        name: "item_name",
        type: "input",
        message: "\nWhat item would you like to add?"
    }, {
        name: "department_name",
        type: "input",
        message: "What department is your item?"
    }, {
        name: "customer_price",
        type: "input",
        message: "What is the customer price?",
        validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
            // pushes input to database
    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", {
                item_name: answer.item_name,
                department_name: answer.department_name,
                customer_price: answer.customer_price,
                stock_quantity: "0"
            },
            function() {
                console.log("\nProduct added!\n");
                start();
            })
    })
}