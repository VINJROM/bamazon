var mysql = require('mysql');
var inquirer = require('inquirer');

// MySQL database connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "auction_db"
})

connection.connect(function(err) {
    console.log("Connected as id: " + connection.threadId);
    start();
});

// inquirer starting prompt
var start = function() {
    inquirer.prompt({
        name: "postOrBid",
        type: "rawlist",
        message: "Would you like to [POST] or [BID] on an item?",
        choices: ["POST", "BID"]
    }).then(function(answer) {
        if (answer.postOrBid.toUpperCase() == "POST") {
            postAuction();
        } else {
            bidAuction();
        }
    })
}

// POST function
var postAuction = function() {
    inquirer.prompt([{
        name: "item_name",
        type: "input",
        message: "\nWhat item would you like to post?"
    }, {
        name: "category",
        type: "input",
        message: "What category is your item?"
    }, {
        name: "starting_bid",
        type: "input",
        message: "What is the starting bid?",
        validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
            // pushes input to database
    }]).then(function(answer) {
        connection.query("INSERT INTO auctions SET ?", {
                item_name: answer.item_name,
                category: answer.category,
                starting_bid: answer.starting_bid,
                highest_bid: answer.highest_bid
            },
            function(err, res) {
                console.log("\nYour auction was created successfully!\n");
                start();
            })
    })
}

// BID function
var bidAuction = function() {
    connection.query("SELECT * FROM auctions", function(err, res) {
        console.log(res);
        inquirer.prompt({
            name: "choice",
            type: "rawlist",
            // forloop displays posted items as array-objects
            choices: function(value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].item_name);
                }
                return choiceArray;
            },
            message: "What item would you like to bid on?"
                // calls posted items,
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_name == answer.choice) {
                    var chosenItem = res[i];
                    inquirer.prompt({
                        name: "bid",
                        type: "input",
                        message: "How much would you like to bid?",
                        validate: function(value) {
                                if (isNaN(value) == false) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            // checks if answer is lower than starting bid
                    }).then(function(answer) {
                        if (chosenItem.highest_bid < parseInt(answer.bid)) {
                            connection.query("UPDATE auctions SET ? WHERE ?", [{
                                highest_bid: answer.bid
                            }, {
                                id: chosenItem.id
                            }], function(err, res) {
                                console.log("Bid successfully placed!\n");
                                start();
                            });
                        } else {
                            console.log("\nYour bid was too low. Try again...");
                            start();
                        }
                    })
                }
            }
        })
    })
}