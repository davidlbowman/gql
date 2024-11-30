import type { GraphQLClient } from "graphql-request";
import type { User } from "../../types/generated";

const GET_USER = `
    query User($id: ID!) {
        user(id: $id) {
            id
            name
            createdAt
        }
    }
`;

interface GetUserInterface {
	client: GraphQLClient;
	id: string;
}

export default async function getUser({ client, id }: GetUserInterface) {
	try {
		if (!client) {
			throw new Error("GraphQL client is required");
		}

		const { user } = await client.request<{ user: User }>(GET_USER, { id });

		if (!user) {
			throw new Error("No users found in the response");
		}

		return user;
	} catch (error) {
		console.error(`Error fetching user: ${error}`);
	}
}
