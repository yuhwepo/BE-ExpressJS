const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
	const authorizationHeader = req.headers.authorization;

	if (authorizationHeader) {
		const token = authorizationHeader.split(" ")[1];
		jsonwebtoken.verify(token, secret, (err, user) => {
			if (err) {
				return res.status(403).json("Token is invalid");
			} else {
				req.user = user;
				next();
			}
		});
	} else {
		return res.status(401).json("You are not authorized to access this");
	}
};

module.exports = { verifyToken };
