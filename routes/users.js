const express = require("express");
const userRouter = express.Router();

const validateUser = require("../src/middlewares/validate.js");

let users = [
	{
		id: 1,
		fullname: "Nguyen Van Minh Huy",
		gender: true,
		age: 20,
	},
	{
		id: 2,
		fullname: "Nguyen Thi Phi",
		gender: false,
		age: 18,
	},
];

let counter = users.length;

userRouter.get("/", (req, res) => {
	return res.json(users);
});

userRouter.get("/:id", (req, res) => {
	const userId = req.params.id;
	const user = users.find((user) => user.id === parseInt(userId));

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	return res.json(user);
});

userRouter.put("/:id", (req, res) => {
	const userId = req.params.id;
	const updatedUser = req.body;

	users = users.map((user) => {
		if (user.id === parseInt(userId)) {
			return { ...user, ...updatedUser };
		}
		return user;
	});
	return res.status(204).json({ message: "User updated", updatedUser });
});

userRouter.post("/", validateUser, (req, res) => {
	counter++;
	const newUser = req.body;

	users.push({ id: counter, ...newUser });
	return res.status(201).json({ message: "User created", newUser });
});

userRouter.delete("/:id", (req, res) => {
	const userId = req.params.id;

	users = users.filter((user) => user.id !== parseInt(userId));
	return res.status(204).json({ message: "User deleted" });
});

module.exports = userRouter;
