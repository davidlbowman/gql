import type { GraphQLClient } from "graphql-request";
import type { User } from "../../types/generated";

const GET_USERS = `
    query Users {
        users {
            id
            name
            createdAt
        }
    }
`;

interface GetUsersInterface {
	client: GraphQLClient;
}

export default async function getUsers({ client }: GetUsersInterface) {
	try {
		if (!client) {
			throw new Error("GraphQL client is required");
		}

		const { users } = await client.request<{ users: User[] }>(GET_USERS);

		if (!users.length) {
			throw new Error("No users found in the response");
		}

		return users;
	} catch (error) {
		console.error(`Error fetching users: ${error}`);
	}
}
