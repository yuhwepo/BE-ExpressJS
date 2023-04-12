const connection = require("./connection");

const createTableUsers = `
    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fullname VARCHAR(255) NOT NULL,
        gender BOOLEAN,
        age INT unsigned
)
`;

connection.query(createTableUsers, (err, results) => {
	if (err) {
		console.error("Error creating table:", err);
		return;
	}
	console.log("Table created successfully!");
});

const insertData = `
    INSERT INTO users (fullname, gender, age) VALUES 
    (?,?,?),
    (?,?,?)
`;

const values = ["Nguyen Van Minh Huy", true, 20, "Nguyen Thi Phi", false, 18];

connection.query(insertData, values, (err, result) => {
	if (err) {
		console.error("Error inserting data:", err);
		return;
	} else {
		console.log("Data inserted successfully!");
	}
});

// connection.end();
