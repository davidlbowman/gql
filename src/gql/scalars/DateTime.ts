import { GraphQLScalarType, Kind } from "graphql";

export const DateTime = new GraphQLScalarType({
	name: "DateTime",
	description: "A date and time, represented as an ISO-8601 string",

	serialize: (value) => {
		if (value instanceof Date) {
			return value.toISOString();
		}
		if (typeof value === "string") {
			return new Date(value).toISOString();
		}
		throw new Error("DateTime must be a Date object or ISO string");
	},

	parseValue: (value) => {
		if (typeof value === "string") {
			return new Date(value);
		}
		throw new Error("DateTime must be an ISO string");
	},

	parseLiteral: (ast) => {
		if (ast.kind === Kind.STRING) {
			return new Date(ast.value);
		}
		throw new Error("DateTime must be a string");
	},
});
