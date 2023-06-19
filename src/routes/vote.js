const express = require("express");
const db = require("../database/knex-connection");
const voteRouter = express.Router();
const {
	verifyToken,
	verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const { verify } = require("jsonwebtoken");

// Create poll
voteRouter.post("/polls", verifyToken, (req, res) => {
	const { name, question, options } = req.body;
	const createdBy = req.user.id;

	db.transaction((trx) => {
		trx.insert({ name, question, createdBy })
			.into("polls")
			.then(([pollId]) => {
				const optionsData = options.map((option) => ({
					title: option,
					pollId,
				}));
				return trx.insert(optionsData).into("options");
			})
			.then(() => {
				return res
					.status(200)
					.json({ message: "Poll created successfully" });
			})
			.then(trx.commit)
			.catch(trx.rollback);
	});
});

// Vote
voteRouter.post("/polls/vote/:pollId", verifyToken, async (req, res) => {
	try {
		const { option_id } = req.body;
		const user_id = req.user.id;
		const pollId = req.params.pollId;

		const optionExists = await db("options")
			.where({ id: option_id, pollId })
			.count("id as count")
			.first();
		if (optionExists.count === 0) {
			return res.status(404).json({ error: "Option does not exist" });
		}

		const userExists = await db("users")
			.where({ id: user_id })
			.count("id as count")
			.first();
		if (userExists.count === 0) {
			return res.status(404).json({ error: "User does not exist" });
		}

		const userVoted = await db("users_options")
			.where({ user_id, pollId })
			.count("user_id as count")
			.first();
		const hasVoted = userVoted.count > 0;

		if (hasVoted) {
			await db.transaction(async (trx) => {
				await trx("users_options").where({ user_id, pollId }).delete();
			});

			return res.status(200).json({ message: "Unvote successful" });
		}

		const newVote = {
			user_id,
			option_id,
			pollId,
		};

		await db.transaction(async (trx) => {
			await trx("users_options").insert(newVote);
		});

		return res.status(200).json({ message: "Vote submitted successfully" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Create option
voteRouter.post("/polls/:pollId/options", verifyToken, async (req, res) => {
	const { pollId } = req.params;
	const { title } = req.body;

	try {
		// Kiểm tra xem poll có tồn tại hay không
		const pollExists = await db("polls").where({ id: pollId }).first();
		if (!pollExists) {
			return res.status(404).json({ error: "Poll not found" });
		}

		// Thêm option vào bảng "option"
		const [optionId] = await db("options").insert({ title, pollId });

		res.status(200).json({ optionId });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

//  Update option
voteRouter.put(
	"/polls/:pollId/options/:optionId",
	verifyToken,
	async (req, res) => {
		const { pollId, optionId } = req.params;
		const { title } = req.body;

		try {
			// Kiểm tra xem option có tồn tại trong poll hay không
			const optionExists = await db("options")
				.where({ id: optionId, pollId })
				.first();

			if (!optionExists) {
				return res.status(404).json({ error: "Option not found" });
			}

			// Cập nhật title của option
			await db("options")
				.where({ id: optionId, pollId })
				.update({ title });

			res.status(200).json({ message: "Option updated successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
);

// Delete option
voteRouter.delete(
	"/polls/:pollId/options/:optionId",
	verifyToken,
	async (req, res) => {
		const { pollId, optionId } = req.params;

		try {
			// Kiểm tra xem option có tồn tại trong poll hay không
			const optionExists = await db("options")
				.where({ id: optionId, pollId })
				.first();

			if (!optionExists) {
				return res.status(404).json({ error: "Option not found" });
			}

			// Xóa option từ bảng "option"
			await db("options").where({ id: optionId, pollId }).del();

			// Xóa các bản ghi trong bảng "users_options" liên quan đến option đã bị xóa
			await db("users_options")
				.where({ option_id: optionId, pollId })
				.del();

			res.status(200).json({ message: "Option deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
);

// Poll Detail
voteRouter.get("/polls/:pollId/results", verifyToken, async (req, res) => {
	try {
		const { pollId } = req.params;

		const [poll, options, voteCounts] = await Promise.all([
			db("polls").where("id", pollId).first(),
			db("options").where("pollId", pollId),
			db("users_options")
				.join("options", "options.id", "=", "users_options.option_id")
				.where("options.pollId", pollId)
				.groupBy("options.id")
				.select("options.id as option_id")
				.count("users_options.id as count"),
		]);

		const optionCounts = voteCounts.reduce((acc, { option_id, count }) => {
			acc[option_id] = count;
			return acc;
		}, {});

		const results = {
			poll,
			options: options.map((option) => ({
				...option,
				count: optionCounts[option.id] || 0,
			})),
		};

		return res.status(200).json(results);
	} catch (error) {
		console.error(error);
		return res.status(500).send("Error while retrieving poll results");
	}
});

// Delete poll
voteRouter.delete("/polls/:pollId", verifyToken, (req, res) => {
	const { pollId } = req.params;

	db.transaction((trx) => {
		trx("users_options")
			.where("pollId", pollId)
			.del()
			.then(() => {
				return trx("polls").where("id", pollId).del();
			})
			.then(() => {
				return res.status(204).send("Poll deleted successfully");
			})
			.then(trx.commit)
			.catch(trx.rollback);
	});
});

module.exports = voteRouter;
