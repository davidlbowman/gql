import { GraphQLClient } from "graphql-request";
import getUser from "./src/gql/users/queries/getUser";
import getUsers from "./src/gql/users/queries/getUsers";
const client = new GraphQLClient("http://localhost:4000/graphql");

getUsers({ client }).then(console.log);
getUser({ client, id: "01937e82-848a-7000-a6fc-77a4ad480df9" }).then(
	console.log,
);
