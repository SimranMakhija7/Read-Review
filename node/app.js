const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv  = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path:'./.env' });
const app = express();

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

const publicDirectory = path.join(__dirname,'./public')
app.use(express.static(publicDirectory));

//Parese url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

app.set('view engine','hbs');

conn.connect(
	function (err) { 
	if (err) { 
		console.log("!!! Cannot connect !!! Error:");
		console.log(error);
		throw err;
	}
	else
	{
	   console.log("MYSQL Connection established.");
           
	}	
});

//Define routes
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(5000,()=>{
	console.log("Server started on port 5000");
})





// //Read DATA
// function readData(){
// 	conn.query('SELECT * FROM reader', 
// 		function (err, results, fields) {
// 			if (err) throw err;
// 			else console.log('Selected ' + results.length + ' row(s).');
// 			for (i = 0; i < results.length; i++) {
// 				console.log('Row: ' + JSON.stringify(results[i]));
// 			}
// 			console.log('Done.');
// 		})
//    conn.end(
// 	   function (err) { 
// 			if (err) throw err;
// 			else  console.log('Closing connection.') 
// 	});
// };