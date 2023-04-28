const crypto = require("crypto");

function hashwithRandomSalt(rawPassword) {
	const salt = crypto.randomBytes(16).toString("hex");
	const hashedPassword = crypto
		.pbkdf2Sync(rawPassword, salt, 10000, 64, "sha512")
		.toString("hex");
	return { hashedPassword, salt };
}

function comparePassword({ hashedPassword, salt, rawPassword }) {
	const hashedRawPassword = crypto
		.pbkdf2Sync(rawPassword, salt, 10000, 64, "sha512")
		.toString("hex");

	return hashedPassword === hashedRawPassword;
}

module.exports = {
	hashwithRandomSalt,
	comparePassword,
};
