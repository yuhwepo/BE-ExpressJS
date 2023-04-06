const express = require("express");
const app = express();
const port = 3000;

const users = require("./routes/users");

app.use(express.json());

app.get("/users", (req, res) => {
	res.json(users.getUsers());
});

app.get("/users/:id", (req, res) => {
	const userId = req.params.id;
	const user = users.getUserById(userId);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	res.json(user);
});

app.put("/users/:id", (req, res) => {
	const userId = req.params.id;
	const updatedUser = req.body;
	users.updateUser(userId, updatedUser);
	res.status(204).json({ message: "User updated", updatedUser });
});

app.post("/users", (req, res) => {
	const newUser = req.body;
	users.addUser(newUser);
	res.status(201).json(newUser);
});

app.delete("/users/:id", (req, res) => {
	const userId = req.params.id;
	users.deleteUser(userId);
	res.status(204).json({ message: "User deleted" });
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
