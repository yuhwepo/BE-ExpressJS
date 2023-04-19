require("dotenv").config();
const my_sql = require("mysql");

const con = my_sql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	// port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
});

con.getConnection((err, connection) => {
	if (err) {
		console.error("Error connecting to database: ", err);
		return;
	}
	console.log("Connected to MySQL database!");
	connection.release();
});

module.exports = con;
