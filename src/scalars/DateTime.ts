import { GraphQLScalarType } from "graphql";

export const DateTime = new GraphQLScalarType({
	name: "DateTime",
	description: "A date and time, represented as an ISO-8601 string",
	serialize: (value) => {
		if (value instanceof Date) {
			return value.toISOString();
		}
		throw new Error("DateTime must be a Date object");
	},
});
