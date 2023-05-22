require("dotenv").config();
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");

const db = require("../database/connection");
const { hashwithRandomSalt, comparePassword } = require("../middlewares/hash");
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
const { mailService } = require("../services/mail.service");

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

// authRouter.post("/reset-password", async function (req, res) {
// 	const { email } = req.body;

// 	await mailService.sendEmail({
// 		emailFrom: "yuhwepo@gmail.com",
// 		emailTo: email,
// 		emailSubject: "Reset Password",
// 		emailText: "Text....",
// 	});
// 	return res.status(200).json({ message: "Reset Password" });
// });

authRouter.post("/forgot-password", async (req, res) => {
	try {
		const { email } = req.body;

		const user = await getOne({
			db,
			query: "SELECT * FROM users WHERE email = ?",
			params: [email],
		});

		if (!user) {
			return res.status(404).json({ message: "Email not found" });
		}

		const secretKey = crypto.randomBytes(32).toString("hex");
		const passwordResetToken = crypto
			.createHash("sha256")
			.update(secretKey)
			.digest("hex");

		const passwordResetAt = new Date(Date.now() + 10 * 60 * 1000);
		const updateStatus = await updateOne({
			db,
			query: "UPDATE users SET passwordResetToken = ?, passwordResetAt = ? WHERE email = ?",
			params: [passwordResetToken, passwordResetAt, email],
		});

		if (updateStatus) {
			mailService.sendEmail({
				emailFrom: "admin@gmail.com",
				emailTo: email,
				emailSubject: "Reset Password",
				emailText: `Here is your reset password token: ${passwordResetToken}`,
			});
			return res
				.status(200)
				.json({ message: "Reset Password email sent successfully" });
		}
		return res.status(400).json({ message: "Can not reset password" });
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
});

authRouter.post("/reset-password", async (req, res) => {
	try {
		const { email, passwordResetToken, newPassword } = req.body;

		const user = await getOne({
			db,
			query: "SELECT * FROM users WHERE email = ? AND passwordResetToken = ? AND passwordResetAt = ?",
			params: [email, passwordResetToken, new Date()],
		});

		if (!user) {
			return res
				.status(403)
				.json({ message: "Invalid token or token has expired" });
		}

		const { hashedPassword, salt } = await hashwithRandomSalt(newPassword);

		const updateStatus = await updateOne({
			db,
			query: "UPDATE users SET password = ?, salt = ?, passwordResetToken = null, passwordResetAt = null WHERE email = ?",
			params: [hashedPassword, salt, email],
		});

		if (updateStatus) {
			return res
				.status(200)
				.json({ message: "Reset password successfully" });
		}
		return res.status(401).json({ message: "reset password failed" });
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
});

module.exports = authRouter;
