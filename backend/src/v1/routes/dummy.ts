import { Request, Router, Response, NextFunction } from "express";
import { setTodos, todos } from "../../lib/utils";
import jwt from "jsonwebtoken";

export const dummyRoutes = Router();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log("adsjfkls ", req.headers);

		const token = req.headers.authorization?.split(" ")[1];

		console.log(token);
		if (!token) {
			console.log(token);

			res.status(400).json({ msg: "No Token" });
			return;
		}

		try {
			jwt.verify(token, "pass");
		} catch (err) {
			console.log("token not verified");

			// console.log(err);
			return;
		}

		console.log("token verified");

		next();
	} catch (err) {
		// console.log(err);
		res.status(500).json({ msg: "Token not verified" });
	}
};

dummyRoutes.post("/signup/:name", async (req, res) => {
	try {
		const name = req.params.name;

		const token = jwt.sign({ name }, "pass");

		res.json({ token });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

dummyRoutes.post("/", async (req, res) => {
	try {
		const { title, description } = req.body;
		const id = Math.floor(Math.random() * 100 + 5);
		const isDone = false;

		todos.push({ id, title, description, isDone });

		res.status(200).json({ msg: "Todo added" });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

dummyRoutes.get("/", verifyToken, async (req, res) => {
	try {
		res.status(200).json({ todos });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

dummyRoutes.get("/:todoId", async (req, res) => {
	try {
		const { todoId } = req.params;

		res
			.status(200)
			.json({ todo: todos.find((todo) => todo.id === parseInt(todoId)) });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

dummyRoutes.put("/:todoId", async (req, res) => {
	try {
		const { title, description } = req.body;
		const { todoId } = req.params;

		let updatedTodos = [...todos];

		updatedTodos = updatedTodos.map((eachTodo, index) => {
			if (eachTodo.id === parseInt(todoId)) {
				(eachTodo.title = title), (eachTodo.description = description);
			}

			return eachTodo;
		});

		setTodos(updatedTodos);

		res.status(200).json({ msg: "Todo updated", todos });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal Server Error" });
	}
});

dummyRoutes.delete("/:todoId", async (req, res) => {
	try {
		const { todoId } = req.params;

		const updatedTodos = todos.filter((todo) => todo.id !== parseInt(todoId));

		setTodos(updatedTodos);

		res.status(200).json({ msg: "Todo deleted", todos });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal Server Error" });
	}
});
