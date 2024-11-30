import { randomUUIDv7 } from "bun";
import { db } from "../../../sqlite/database";
import type { Resolvers, User } from "../../types/generated";

export function getUsers(): User[] {
	return db.query("SELECT * FROM users").all() as User[];
}

export function getUser(id: string): User {
	return db
		.query("SELECT * FROM users WHERE id = $id")
		.get({ $id: id }) as User;
}

export function createUser(name: string): User {
	const id = randomUUIDv7();
	const now = new Date().toISOString();

	return db
		.query(`
            INSERT INTO users (id, name, created_at, updated_at) 
            VALUES ($id, $name, $createdAt, $updatedAt) 
            RETURNING id, name, created_at as createdAt, updated_at as updatedAt
        `)
		.get({
			$id: id,
			$name: name,
			$createdAt: now,
			$updatedAt: now,
		}) as User;
}

export function updateUser(id: string, name: string): User {
	const user = getUser(id);

	if (!user) throw new Error(`User with id ${id} not found`);

	user.name = name;
	user.updatedAt = new Date().toISOString();

	db.query(`
		UPDATE users SET name = $name, updated_at = $updatedAt WHERE id = $id
	`).run({
		$name: name,
		$updatedAt: user.updatedAt,
		$id: id,
	});

	return user;
}

export function deleteUser(id: string): User {
	const user = getUser(id);

	if (!user) throw new Error(`User with id ${id} not found`);

	db.query("DELETE FROM users WHERE id = $id").run({ $id: id });

	return user;
}

export const resolvers: Resolvers = {
	Query: {
		users: () => getUsers(),
		user: (_, { id }) => getUser(id),
	},
	Mutation: {
		createUser: (_, { name }) => createUser(name),
		updateUser: (_, { id, name }) => updateUser(id, name),
		deleteUser: (_, { id }) => deleteUser(id),
	},
};
