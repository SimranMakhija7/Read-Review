const mysql = require('mysql');

var config =
{
	host: 'dbms-project.mysql.database.azure.com',
	user: 'dbms_admin@dbms-project',
	password: 'Database123',
	database: 'readnreview',
	port: 3306,
	ssl: true
};

const conn = new mysql.createConnection(config);

conn.connect(
	function (err) { 
	if (err) { 
		console.log("!!! Cannot connect !!! Error:");
		throw err;
	}
	else
	{
	   console.log("Connection established.");
           
	}	
});

//Read DATA
function readData(){
	conn.query('SELECT * FROM reader', 
		function (err, results, fields) {
			if (err) throw err;
			else console.log('Selected ' + results.length + ' row(s).');
			for (i = 0; i < results.length; i++) {
				console.log('Row: ' + JSON.stringify(results[i]));
			}
			console.log('Done.');
		})
   conn.end(
	   function (err) { 
			if (err) throw err;
			else  console.log('Closing connection.') 
	});
};