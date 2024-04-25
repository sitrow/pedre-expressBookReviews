const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if(!userExists(username)) {
            users.push(
                {
                    "username":username,
                    "password":password
                }
            );
            return res.status(200).json({message:"User succesfully registred. You can login now"});
        } else {
            return res.status(404).json({message:"User already exists"});
        }        
    } else {
        if (!username) {
            return res.status(200).json({message:"Please give a username"});
        } else if(!password) {
            return res.status(200).json({message:"Please provide a password"});
        }

    }
    return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    new Promise((resolve, reject) => {
        if(books) {
            resolve(books);
        } else {
            reject(new Error("Book data not available"));
        }
    }).then((books) => res.send(JSON.stringify(books,null,4)))
    .catch((error) => res.status(500).send(error.message));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    const findBook = new Promise((resolve,reject) => {
        const bookToSend = books[ISBN];
        if(bookToSend) {
            resolve(bookToSend);
        } else {
            reject(new Error("Book wasn't found"));
        }
    });

    findBook.then((bookToSend)=> {
        res.send(bookToSend);
    }).catch((error) => {
        res.status(404).send(error.message);
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    // let authorsBooks = Object.keys(books)
    //                     .filter(key => books[key].author === author)
    //                     .map(key => books[key]);
    // return res.send(authorsBooks);

    const findAuthorsBooks = new Promise((resolve, reject) => {
        const authorsBooks = Object.values(books).filter(book => book.author === author);
        if(authorsBooks.length > 0) {
            resolve(authorsBooks);
        } else {
            reject(new Error("No books found for author"));        }
    });

    findAuthorsBooks.then((authorsBooks) => {
        res.send(authorsBooks);
    }).catch((error) => {
        res.status(404).send(error.message);
    });    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // const title = req.params.title;
    // let titlesBook = books[Object.keys(books).filter(key => books[key].title === title)];
    // return res.send(titlesBook);    
    const title = req.params.title;
 
    const findTitlesBook = new Promise((resolve, reject) => {
        const titlesBook = Object.keys(books)
            .filter(key => books[key].title === title)
            .map(key => books[key]);
        
        if (titlesBook.length > 0) {
                resolve(titlesBook[0]); 
        } else {
            reject(new Error("No book found with the specified title"));
          }
    });
      
    findTitlesBook.then((titlesBook) => {
        res.send(titlesBook);
    }).catch((error) => {
        res.status(404).send(error.message);
    });
          
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const ISBN = req.params.isbn;
    let reviews = books[ISBN].reviews;
    return res.send(reviews);
});

const userExists = (username) => {
    let usersNum = users.filter((user) => {
        return user.username === username;
    });
    if(usersNum.length > 0){
        return true;
    } else {
        return false;
    }
}

module.exports.general = public_users;
