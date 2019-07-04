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
        choices: ["View Inventory", "View Low Inventory", "Add Inventory", "Create New Product"],
    }).then(function(answer) {
        if (answer.startOptions == "View Inventory") {
            viewInventory();
        } else if (answer.startOptions == "View Low Inventory") {
            viewLowInventory();
        } else if (answer.startOptions == "Add Inventory") {
            reOrderInventory();
        } else if (answer.startOptions == "Create New Product") {
            addNewProduct();
        }
    })
}

// view inventory function
var viewInventory = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("\nInventory:\n")
        console.log(res);
        console.log("\n")
        start();
    })
}

// view low-inventory function
var viewLowInventory = function() {
    inquirer.prompt([{
        name: "limit",
        type: "input",
        message: "What is the quantity limit?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        parseInt(answer.limit);
        connection.query("SELECT * FROM products WHERE stock_quantity < " + answer.limit, function(err, res) {
            console.log("\nAll inventory below " + answer.limit + ":\n")
            console.log(res);
            console.log("\n")
            start();
        })
    })
}

// re-order inventory function
var reOrderInventory = function() {
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
            message: "What would you like to add?"
                // calls product items,
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_name == answer.choice) {
                    var chosenItem = res[i];
                    inquirer.prompt({
                        name: "qty",
                        type: "input",
                        message: "How many would you like to add?",
                        // verifies numerical quantity
                        validate: function(value) {
                                if (isNaN(value) == false) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            // Updates targeted quantity with user number
                    }).then(function(answer) {
                        parseInt(answer.qty);
                        // console.log(answer.qty);
                        connection.query("UPDATE products SET stock_quantity = stock_quantity + " + answer.qty + " WHERE id = " + chosenItem.id);
                        console.log("\n" + answer.qty + " of " + chosenItem.item_name + " has successfully been added!" + "\n");
                        start();
                    })
                }
            }
        })
    })
}

// add new product function
var addNewProduct = function() {
    inquirer.prompt([{
        name: "item_name",
        type: "input",
        message: "What item would you like to create?"
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
                console.log("\n" + answer.item_name + " created!\n");
                start();
            })
    })
}