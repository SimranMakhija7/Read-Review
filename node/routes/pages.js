const express = require('express');
const mysql = require('mysql');

const dotenv  = require('dotenv');
dotenv.config({ path:'./.env' });

const router = express.Router();

var config =
{
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	port: 3306,
	ssl: true
};
const conn = new mysql.createConnection(config);

router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/register',(req,res)=>{
    res.render('register');
});

router.get('/login',(req,res)=>{
    res.render('login');
});

router.get('/user/:username',(req,res)=>{
    var sql = 'SELECT * from reader WHERE username = ?'
    conn.query(sql, req.params.username, function (err, results, field) {
        if (err) console.log("error: " + err)
        // console.log(results[0])
        var userData = results[0];
        // console.log(userData.username)
        res.render('user', {
            username: userData.username,
            email: userData.email,
            name: userData.Fname + " " + userData.Lname,
            location: userData.city+", "+userData.state
        })
    } )
    
});

router.get('/books',(req,res)=>{
    var sql = 'SELECT title, Fname_auth, Lname_auth FROM book,written_by,author where book.isbn = written_by.isbn and book.edition = written_by.edition and author.auth_id=written_by.auth_id';
    conn.query(sql,function (error,results,fields){
        if(error){
            console.log('error: '+error);
        }
        res.render('booklist',{title:'List',Data: results});
    });
});



module.exports = router;