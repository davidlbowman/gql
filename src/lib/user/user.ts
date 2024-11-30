import { gql } from "graphql-request";
import type { GraphQLClient } from "graphql-request";

interface GetUsersInterface {
	client: GraphQLClient;
}

export default async function getUsers({ client }: GetUsersInterface) {
	const query = `
		query Users {
			users {
				id
				name
			}
		}
	`;

	return client.request(query);
}
