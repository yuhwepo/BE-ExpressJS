function validateUser(req, res, next) {
	const user = req.body;
	const regex =
		/^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/gm;

	switch (true) {
		case !user.fullname:
			res.status(400).send("Phai nhap ten cua ban");
			break;
		case !regex.test(user.fullname):
			res.status(400).send("Truong nay chi chua chu");
			break;
		case user.age == null || user.age == undefined:
			res.status(400).send("Phai nhap tuoi cua ban");
			break;
		case user.age <= 0:
			res.status(400).send("Tuoi phai lon hon 0");
			break;
		default:
			next();
			break;
	}
}

module.exports = validateUser;
