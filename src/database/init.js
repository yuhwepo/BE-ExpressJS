// const connection = require("./connection");
const connection = require("./knex-connection");

// const createTableUsers = `
//     CREATE TABLE IF NOT EXISTS users (
//         id INT PRIMARY KEY AUTO_INCREMENT,
// 		username VARCHAR(50) UNIQUE,
// 		password VARCHAR(255),
// 		salt VARCHAR(255),
//         fullname VARCHAR(255) NOT NULL,
//         gender BOOLEAN,
// 		email VARCHAR(255),
//         age INT unsigned
// )
// `;

await connection.schema
	.createTableIfNotExists("users", (table) => {
		table.increments("id").primary();
		table.string("username", 50).unique();
		table.string("password", 255);
		table.string("salt", 255);
		table.string("fullname", 255).notNullable();
		table.boolean("gender");
		table.string("email", 255);
		table.interger("age").unsigned();
	})
	.then(() => {
		console.log("Table created successfully!");
	})
	.catch((err) => {
		console.error("Error creating table:", err);
	});

// connection.query(createTableUsers, (err, results) => {
// 	if (err) {
// 		console.error("Error creating table:", err);
// 		return;
// 	}
// 	console.log("Table created successfully!");
// });

// const insertData = `
//     INSERT INTO users (username, password, salt, fullname, gender, email, age) VALUES
//     (?,?,?,?,?,?,?),
//     (?,?,?,?,?,?,?)
// `;

// const values = [
// 	"nvmh2309",
// 	"123456",
// 	"Nguyen Van Minh Huy",
// 	true,
// 	20,
// 	"yuhwepo",
// 	"abcdef",
// 	"Nguyen Thi Phi",
// 	false,
// 	18,
// ];

// connection.query(insertData, values, (err, result) => {
// 	if (err) {
// 		console.error("Error inserting data:", err);
// 		return;
// 	} else {
// 		console.log("Data inserted successfully!");
// 	}
// });

// connection.end();
