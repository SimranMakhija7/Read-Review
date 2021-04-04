const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const dotenv  = require('dotenv');

dotenv.config({ path:'./.env' });

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

exports.editprofile = async (req,res) => {
    try{
        const username = req.body.username;
        const Fname = req.body.Fname;
        const Lname = req.body.Lname;
        const profile_img = req.body.profile_img;
        const city = req.body.city;
        const state = req.body.state;
        console.log(username);
        console.log(Fname);
        if(!Fname || !Lname){
            return res.status(400).render('login',{
                message: 'Please provide First and Last Name'
            })
        }
       
        conn.query('UPDATE READER SET Fname = ? , Lname =  ?  , city = ? , state = ? , profile_img = ?  WHERE username = ?',[Fname,Lname,city,state,profile_img,username],async(error,results) => {
            if(error)   console.log(error);
            // console.log(results);
            res.status(200).redirect("/user");
        })
    }catch(error){
        console.log(error);
    }
}

exports.login = async (req,res) => {
    try{
        
        const username = req.body.username;
        const password = req.body.password;
        //console.log(username, password);
        if( !username || !password){
            return res.status(400).render('login',{
                message: 'Please provide email and password'
            })
        }
        
        conn.query('SELECT * from reader WHERE username = ?',[username],async(error,results) => {
            // console.log(results);
            if(results.length == 0){
                res.status(401).render('login',{
                    message: 'Incorrect email or password'
                })
            }
            else if(results.length != 0){
                // console.log(results[0])
                if(!( bcrypt.compareSync(password,results[0].password))){
                    res.status(401).render('login',{
                        message: 'Incorrect email or password'
                    })  
                }else{
            
                const username = results[0].username;
                const token = jwt.sign({username: username},process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("token"+token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt',token,cookieOptions);
            
                res.status(200).redirect("/user");
            }
            }
        })
    }catch(error){
        console.log(error);
    }
}

exports.isLoggedIn = (req, res, next) => {
    // Check if the user has token in cookies. If not return the request;
    if(!req.cookies.jwt) return res.json({ error: 'Please Login' });

    const clientToken = req.cookies.jwt;

    try {
    //  Decode the client token by using same secret key that we used to sign the token
        const decoded = jwt.verify(clientToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.json({error: 'Invalid Token'})
    }

}

exports.register = async (req,res) => {
    // console.log(req.body);

    const Fname = req.body.Fname;
    const Lname = req.body.Lname;
    const username = req.body.username;
    const city = req.body.city;
    const state = req.body.state;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    function checkEMail(){
        conn.query('SELECT email from reader WHERE email = ?',[email],(error,results) => {
            if(results.length > 0){
                return res.render('register',{
                    message: 'email is already taken'
                })
            }
        });
    };
    function checkUsername(){
        conn.query('SELECT username from reader WHERE username = ?',[username],(error,results) => {
            if(results.length > 0){
                return res.render('register',{
                    message: 'username is already taken'
                })
            }
        });
    };

    async function registerUser (){
         hashedPassword = await bcrypt.hashSync(password, 8);
         return hashedPassword;
    }

    if(password !== passwordConfirm){
        return res.render('register',{
            message: 'Passwords do not match'
        })
    }else{
        checkEMail();
        checkUsername();
        var hashedpass = await registerUser();
        
        
        conn.query('INSERT INTO reader SET ?',{
            Fname: Fname,
            Lname: Lname,
            email: email,
            city: city,
            state: state,
            username: username,
            password: hashedpass
        },(error,results)=>{
            if(error){
                console.log('error');
            }else{
                // console.log(results);
                return res.render('register',{
                    message: 'User registered'
                }) 
            }
        })
    }
}

exports.registerbookshop = async (req,res) => {
    // console.log(req.body);
    const shopname = req.body.shopname;
    const ownername = req.body.ownername;
    const street = req.body.street;
    const city = req.body.city;
    const state = req.body.state;
    const email = req.body.email;
    const password = req.body.password;

    function checkEMail(){
        conn.query('SELECT email from bookshop WHERE email = ?',[email],(error,results) => {
            if(results.length > 0){
                return res.render('register-bookshop',{
                    message: 'Email is already taken'
                })
            }
        });
    };
    function checkEmptyString(){
        if(!shopname || !ownername || !street || !city || !state || !email || !password){
            return res.render('register-bookshop',{
                message: 'all fields are mandatory'
            })
        }
    };
    async function registerUser (){
        hashedPassword = await bcrypt.hashSync(password, 8);
        return hashedPassword;
    }

    checkEMail();
    checkEmptyString();
    var hashedpass = await registerUser();
    console.log(hashedpass)
    conn.query('INSERT INTO bookshop SET ?',{
            shopname: shopname,
            ownername: ownername,
            email: email,
            city: city,
            state: state,
            street: street,
            password: hashedpass
    },(error,results)=>{
            if(error){
                console.log('error:'+error);
            }else{
                console.log(results);
                return res.render('register-bookshop',{
                    message: 'Shop registered'
                }) 
            }
    })
    
}

exports.loginbookshop = async (req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        //console.log(username, password);
        if( !email || !password){
            return res.status(400).render('login-bookshop',{
                message: 'Please provide email and password'
            })
        }
        
        conn.query('SELECT * from bookshop WHERE email = ?',[email],async(error,results) => {
            console.log(results);
            if(results.length == 0){
                res.status(401).render('login-bookshop',{
                    message: 'Incorrect email or password'
                })
            }
            else if(results.length != 0){
                if(!(bcrypt.compareSync(password,results[0].password))){
                    res.status(401).render('login-bookshop',{
                        message: 'Incorrect email or password'
                    })  
                }
            }
                const email = results[0].email;
                const token = jwt.sign({email: email},process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("token"+token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt',token,cookieOptions);
            
                res.status(200).redirect("/bookshopowner/" + email);        
            
        })
    }catch(error){
        console.log(error);
    }
}

exports.editprofilebookshop = async (req,res) => {
    try{
        const shopname = req.body.shopname;
        const ownername = req.body.ownername;
        const street = req.body.street;
        const city = req.body.city;
        const state = req.body.state;
        const email = req.body.email;
        console.log(email);
        if(!shopname || !ownername || !city || !street || !state){
            return res.status(400).render('loginbookshop',{
                message: 'Please provide all information'
            })
        }
       
        conn.query('UPDATE BOOKSHOP SET shopname = ? , ownername =  ?  , city = ? , state = ? , street = ?  WHERE email = ?',[shopname,ownername,city,state,street,email],async(error,results) => {
            if(error)   console.log(error);
            console.log(results);
            res.status(200).redirect("/bookshopowner/" + email);
        })
    }catch(error){
        console.log(error);
    }
}



