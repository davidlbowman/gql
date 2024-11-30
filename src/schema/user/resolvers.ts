import { randomUUIDv7 } from "bun";
import type { Resolvers, User } from "../../types/generated";

let users: User[] = [];

export const resolvers: Resolvers = {
	Query: {
		users: () => users,
		user: (_, { id }) => {
			const user = users.find((user) => user.id === id);
			if (!user) throw new Error(`User with id ${id} not found`);
			return user;
		},
	},
	Mutation: {
		createUser: (_, { name }) => {
			const user = {
				id: randomUUIDv7(),
				name,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			users.push(user);
			return user;
		},
		updateUser: (_, { id, name }) => {
			const user = users.find((user) => user.id === id);
			if (!user) throw new Error(`User with id ${id} not found`);
			user.name = name;
			user.updatedAt = new Date();
			return user;
		},
		deleteUser: (_, { id }) => {
			const user = users.find((user) => user.id === id);
			if (!user) throw new Error(`User with id ${id} not found`);
			users = users.filter((user) => user.id !== id);
			return user;
		},
	},
};
