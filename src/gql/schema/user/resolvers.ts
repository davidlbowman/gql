import { randomUUIDv7 } from "bun";
import { db } from "../../../sqlite/database";
import type { Resolvers, User } from "../../types/generated";

export const resolvers: Resolvers = {
	Query: {
		users: () => {
			return db.query("SELECT * FROM users").all() as User[];
		},
		user: (_, { id }) => {
			return db
				.query("SELECT * FROM users WHERE id = $id")
				.get({ $id: id }) as User;
		},
	},
	Mutation: {
		createUser: (_, { name }) => {
			const id = randomUUIDv7();

			return db
				.query(`
					INSERT INTO users (id, name) 
					VALUES ($id, $name) 
					RETURNING id, name
				`)
				.get({
					$id: id,
					$name: name,
				}) as User;
		},
		updateUser: (_, { id, name }) => {
			const user = db
				.query("SELECT * FROM users WHERE id = $id")
				.get({ $id: id }) as User;

			if (!user) throw new Error(`User with id ${id} not found`);

			user.name = name;

			db.query(`
				UPDATE users SET name = $name WHERE id = $id
			`).run({
				$name: name,
				$id: id,
			});

			return user;
		},
		deleteUser: (_, { id }) => {
			const user = db
				.query("SELECT * FROM users WHERE id = $id")
				.get({ $id: id }) as User;

			if (!user) throw new Error(`User with id ${id} not found`);

			db.query("DELETE FROM users WHERE id = $id").run({ $id: id });

			return user;
		},
		deleteAllUsers: () => {
			db.query("DELETE FROM users").run();
			return true;
		},
	},
};
