# Bamazon.js #

Welcome to Bamazon! This is an Amazon-like storefront built with MySQL and Node.js. 

Within the customer portal, you can view the inventory, choose an item you'd like to purchase
along with the quantity, and voila! Transaction complete! However, if we do not have enough 
of the selected item in stock deeming us unable to fulfill your purchase, the transaction 
will not go through.

Within the manager portal, you can view all inventory in the store, view all low
inventory (less than 5 items in stock), choose to up the inventory back to the correct amount
needed, and even add new items to your inventory! 

Happy shopping!


# Description #

Welcome to Bamazon! This is an Amazon-like storefront built with MySQL and Node.js.

Within the customer portal,**bamazonCustomer.js**, you can view the inventory, choose an item you'd like to purchase
along with the quantity, and voila! Transaction complete! However, if we do not have enough 
of the selected item in stock deeming us unable to fulfill your purchase, the transaction 
will not go through.
![bamazon-](screenshots/customer_01.png)

Within the manager portal,**bamazonManager.js**, you can view all inventory in the store, view all low
inventory (less than 5 items in stock), choose to up the inventory back to the correct amount
needed, and even add new items to your inventory! 
![bamazon-](screenshots/manager_01.png)

_Selecting *view low-inventory* lets users set a limit that displays all products under set-limit._
![bamazon-](screenshots/manager_03.png)

_Selecting the *add inventory* lets users add their desired product and place it into a department while updating the corresponding MySQL database in real-time_
![bamazon-](screenshots/manager_02.png)

# Getting Started #
To get started on this project, follow the installations instructions below.
Installations

###### Step 1
> npm install

The above command will install all the dependencies you need


###### Step 2
> Enter node bamazonCustomer in CLI to kickstart app


# Built With
* MySQL
* Node.JS
* JavaScript


 
