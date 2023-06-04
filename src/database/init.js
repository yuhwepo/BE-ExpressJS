const connection = require("./knex-connection");

async function createUsersTable() {
	try {
		const tableExists = await connection.schema.hasTable("users");
		if (!tableExists) {
			await connection.schema.createTable("users", (table) => {
				table.increments("id").primary();
				table.string("username", 50).unique();
				table.string("password", 255);
				table.string("salt", 255);
				table.string("fullname", 255).notNullable();
				table.boolean("gender");
				table.string("email", 255);
				table.integer("age").unsigned();
				table.string("passwordResetToken", 255);
				table.dateTime("passwordResetAt");
				table.timestamp("createdAt").defaultTo(connection.fn.now());
				table.integer("createdBy").unsigned();
				table.foreign("createdBy").references("id").inTable("users");
				table.boolean("isAdmin").defaultTo(false);
			});

			console.log("Table created successfully!");
		} else {
			console.log("Table already exists!");
		}
	} catch (error) {
		console.error("Error creating table:", error);
	}
}

createUsersTable();
