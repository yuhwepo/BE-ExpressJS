require("dotenv").config();
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const db = require("../database/connection");
const { hashwithRandomSalt, comparePassword } = require("../middlewares/hash");
const {
	validateUser,
	validateRegisterRequest,
} = require("../middlewares/validate");
const { executeQuery, getOne, create } = require("../database/query");

const secret = process.env.JWT_SECRET;

const authRouter = express.Router();

authRouter.post("/login", async function (req, res, next) {
	// Get username and  password from request body
	const { username, password } = req.body;
	// Find user in database
	const user = await getOne({
		db,
		query: "SELECT * FROM users WHERE username = ?",
		params: username,
	});
	// User does not exist
	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	const isPasswordMatch = comparePassword({
		rawPassword: password,
		hashedPassword: user.password,
		salt: user.salt,
	});
	if (isPasswordMatch) {
		const jwt = jsonwebtoken.sign(
			{
				id: user.id,
				username: user.username,
				fullname: user.fullname,
				gender: user.gender,
				age: user.age,
			},
			secret,
			{
				expiresIn: "1h",
			}
		);
		return res
			.status(200)
			.json({ message: "Login successful", token: jwt });
	}
	return res.status(401).json({ message: "Invalid credentials" });
});

authRouter.post(
	"/register",
	[validateUser, validateRegisterRequest],
	async function (req, res) {
		const {
			username,
			password,
			confirmPassword,
			fullname,
			gender,
			email,
			age,
		} = req.body;

		const { hashedPassword, salt } = await hashwithRandomSalt(password);

		await create({
			db,
			query: `INSERT INTO users (username, password, fullname, gender, email, age, salt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			params: [
				username,
				hashedPassword,
				fullname,
				gender,
				email,
				age,
				salt,
			],
		});
		return res.status(201).json({ message: "User created successfully" });
	}
);

module.exports = authRouter;
