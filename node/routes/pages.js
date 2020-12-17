const express = require('express');
const mysql = require('mysql');
const authController = require('../controllers/auth');
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

router.get('/user/:username', (req, res) => {
    // console.log(`Hello ${req.user.username}`)
    var sql = 'SELECT * from reader WHERE username = ?'
    conn.query(sql, req.params.username, function  (err, results, field) {
        if (err) console.log("error: " + err)
        // console.log(results[0])
        var userData = results[0];
        // console.log('pages'+userData.username)
        res.render('user', {
            email: userData.email,
            username: userData.username,
            name: userData.Fname + " " + userData.Lname,
            profile_img: userData.profile_img,
            location: userData.city+", "+userData.state,
            edit_link: '/user/'+userData.username+'/edit-profile'
        })
    } )
    
});

router.get('/user/:username/edit-profile',(req,res)=>{
    var sql = 'SELECT * from reader WHERE username = ?'
    conn.query(sql, req.params.username, function (err, results, field) {
        if (err) console.log("error: " + err)
        // console.log(results[0])
        var userData = results[0];
        console.log(userData.username)
        res.render('edit_profile', {
            username: userData.username,
            email: userData.email,
            Fname: userData.Fname,
            Lname: userData.Lname,
            city: userData.city,
            state: userData.state,
            profile_img: userData.profile_img
          
        })
    } )
})

router.get('/books',(req,res)=>{
    var sql = 'SELECT book.isbn,book.edition,title, Fname_auth, Lname_auth, author.auth_id FROM book,written_by,author where book.isbn = written_by.isbn and book.edition = written_by.edition and author.auth_id=written_by.auth_id';
    conn.query(sql,function (error,results,fields){
        if(error){
            console.log('error: '+error);
        }
        // console.log(results)
        results.forEach(e => {
            e['auth_link'] = '/author/' + e['auth_id']
            e['book_link'] = '/book/'+e['isbn']+'/'+e['edition']
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


router.get('/bookshops',(req,res)=>{
    var sql = 'SELECT * from bookshop';
    conn.query(sql,function (error,results,fields){
        if(error){
            console.log('error: '+error);
        }
        results.forEach(e => {
            e['shop_link'] = '/bookshops/'+e['shop_id']
        })
        res.render('bookshoplist',{title:'List',Data: results});
    })
});

router.get('/bookshops/:id',(req,res) => {
    var sql = 'SELECT * FROM bookshop WHERE shop_id = ?'
    conn.query(sql,req.params.id,function(error,results,field){
        if(error)   console.log(error);
        var bookData = results[0];
      
        conn.query('select name,edition,title,publication_name,quantity,street_no,street_name,city,state from ( bookshop natural join has )  natural join book where bookshop.shop_id = ?',
        bookData.shop_id,
        function(error,data,field) {
            if(error){
                console.log(error);
            }
            if(data.length > 0){
                res.render('bookshop',{
                    data: data
                })
            }else{
                res.render('bookshop',{
                    bookData:bookData
                })
            }
            

        });
    })
})
router.get('/book/:isbn/:edition', (req, res) => {
    var sql = `
        SELECT cover_img, 
        title, 
        Fname_auth, Lname_auth,
        publication_name, date_of_publication, 
        synopsis, book.isbn, book.edition
        FROM book, author, written_by 
        WHERE 
        book.isbn = ${req.params.isbn} 
        and book.edition =  ${req.params.edition}
        and book.isbn = written_by.isbn 
        and author.auth_id = written_by.auth_id 
        and book.edition = written_by.edition 
    `    
    conn.query(sql, (e, r, f) => {
        if (e) console.log(e);
        // console.log(r)
        bookData = r[0]
        // console.log(bookData.title)
        conn.query(`
        select AVG(stars) as stars 
        from book_ratings
        WHERE 
        isbn = ${req.params.isbn} 
        and edition =  ${req.params.edition}
        `, (err, results, field) => {
                if (err) console.log("err: " + err)
                var rate = (results[0].stars)
                conn.query(`
                select * 
                from book_reviews
                WHERE 
                isbn = ${req.params.isbn} 
                and edition =  ${req.params.edition}
                `, (err, reviews, field) => {
                        if (err) console.log("err: " + err)
                        var rating_link = '/rating/book/' + req.params.isbn.toString() + req.params.edition.toString(),
                            review_link = '/review/book/' + req.params.isbn.toString() + req.params.edition.toString();
                        res.render('book', {
                            cover_img: bookData.cover_img,
                            title: bookData.title,
                            author: bookData.Fname_auth + " " + bookData.Lname_auth,
                            publication_name: bookData.publication_name,
                            synopsis: bookData.synopsis,
                            rating: rate,
                            reviews: reviews,
                            rating_link: rating_link,
                            review_link: review_link
                        })
                })
         
                
        })
        
    })
});


router.post('/search',(req,res)=>{
    var strBook = req.body.booksearch;
    var strAuth = req.body.authorsearch;
        
    console.log(strBook,strAuth);
    if(strAuth && strBook){
        conn.query('select book.title,book.isbn,book.edition,author.auth_id,author.Fname_auth,author.Lname_auth from written_by natural join book natural join author where title like"%'+strBook+'%" and (author.Fname_auth like"%'+strAuth+'%" or author.Lname_auth like"%'+strAuth+'%")',function(err, results, fields) {
            if (err) throw err;
            console.log(results);
            results.forEach(e =>{
                e['auth_link'] = '/author/' + e['auth_id']
                e['book_link'] = '/book/'+e['isbn']+'/'+e['edition']
            })
            res.render('search',{
                title:'List',
                Data: results,
            })
        });
    }
    else if(strBook){
        //select book.title,author.Fname_auth,author.Lname_auth from written_by natural join book natural join author where title like '%ABC%';
        conn.query('select book.title,book.isbn,book.edition,author.auth_id,author.Fname_auth,author.Lname_auth from written_by natural join book natural join author where title like"%'+strBook+'%"',function(err, results, fields) {
            if (err) throw err;
            results.forEach(e =>{
                e['auth_link'] = '/author/' + e['auth_id']
                e['book_link'] = '/book/'+e['isbn']+'/'+e['edition']
            })
            console.log(results);
            res.render('search',{
                title:'List',
                Data: results,
            })
        });
    }
    else if(strAuth){
        conn.query('select book.title,book.isbn,book.edition,author.auth_id,author.Fname_auth,author.Lname_auth from written_by natural join book natural join author where author.Fname_auth like"%'+strAuth+'%" or author.Lname_auth like"%'+strAuth+'%"',function(err, results, fields) {
            if (err) throw err;
            
            results.forEach(e =>{
                e['auth_link'] = '/author/' + e['auth_id']
                e['book_link'] = '/book/'+e['isbn']+'/'+e['edition']
            })
            console.log(results);
            res.render('search',{
                title:'List',
                Data: results,
            })
        });
    }
});

router.get('/review/:type/:id', authController.isLoggedIn, (req, res) => {
    console.log("Hi "+ req.user.username +"! add review for " + req.params.type + "with id" + req.params.id);
    res.render('addreview')
})
router.get('/rating/:type/:id', authController.isLoggedIn, (req, res) => {
    console.log("Hi " + req.user.username + "!add rating for " + req.params.type + " with id " + req.params.id);
    res.render('addrating')
})

module.exports = router;