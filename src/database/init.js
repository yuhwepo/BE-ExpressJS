const connection = require("./knex-connection");

// async function createUsersTable() {
// 	try {
// 		const tableExists = await connection.schema.hasTable("users");
// 		if (!tableExists) {
// 			await connection.schema.createTable("users", (table) => {
// 				table.increments("id").primary();
// 				table.string("username", 50).unique();
// 				table.string("password", 255);
// 				table.string("salt", 255);
// 				table.string("fullname", 255).notNullable();
// 				table.boolean("gender");
// 				table.string("email", 255);
// 				table.integer("age").unsigned();
// 				table.string("passwordResetToken", 255);
// 				table.dateTime("passwordResetAt");
// 				table.timestamp("createdAt").defaultTo(connection.fn.now());
// 				table.integer("createdBy").unsigned();
// 				table.foreign("createdBy").references("id").inTable("users");
// 				table.boolean("isAdmin").defaultTo(false);
// 			});

// 			console.log("Table created successfully!");
// 		} else {
// 			console.log("Table already exists!");
// 		}
// 	} catch (error) {
// 		console.error("Error creating table:", error);
// 	}
// }

// async function createPollsTable() {
// 	try {
// 		const tableExists = await connection.schema.hasTable("polls");
// 		if (!tableExists) {
// 			await connection.schema.createTable("polls", (table) => {
// 				table.increments("id").primary();
// 				table.string("name", 255).notNullable();
// 				table.string("question", 255).notNullable();
// 				table.integer("createdBy").unsigned().nullable();
// 				table
// 					.foreign("createdBy")
// 					.references("users.id")
// 					.onDelete("SET NULL");
// 				table.timestamp("createdAt").defaultTo(connection.fn.now());
// 			});

// 			console.log("Table created successfully!");
// 		} else {
// 			console.log("Table already exists!");
// 		}
// 	} catch (error) {
// 		console.error("Error creating table:", error);
// 	} finally {
// 		await connection.destroy();
// 	}
// }

// async function createOptionsTable() {
// 	try {
// 		const tableExists = await connection.schema.hasTable("options");
// 		if (!tableExists) {
// 			await connection.schema.createTable("options", (table) => {
// 				table.increments("id").primary();
// 				table.string("title", 255).notNullable();
// 				table.integer("pollId").notNullable();
// 				table
// 					.foreign("pollId")
// 					.references("polls.id")
// 					.onDelete("CASCADE");
// 			});

// 			console.log("Table created successfully!");
// 		} else {
// 			console.log("Table already exists!");
// 		}
// 	} catch (error) {
// 		console.error("Error creating table:", error);
// 	} finally {
// 		await connection.destroy();
// 	}
// }

// async function createUsersOptionsTable() {
// 	try {
// 		const tableExists = await connection.schema.hasTable("users_options");
// 		if (!tableExists) {
// 			await connection.schema.createTable("users_options", (table) => {
// 				table.increments("id").primary();
// 				table.integer("user_id").unsigned().nullable();
// 				table.integer("option_id").unsigned().nullable();
// 				table.integer("pollId").nullable();
// 				table
// 					.foreign("option_id")
// 					.references("options.id")
// 					.onDelete("CASCADE");
// 				table
// 					.foreign("user_id")
// 					.references("users.id")
// 					.onDelete("CASCADE");
// 				table
// 					.foreign("pollId")
// 					.references("polls.id")
// 					.onDelete("CASCADE");
// 			});

// 			console.log("Table created successfully!");
// 		} else {
// 			console.log("Table already exists!");
// 		}
// 	} catch (error) {
// 		console.error("Error creating table:", error);
// 	} finally {
// 		await connection.destroy();
// 	}
// }

