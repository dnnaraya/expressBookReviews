const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
  
});

//Task10

const getBooks = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};
//Task 1& 10
// res.send(JSON.stringify(books,null,4))
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
      const book_arr = await getBooks(); 
      res.send(book_arr); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  });

//Task 11 & 2
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let isbn_int = parseInt(isbn);
        if (books[isbn_int]) {
            resolve(books[isbn_int]);
        } else {
            reject({ status: 404, message: `No books found with the ISBN ${isbn} ` });
        }
    });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    //const isbn = req.params.isbn;
    // res.send(books[isbn])
    try {
        const book = await getBookByISBN(req.params.isbn); 
        res.send(book); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong!" });
      }
 });
  
//Task 12 & 3
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    /*const author_name = req.params.author;
    const isbns_values = Object.values(books);
    console.log(isbns_values);
    let filtered_books = isbns_values.filter((book) => book.author === author_name);
    res.send(filtered_books);*/

    const author_name = req.params.author;
    let book = [];
    let bookList = await getBooks();

    Object.keys(bookList).forEach(i => {
        if(bookList[i].author == author_name){
            book.push(books[i])
        }
    });
    res.send(book);
});

//Task 13 & 4
// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    /*const title_name = req.params.title;
    const isbns_values = Object.values(books);
    console.log(isbns_values);
    let filtered_books = isbns_values.filter((book) => book.title === title_name);
    res.send(filtered_books);*/

    const title_name = req.params.title;
    let book = [];
    let bookList = await getBooks();

    Object.keys(bookList).forEach(i => {
        if(bookList[i].title == title_name){
            book.push(books[i])
        }
    });
    res.send(book);


});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const filtered_book = books[isbn];
  res.send(filtered_book.reviews);
});

module.exports.general = public_users;
