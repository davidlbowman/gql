import { randomUUIDv7 } from "bun";
import { GraphQLScalarType } from "graphql";
import { PubSub as BasePubSub } from "graphql-subscriptions";
import { db } from "../../../sqlite/database";
import type { Resolvers, User } from "../../types/generated";

const EVENTS = {
	USER_CREATED: "USER_CREATED",
	USER_UPDATED: "USER_UPDATED",
	USER_DELETED: "USER_DELETED",
};

type PubSub = BasePubSub & {
	asyncIterator: <T>(
		triggers: (typeof EVENTS)[keyof typeof EVENTS][],
	) => AsyncIterable<T>;
};

const pubsub = new BasePubSub() as PubSub;

const dateTimeScalar = new GraphQLScalarType({
	name: "DateTime",
	description: "DateTime custom scalar type",
	serialize(value) {
		return value instanceof Date ? value.toISOString() : value;
	},
	parseValue(value) {
		if (typeof value !== "string" && typeof value !== "number") {
			throw new Error("DateTime must be a string or number");
		}
		return new Date(value);
	},
	parseLiteral(ast) {
		if (ast.kind === "StringValue" || ast.kind === "IntValue") {
			return new Date(ast.value);
		}
		return null;
	},
});

export const resolvers: Resolvers = {
	DateTime: dateTimeScalar,
	Query: {
		users: () => {
			return db
				.query(
					"SELECT id, name, created_at as createdAt, updated_at as updatedAt FROM users",
				)
				.all() as User[];
		},
		user: (_, { id }) => {
			return db
				.query(
					"SELECT id, name, created_at as createdAt, updated_at as updatedAt FROM users WHERE id = $id",
				)
				.get({ $id: id }) as User;
		},
	},
	Mutation: {
		createUser: (_, { name }) => {
			const id = randomUUIDv7();
			const now = new Date().toISOString();

			const newUser = db
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

			pubsub.publish("EVENTS.USER_CREATED", { userCreated: newUser });

			return newUser;
		},
		updateUser: (_, { id, name }) => {
			const user = db
				.query("SELECT * FROM users WHERE id = $id")
				.get({ $id: id }) as User;

			if (!user) throw new Error(`User with id ${id} not found`);

			const now = new Date().toISOString();

			const updatedUser = db
				.query(`
              UPDATE users 
              SET name = $name, updated_at = $updatedAt 
              WHERE id = $id
              RETURNING id, name, created_at as createdAt, updated_at as updatedAt
            `)
				.get({
					$name: name,
					$id: id,
					$updatedAt: now,
				}) as User;

			pubsub.publish("EVENTS.USER_UPDATED", { userUpdated: updatedUser });

			return updatedUser;
		},
		deleteUser: (_, { id }) => {
			const user = db
				.query("SELECT * FROM users WHERE id = $id")
				.get({ $id: id }) as User;

			if (!user) throw new Error(`User with id ${id} not found`);

			db.query("DELETE FROM users WHERE id = $id").run({ $id: id });

			pubsub.publish("EVENTS.USER_DELETED", { userDeleted: user });

			return user;
		},
		deleteAllUsers: () => {
			db.query("DELETE FROM users").run();
			return true;
		},
	},

	Subscription: {
		userCreated: {
			subscribe: () => pubsub.asyncIterator(["USER_CREATED"]),
		},
		userUpdated: {
			subscribe: () => pubsub.asyncIterator(["USER_UPDATED"]),
		},
		userDeleted: {
			subscribe: () => pubsub.asyncIterator(["USER_DELETED"]),
		},
	},
};
