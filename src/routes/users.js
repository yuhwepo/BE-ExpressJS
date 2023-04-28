const express = require("express");
const db = require("../database/connection");
const { validateUser } = require("../middlewares/validate");
const {
	getOne,
	getMany,
	executeQuery,
	updateOne,
} = require("../database/query");
const { verifyToken } = require("../middlewares/verifyToken");

const userRouter = express.Router();

// Get all user
userRouter.get("/", (req, res) => {
	// const user = "SELECT * FROM users";
	const user =
		"SELECT id, fullname, IF(gender=1, 'true', 'false') AS gender, age FROM users";
	db.query(user, (err, result) => {
		if (err) {
			return err;
		}
		res.json(result);
	});
});

// Get user by id
userRouter.get("/:id", async (req, res) => {
	const userId = parseInt(req.params.id, 10);

	// const user = "SELECT * FROM users WHERE id =?";
	const user =
		"SELECT id, fullname, IF(gender=1, 'true', 'false') AS gender, age FROM users WHERE id =?";
	db.query(user, [userId], (err, result) => {
		if (err) {
			return err;
		}
		if (result.length == 0) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.json(result[0]);
	});
});

// Update user by id
userRouter.patch("/:id", [verifyToken, validateUser], async (req, res) => {
	const userId = parseInt(req.params.id, 10);

	const fullname = req.body.fullname;
	const age = req.body.age;
	const gender = Boolean(req.body.gender);

	if (req.user.id === userId) {
		await updateOne({
			db,
			query: `UPDATE users SET fullname = ?, age = ?, gender = ? WHERE id = ?`,
			params: [fullname, age, gender, userId],
		});
		return res.status(200).json({ message: "User updated" });
	}
	return res
		.status(400)
		.json({ message: "You are not allowed to update this" });

	// const user = "SELECT * FROM users WHERE id = ?";
	// db.query(user, [userId], (err, result) => {
	// 	if (err) {
	// 		return err;
	// 	}
	// 	if (result.length == 0) {
	// 		return res.status(404).json({ message: "User not found" });
	// 	}
	// 	const userUpdated =
	// 		"UPDATE users SET fullname = ?, age = ?, gender = ? WHERE id = ?";
	// 	db.query(
	// 		userUpdated,
	// 		[fullname, age, gender, userId],
	// 		(err, result) => {
	// 			if (err) {
	// 				return res
	// 					.status(400)
	// 					.json({ message: "Error updating user" });
	// 			}
	// 			return res
	// 				.status(200)
	// 				.json({ message: "User updated", result });
	// 		}
	// 	);
	// });
});

// Create a new user
userRouter.post("/", validateUser, (req, res) => {
	const fullname = req.body.fullname;
	const age = req.body.age;
	const gender = Boolean(req.body.gender);

	if (fullname !== undefined && age !== undefined && gender !== undefined) {
		const insertUser =
			"INSERT INTO users(fullname, age, gender) VALUES (?, ?, ?)";
		db.query(insertUser, [fullname, age, gender], (err, result) => {
			if (err) {
				return res
					.status(400)
					.json({ message: "Error inserting user" });
			}
			return res.status(201).json({ message: "User created", result });
		});
	}
});

// Delete user
userRouter.delete("/:id", (req, res) => {
	const userId = parseInt(req.params.id, 10);

	const user = "DELETE FROM users WHERE id = ?";

	db.query(user, [userId], (err, result) => {
		if (err) {
			return err;
		}
		return res.status(204).json({ message: "User deleted", result });
	});
});

module.exports = userRouter;
