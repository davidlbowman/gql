import { randomUUIDv7 } from "bun";
import type { Resolvers } from "../../types/generated";

let users: { id: string; name: string }[] = [];

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
			const user = { id: randomUUIDv7(), name };
			users.push(user);
			return user;
		},
		updateUser: (_, { id, name }) => {
			const user = users.find((user) => user.id === id);
			if (!user) throw new Error(`User with id ${id} not found`);
			user.name = name;
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
