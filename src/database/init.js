// const connection = require("./connection");
const connection = require("./knex-connection");

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
		table.string("passwordResetToken", 255);
		table.dateTime("passwordResetAt");
		table.timestamp("createdAt").defaultTo(connection.fn.now());
		table.integer("createdBy");
		table.boolean("isAdmin").defaultTo(false);
	})
	.then(() => {
		console.log("Table created successfully!");
	})
	.catch((err) => {
		console.error("Error creating table:", err);
	});
