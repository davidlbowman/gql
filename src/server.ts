import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./schema/user/resolvers";

const typeDefs = readFileSync(
	join(__dirname, "./schema/user/user.graphql"),
	"utf8",
);

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const port = 4000;

await startStandaloneServer(server, {
	listen: { port },
});

console.log(`🚀  Server ready at: http://localhost:${port}/graphql`);
