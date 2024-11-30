import { GraphQLClient } from "graphql-request";
import getUsers from "./src/gql/users/queries/getUsers";

const client = new GraphQLClient("http://localhost:4000/graphql");

getUsers({ client }).then(console.log);
