var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
})

connection.connect(function(err) {
    console.log("Connected as id: " + connection.threadId);
});

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

var postAuction = function() {
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "What item would you like to sell?"
    }, {
        name: "category",
        type: "input",
        message: "What category is your item?"
    }, {
        name: "startingBid",
        type: "input",
        message: "What is the starting bid?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO auctions SET ?", {
                itemname: answer.item,
                category: answer.category,
                startingbid: answer.startingBid,
                highestbid: answer.startingBid
            },
            function(err, res) {
                console.log("Your auction was created successfully.");
                start();
            })
    })
}