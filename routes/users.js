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

module.exports = {
	getUsers: () => {
		return users;
	},
	getUserById: (userId) => {
		return users.find((user) => user.id === parseInt(userId));
	},
	addUser: (user) => {
		counter++;
		users.push({ id: counter, ...user });
	},
	updateUser: (userId, updatedUser) => {
		users = users.map((user) => {
			if (user.id === parseInt(userId)) {
				return { ...user, ...updatedUser };
			}
			return user;
		});
	},
	deleteUser: (userId) => {
		users = users.filter((user) => user.id !== parseInt(userId));
	},
};
