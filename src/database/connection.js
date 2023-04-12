require("dotenv").config();
const my_sql = require("mysql");

const con = my_sql.createPool({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	// port: process.env.PORT,
	database: process.env.DATABASE,
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
