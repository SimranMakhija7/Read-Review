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

