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
            console.log(results);
            res.status(200).redirect("/user/" + username);
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
            console.log(results);
            if(results.length == 0){
                res.status(401).render('login',{
                    message: 'Incorrect email or password'
                })
            }
            else if(results.length != 0){
                if(!(await bcrypt.compare(password,results[0].password))){
                    res.status(401).render('login',{
                        message: 'Incorrect email or password'
                    })  
                }
            }
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
            
                res.status(200).redirect("/user/" + username);

            
            
            
        })
    }catch(error){
        console.log(error);
    }
}




exports.register = (req,res) => {
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
        return hashedPassword = await bcrypt.hash(password, 8);
    }

    if(password !== passwordConfirm){
        return res.render('register',{
            message: 'Passwords do not match'
        })
    }else{
        checkEMail();
        checkUsername();
        hashedpass = registerUser();

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
                console.log(results);
                return res.render('register',{
                    message: 'User registered'
                }) 
            }
        })
    }
}