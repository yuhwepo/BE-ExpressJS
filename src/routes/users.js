const express = require("express");
// const db = require("../database/connection");
const db = require("../database/knex-connection");
const {
	validateUser,
	validateRegisterRequest,
} = require("../middlewares/validate");
const {
	getOne,
	getMany,
	executeQuery,
	updateOne,
	create,
	deleteOne,
} = require("../database/query");
const {
	verifyToken,
	verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const { hashwithRandomSalt, comparePassword } = require("../middlewares/hash");
const { canAccessBy } = require("../middlewares/verifyRole");
const Permission = require("../config/allowPermission");

const userRouter = express.Router();

// Get user by params or all user with pagination
userRouter.get("/", verifyToken, async (req, res) => {
	const nameQuery = req.query.name;
	const page_size = parseInt(req.query.page_size) || 10;
	let page_index = parseInt(req.query.page_index) || 1;

	if (page_index < 1) page_index = 1;

	let queryBuilder = db("users").select("id", "fullname", "gender", "age");

	if (nameQuery) {
		queryBuilder = queryBuilder.where(function () {
			this.where("username", "like", `%${nameQuery}%`)
				.orWhere("email", "like", `%${nameQuery}%`)
				.orWhere("fullname", "like", `%${nameQuery}%`);
		});
	}

	try {
		const totalResult = await queryBuilder
			.clone()
			.count("* as count")
			.groupBy("id", "fullname", "gender", "age")
			.first();
		const count = totalResult.count;

		const rows = await queryBuilder
			.offset((page_index - 1) * page_size)
			.limit(page_size);

		const pagination = {
			total: count,
			per_page: page_size,
			current_page: page_index,
			last_page: Math.ceil(count / page_size),
			from: rows.length > 0 ? (page_index - 1) * page_size + 1 : null,
			to: (page_index - 1) * page_size + rows.length,
			data: rows,
		};

		res.status(200).json({ pagination });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Get user by id
userRouter.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
	const userId = parseInt(req.params.id, 10);

	try {
		const user = await db("users")
			.select("id", "fullname", "gender", "age")
			.where("id", userId)
			.first();

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({ message: user });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

// Create new user by Admin
userRouter.post(
	"/createUser",
	[
		validateUser,
		validateRegisterRequest,
		verifyTokenAndAuthorization,
		canAccessBy(Permission.CreateUser),
	],
	async (req, res) => {
		const { username, email, password, confirmPassword, fullname, age } =
			req.body;
		const gender = Boolean(req.body.gender);

		const existedUsername = await db("users")
			.select()
			.where("username", username)
			.first();
		if (existedUsername) {
			return res.status(200).json({ message: "Username already existed" });
		}

		const { hashedPassword, salt } = await hashwithRandomSalt(password);
		const createdBy = req.user.id;
		try {
			await db("users").insert({
				username,
				email,
				password: hashedPassword,
				fullname,
				gender,
				age,
				salt,
				createdBy,
			});
			return res.status(201).json({ message: "Created new user" });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ message: "Internal Server Error" });
		}
	}
);

// Update user by id
userRouter.patch(
	"/:id",
	[verifyTokenAndAuthorization, canAccessBy(Permission.UpdateUser)],
	async (req, res) => {
		const userId = parseInt(req.params.id, 10);
		const { fullname, age } = req.body;
		const gender = Boolean(req.body.gender);
		await db("users")
			.where("id", userId)
			.update({ fullname, age, gender }, ["id", "fullname", "age", "gender"]);

		return res.status(200).json({ message: "User updated" });
	}
);

// Delete user
userRouter.delete(
	"/:id",
	[verifyTokenAndAuthorization, canAccessBy(Permission.DeleteUser)],
	async (req, res) => {
		const userId = parseInt(req.params.id, 10);

		try {
			const user = await db("users").where("id", userId).del();

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.status(204).json({ message: "User deleted" });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ message: "Internal Server Error" });
		}
	}
);

userRouter.post("/:id/roles", async (req, res) => {
	const userId = parseInt(req.params.id, 10);
	const { roleId } = req.body;

	try {
		const user = await db("users").where("id", userId).first();
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const role = await db("role").where("id", roleId).first();

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		const existingUserRole = await db("user_role")
			.where("userID", userId)
			.where("roleID", roleId)
			.first();

		if (existingUserRole) {
			return res.status(409).json({ message: "User already has this role" });
		}

		await db("user_role").insert({
			userID: userId,
			roleID: roleId,
		});

		return res.status(200).json({ message: "Role assigned successfully" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = userRouter;
