function validateUser(req, res, next) {
	const user = req.body;
	const regexFullName =
		/^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/gm;
	const regexUsername = /^[a-zA-Z0-9_]{5,20}$/;
	const regexEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

	switch (true) {
		case !user.fullname:
			res.status(400).send("Phai nhap ten cua ban");
			break;
		case !regexFullName.test(user.fullname):
			res.status(400).send("Truong fullname chi chua chu");
			break;
		case !user.username:
			res.status(400).send("Phải nhập tên đăng nhập của bạn");
			break;
		case !regexUsername.test(user.username):
			res.status(400).send("Trường username chỉ chứa chữ");
			break;
		case !user.email:
			res.status(400).send("Phải nhập email của bạn");
			break;
		case !regexEmail.test(user.email):
			res.status(400).send("Email không hợp lệ");
			break;
		case user.age == null || user.age == undefined:
			res.status(400).send("Phai nhap tuoi cua ban");
			break;
		case user.age <= 0:
			res.status(400).send("Tuoi phai lon hon 0");
			break;
		default:
			next();
	}
}

function validateRegisterRequest(req, res, next) {
	const user = req.body;

	const regexEmail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;

	switch (true) {
		case !user.username:
			res.status(400).send("Vui long nhap username!");
			break;
		case user.confirmPassword !== user.password:
			res.status(400).send(
				"Password khong trung khop. Vui long nhap lai!"
			);
			break;
		case !regexEmail.test(user.email):
			res.status(400).send("Truong nay phai la email");
			break;
		case !user.email:
			res.status(400).send("Vui long nhap email cua ban!");
			break;
		default:
			next();
	}
}

module.exports = {
	validateUser,
	validateRegisterRequest,
};
