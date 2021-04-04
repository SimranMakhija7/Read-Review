const express = require('express');
const mysql = require('mysql');
const authController = require('../controllers/auth');
const dotenv  = require('dotenv');
dotenv.config({ path:'./.env' });

const jwt = require('jsonwebtoken');

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

router.get('/register-bookshop',(req,res)=>{
    res.render('register-bookshop');
});

router.get('/login',(req,res)=>{
    res.render('login');
});
router.get('/login-bookshop',(req,res)=>{
    res.render('login-bookshop');
});
router.get('/logout',(req,res) =>{
    res.clearCookie('jwt');
    res.redirect('/');
})
router.get('/reader',(req,res)=>{
    res.render('reader-landing');
});
router.get('/bookshop-owner',(req,res)=>{
    res.render('bookshop-landing');
});

router.get('/user',authController.isLoggedIn, (req, res) => {
    // console.log(`Hello ${req.user.username}`)
    var user = req.user.username;
    var sql = 'SELECT * from reader WHERE username = ?'
    conn.query(sql, user, function  (err, results, field) {
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
    //console.log(getUserId);
    var sql = 'SELECT title, author_name, isbn, edition FROM book';
    conn.query(sql,function (error,results,fields){
        if(error){
            console.log('error: '+error);
        }
        // console.log(results)
        results.forEach(e => {
            e['book_link'] = '/book/'+e['isbn']+'/'+e['edition']
        });

        res.render('booklist',{title:'Book List',Data: results});
    })
});



router.get('/bookshops',(req,res)=>{
    var sql = 'SELECT * from bookshop';
    conn.query(sql,function (error,results,fields){
        if(error){
            console.log('error: '+error);
        }
        results.forEach(e => {
            e['shop_link'] = '/bookshops/'+e['email']
        })
        res.render('bookshoplist',{title:'List',Data: results, nearby: false});
    })
});

router.get('/bookshops/:email',(req,res) => {
    var sql = 'SELECT * FROM bookshop WHERE email = ?'
    // console.log(req.params.email);
    conn.query(sql,req.params.email,function(error,results,field){
        if(error)   console.log(error);
        // console.log(results)
        var bookData = results[0];
        conn.query(`select 
        *
        from ( bookshop natural join books_available )  natural join book where bookshop.email = ?`,
        bookData.email,
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

router.get('/book/:isbn/:edition',authController.isLoggedIn, (req, res) => {
    var user = req.user.username;
    var fav = false;
    conn.query(`SELECT * FROM my_list WHERE username=${"'"+user+"'"} AND isbn = ${req.params.isbn} AND edition =  ${req.params.edition}`,(e,r,f)=>{
        if (e) console.log(e);
        else fav = r.length!=0;
        // console.log(fav)
    })
    var sql = `
        SELECT cover_img, 
        title, 
        author_name
        publication_name, date_of_publication, 
        synopsis, book.isbn, book.edition
        FROM book
        WHERE 
        book.isbn = ${req.params.isbn} 
        and book.edition =  ${req.params.edition}
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
                            review_link = '/review/book/' + req.params.isbn.toString() + req.params.edition.toString(),
                            list_link = '/add_to_list/'+ req.params.isbn.toString() + req.params.edition.toString(),
                            remove_link ='/remove_from_list/'+ req.params.isbn.toString() + req.params.edition.toString(),
                            add_review = '/review/'+user+'/book/'+req.params.isbn.toString() + req.params.edition.toString(),
                            add_rating = '/rating/'+user+'/book/'+req.params.isbn.toString() + req.params.edition.toString();
                        sql = `
                        SELECT genre
                        FROM genre
                        WHERE 
                        isbn = ${req.params.isbn} 
                        and edition =  ${req.params.edition}
                        `
                        conn.query(sql, (error, genres, f) => {
                            if(error) console.log(error)
                            // console.log(genres)
                            res.render('book', {
                                cover_img: bookData.cover_img,
                                title: bookData.title,
                                author: bookData.author_name,
                                publication_name: bookData.publication_name,
                                synopsis: bookData.synopsis,
                                genres: genres,
                                rating: rate,
                                reviews: reviews,
                                rating_link: rating_link,
                                review_link: review_link,
                                list_link: list_link,
                                remove_link: remove_link,
                                add_rating: add_rating,
                                add_review: add_review,
                                fav: !fav
                            })
                    })
                })
         
                
        })
        
    })
});


router.post('/search',(req,res)=>{
    var strBook = req.body.booksearch;
    
        
    console.log(strBook);
    if(strBook){
        //select book.title,author.Fname_auth,author.Lname_auth from written_by natural join book natural join author where title like '%ABC%';
        conn.query('select title,isbn,edition,author_name from  book  where title like"%'+strBook+'%"',function(err, results, fields) {
            if (err) throw err;
            results.forEach(e =>{
                e['book_link'] = '/book/'+e['isbn']+'/'+e['edition']
            })
            console.log(results);
            res.render('search',{
                str:strBook,
                Data: results,
            })
        });
    }
    
});

router.get('/review/:type/:id', authController.isLoggedIn, (req, res) => {
    // console.log("Hi "+ req.user.username +"! add review for " + req.params.type + "with id" + req.params.id);
    res.render('addreview', {
        post_url: "/review/"+req.user.username+"/"+req.params.type+"/"+req.params.id
    })
})

router.get('/rating/:type/:id', authController.isLoggedIn, (req, res) => {
    // console.log("Hi " + req.user.username + "!add rating for " + req.params.type + " with id " + req.params.id);
    res.render('addrating', {
        post_url: "/rating/"+req.user.username+"/"+req.params.type+"/"+req.params.id
    })
})

router.post('/rating/:user/:type/:id', (req, res) => {
    if (req.params.type === "book") {
        var id = req.params.id,
            edition = id[id.length-1],
            isbn = id.slice(0,id.length-1);
        // console.log("isbn: " + isbn + " edition:" + edition)
        conn.query('INSERT INTO book_ratings SET ?', {
            username: req.params.user,
            isbn: isbn,
            edition: edition,
            stars: req.body.rating
        },(error,results)=>{
            if(error){
                console.log('error');
                res.render('404')
            }else{
                // console.log(results);
                return res.redirect('/book/'+isbn+'/'+edition)
            }
        })
    }
    
})

router.post('/review/:user/:type/:id', (req, res) => {
    if (req.params.type === "book") {
        var id = req.params.id,
            edition = id[id.length-1],
            isbn = id.slice(0,id.length-1);
        // console.log("isbn: " + isbn + " edition:" + edition)
        conn.query('INSERT INTO book_reviews SET ?', {
            username: req.params.user,
            isbn: isbn,
            edition: edition,
            review: req.body.review
        },(error,results)=>{
            if(error){
                console.log('error');
                res.render('404')
            }else{
                // console.log(results);
                return res.redirect('/book/'+isbn+'/'+edition)
            }
        })
    } 
    
})

router.get('/my_list', authController.isLoggedIn, (req, res) => {
    var user = req.user.username;
    // console.log("Hi " + req.user.username + "!add rating for " + req.params.type + " with id " + req.params.id);
    var sql = `SELECT 
    my_list.username , book.isbn,book.edition,title, author_name 
    FROM my_list NATURAL JOIN book 
    WHERE username=${"'"+user+"'"}`;
    conn.query(sql,function (error,results,fields){
        if(error){
            console.log('error: '+error);
        }
        // console.log(results)
        results.forEach(e => {
            e['book_link'] = '/book/'+e['isbn']+'/'+e['edition']
            e['remove_link'] = '/remove_from_list/'+e['isbn'].toString()+e['edition'].toString()
        });
        res.render('fav_list', {Data: results})
    });
})


router.post('/add_to_list/:id', authController.isLoggedIn, (req,res)=>{
        var id = req.params.id,
            edition = id[id.length-1],
            isbn = id.slice(0,id.length-1);
        // console.log("isbn: " + isbn + " edition:" + edition)
        conn.query('INSERT INTO my_list SET ?', {
            username: req.user.username,
            isbn: isbn,
            edition: edition,
        },(error,results)=>{
            if(error){
                console.log('error');
                res.send(error)
            }else{
                console.log(results);        
                return res.redirect('/book/'+isbn+'/'+edition) 
            }
        })
})

router.post('/remove_from_list/:id', authController.isLoggedIn, (req,res)=>{

    var id = req.params.id,
        edition = id[id.length-1],
        isbn = id.slice(0,id.length-1);
    // console.log("isbn: " + isbn + " edition:" + edition)
    conn.query(`DELETE FROM my_list 
    WHERE username = ${"'"+req.user.username+"'"}
    AND isbn = ${isbn}
    AND edition =${edition}
    `,(error,results)=>{
        if(error){
            console.log('error');
            res.send(error)
        }else{
            console.log(results);        
            return res.redirect('/book/'+isbn+'/'+edition) 
        }
    })
})
router.post('/shops-near-me', authController.isLoggedIn, (req,res)=>{
    var user = req.user.username;
    var sql = `
    SELECT bookshop.email, shopname, ownername, bookshop.street, bookshop.city, bookshop.state
    from bookshop, reader 
    where reader.username= ${"'"+user+"'"}
     AND reader.city=bookshop.city;`
    conn.query(sql,(error,results)=>{
        if(error){
            console.log('error');
            res.render('404')
        }else{
            console.log(results);        
            return res.render('bookshoplist',{Data:results, nearby:true}) 
        }
    })
})

router.get('/bookshopowner/:email', (req, res) => {
    // console.log(`Hello ${req.user.username}`)
    var sql = 'SELECT * from bookshop WHERE email = ?'
    conn.query(sql, req.params.email, function  (err, results, field) {
        if (err) console.log("error: " + err)
        // console.log(results[0])
        var userData = results[0];
        var sql = `SELECT B.title, B.isbn, BA.quantity
                FROM book B 
                INNER JOIN books_available BA ON B.isbn=BA.isbn AND B.edition=BA.edition
                INNER JOIN bookshop BS ON BA.email = BS.email
                WHERE BS.email = ?;`
        conn.query(sql, req.params.email, function (err, results, field){

            if (err) console.log("error: " + err)
            var bookData = results;
            console.log(userData.street + userData.ownername);
            res.render('bookshopowner', {
                email: userData.email,
                shopname: userData.shopname,
                ownername: userData.ownername,
                location: userData.street + ", " + userData.city+", " + userData.state,
                books: bookData,
                edit_link: '/bookshopowner/'+userData.email+'/edit-profile',
                add_link : '/bookshopowner/'+userData.email+'/add'
            })
        })
        
    } )
    
});

router.get('/bookshopowner/:email/edit-profile',(req,res)=>{
    var sql = 'SELECT * from bookshop WHERE email = ?'
    conn.query(sql, req.params.email, function (err, results, field) {
        if (err) console.log("error: " + err)
        console.log("Inside Pages" + results[0])
        var userData = results[0];
        console.log("Inside Pages" + userData.email)
        res.render('edit_profile-bookshop', {
            shopname: userData.shopname,
            email: userData.email,
            ownername: userData.ownername,
            street: userData.street,
            city: userData.city,
            state: userData.state,         
        })
    } )
})

router.get('/bookshopowner/:email/add',(req,res)=>{
    res.render('bookshop-add-book',{
        email:req.params.email,
        post_link : '/addbook'
    });
});

router.post('/addbook', (req,res)=>{

        const isbn = req.body.isbn;
        const edition = req.body.edition;
        const title = req.body.title;
        const auth_name = req.body.auth_name;
        const publication_name = req.body.publication_name;
        const cover_img = req.body.cover_img;
        const pages = req.body.pages;
        const synopsis = req.body.synopsis;
        var date_of_publication = req.body.date_of_publication;
        const email = req.body.email;
        var quantity = req.body.quantity;

        date_of_publication = date_of_publication.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        console.log(date_of_publication);
        quantity = Number(quantity);
        
        //TODO 

        conn.query('SELECT * from book WHERE isbn = ? AND edition = ?',[isbn,edition],async(error,results) => {
            if(error)   console.log(error);
            //console.log("BANANA REsult" + results);

            //If book is not available add book into existing table
            if(results.length != 0){
                conn.query('INSERT INTO books_available (isbn,edition,email,quantity) VALUES (?,?,?,?)',[isbn,edition,email,quantity],async(error,results) => {
                    if(error)   console.log(error);
                    console.log(results);
                    res.status(200).redirect("/bookshopowner/" + email);
                })
            }else{
                conn.query('INSERT INTO book (isbn,edition,title,author_name,publication_name,cover_img,pages,synopsis,date_of_publication) VALUES (?,?,?,?,?,?,?,?,?)',[isbn,edition,title,auth_name,publication_name,cover_img,pages,synopsis,date_of_publication],async(error,results) => {
                    if(error)   console.log(error);
                    console.log(results);
                })
                conn.query('INSERT INTO books_available (isbn,edition,email,quantity) VALUES (?,?,?,?)',[isbn,edition,email,quantity],async(error,results) => {
                    if(error)   console.log(error);
                    console.log(results);
                    res.status(200).redirect("/bookshopowner/" + email);
                })
            }
            
        })
})



module.exports = router;