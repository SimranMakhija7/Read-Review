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
    var sql = 'SELECT title, Fname_auth, Lname_auth, author.auth_id FROM book,written_by,author where book.isbn = written_by.isbn and book.edition = written_by.edition and author.auth_id=written_by.auth_id';
    conn.query(sql,function (error,results,fields){
        if(error){
            console.log('error: '+error);
        }

        results.forEach(e => {
            e['auth_link']='/author/'+e['auth_id']
        });
        res.render('booklist',{title:'List',Data: results});
    })
});

router.get('/author/:id', (req, res) => {
    var sql = 'SELECT * FROM author WHERE auth_id=?'
    conn.query(sql, req.params.id, function (err, results, fields) {
        if (err) console.log("error :" + err)
        var authData = results[0];
        conn.query('select AVG(stars) as stars from author_ratings where auth_id=?',
            authData.auth_id,
            (err, rating , fields) => {
                if (err) console.log("error :" + err)
                var stars = rating[0].stars
                conn.query(
                    'select * from author_reviews where auth_id =? ',
                    authData.auth_id,
                    (e, r, f) => {
                        if (e) console.log("e:" + e)
                        res.render('author', {
                            name: authData.Fname_auth+" "+authData.Lname_auth,
                            bio: authData.bio,
                            rating: stars,
                            reviews: r
                        })
                    }
                )
                
            }
        )        
        
    })
});

router.post('/search',(req,res)=>{
    var strBook = req.body.booksearch;
    var strAuth = req.body.authorsearch;
        
    console.log(strBook,strAuth);
    if(strAuth && strBook){
        conn.query('select book.title,author.Fname_auth,author.Lname_auth from written_by natural join book natural join author where title like"%'+strBook+'%" and (author.Fname_auth like"%'+strAuth+'%" or author.Lname_auth like"%'+strAuth+'%")',function(err, results, fields) {
            if (err) throw err;
            console.log(results);
            res.render('search',{
                title:'List',
                Data: results,
            })
        });
    }
    else if(strBook){
        //select book.title,author.Fname_auth,author.Lname_auth from written_by natural join book natural join author where title like '%ABC%';
        conn.query('select book.title,author.Fname_auth,author.Lname_auth from written_by natural join book natural join author where title like"%'+strBook+'%"',function(err, results, fields) {
            if (err) throw err;
            console.log(results);
            res.render('search',{
                title:'List',
                Data: results,
            })
        });
    }
    else if(strAuth){
        conn.query('select book.title,author.Fname_auth,author.Lname_auth from written_by natural join book natural join author where author.Fname_auth like"%'+strAuth+'%" or author.Lname_auth like"%'+strAuth+'%"',function(err, results, fields) {
            if (err) throw err;
            console.log(results);
            res.render('search',{
                title:'List',
                Data: results,
            })
        });
    }
});

module.exports = router;