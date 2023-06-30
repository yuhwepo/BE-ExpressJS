const express = require("express");
require("dotenv").config();

const app = express();
const port = 3000;

const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const voteRouter = require("./routes/vote");
const roleRouter = require("./routes/role");
const permissionsRouter = require("./routes/permission");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/vote", voteRouter);
app.use("/roles", roleRouter);
app.use("/permissions", permissionsRouter);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
