const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) return res.status(404).json({message: "Error logging in"});

    if(authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User succesfully logged in");
    } else {
        return res.status(208).json({message: "Invalid login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const user = req.session.authorization.username;
    const ISBN = req.params.isbn;
    const review = req.body.review;

    if(!review) {
        return res.status(400).json({message: "No review has been given"});
    } else {
        books[ISBN].reviews[user] = review;
        res.status(200).json({message: "Review has been given!"})
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.session.authorization.username;
    const ISBN = req.params.isbn;
    if(books[ISBN].reviews[user]){
        delete books[ISBN].reviews[user];
        return res.status(200).json({message: `${user} review has been deleted`});
    }
    return res.status(400).json({message: "There has been a problem deleting"})

     


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