// createUsersTable();
// createPollsTable();
// createOptionsTable();
// createUsersOptionsTable();
async function createTables() {
	try {
		const tableExistsUsers = await connection.schema.hasTable("users");
		const tableExistsPolls = await connection.schema.hasTable("polls");
		const tableExistsOptions = await connection.schema.hasTable("options");
		const tableExistsUsersOptions = await connection.schema.hasTable(
			"users_options"
		);
		const tableExistsRole = await connection.schema.hasTable("role");
		const tableExistsUserRole = await connection.schema.hasTable(
			"user_role"
		);
		const tableExistsPermission = await connection.schema.hasTable(
			"permission"
		);
		const tableExistsRolePermission = await connection.schema.hasTable(
			"role_permission"
		);

		if (!tableExistsUsers) {
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
				table
					.foreign("createdBy")
					.references("users.id")
					.onDelete("CASCADE");
			});

			console.log('Table "users" created successfully!');
		} else {
			console.log('Table "users" already exists!');
		}

		if (!tableExistsPolls) {
			await connection.schema.createTable("polls", (table) => {
				table.increments("id").primary();
				table.string("name", 255).notNullable();
				table.string("question", 255).notNullable();
				table.integer("createdBy").unsigned().nullable();
				table
					.foreign("createdBy")
					.references("users.id")
					.onDelete("SET NULL");
				table.timestamp("createdAt").defaultTo(connection.fn.now());
			});

			console.log('Table "polls" created successfully!');
		} else {
			console.log('Table "polls" already exists!');
		}

		if (!tableExistsOptions) {
			await connection.schema.createTable("options", (table) => {
				table.increments("id").primary();
				table.string("title", 255).notNullable();
				table.integer("pollId").unsigned().notNullable();
				table
					.foreign("pollId")
					.references("id")
					.inTable("polls")
					.onDelete("CASCADE");
			});

			console.log('Table "options" created successfully!');
		} else {
			console.log('Table "options" already exists!');
		}

		if (!tableExistsUsersOptions) {
			await connection.schema.createTable("users_options", (table) => {
				table.increments("id").primary();
				table.integer("user_id").unsigned().nullable();
				table.integer("option_id").unsigned().nullable();
				table.integer("pollId").unsigned().nullable();
				table
					.foreign("option_id")
					.references("id")
					.inTable("options")
					.onDelete("CASCADE");
				table
					.foreign("user_id")
					.references("id")
					.inTable("users")
					.onDelete("CASCADE");
				table
					.foreign("pollId")
					.references("id")
					.inTable("polls")
					.onDelete("CASCADE");
			});

			console.log('Table "users_options" created successfully!');
		} else {
			console.log('Table "users_options" already exists!');
		}

		if (!tableExistsRole) {
			await connection.schema.createTable("role", (table) => {
				table.increments("id").primary();
				table.string("name", 50).notNullable();
			});
			console.log('Table "role" created successfully!');
		} else {
			console.log('Table "role" already exists!');
		}

		if (!tableExistsUserRole) {
			await connection.schema.createTable("user_role", (table) => {
				table.integer("userID").unsigned().notNullable();
				table.integer("roleID").unsigned().notNullable();
				table
					.foreign("userID")
					.references("users.id")
					.onDelete("CASCADE");
				table
					.foreign("roleID")
					.references("role.id")
					.onDelete("CASCADE");
			});
			console.log('Table "user_role" created successfully!');
		} else {
			console.log('Table "user_role" already exists!');
		}

		if (!tableExistsPermission) {
			await connection.schema.createTable("permission", (table) => {
				table.increments("id").primary();
				table.string("type", 255).notNullable();
			});
			console.log('Table "permission" created successfully!');
		} else {
			console.log('Table "permission" already exists!');
		}

		if (!tableExistsRolePermission) {
			await connection.schema.createTable("role_permission", (table) => {
				table.integer("roleID").unsigned().notNullable();
				table.integer("permissionID").unsigned().notNullable();
				table
					.foreign("roleID")
					.references("role.id")
					.onDelete("CASCADE");
				table
					.foreign("permissionID")
					.references("permission.id")
					.onDelete("CASCADE");
			});
			console.log('Table "role_permission" created successfully!');
		} else {
			console.log('Table "role_permission" already exists!');
		}
	} catch (error) {
		console.error("Error creating tables:", error);
	} finally {
		await connection.destroy();
	}
}

createTables();
