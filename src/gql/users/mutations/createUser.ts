import type { GraphQLClient } from "graphql-request";
import type { User } from "../../types/generated";

const CREATE_USER = `
mutation CreateUser($name: String!) {
    createUser(name: $name) {
        id
        name
        createdAt
        updatedAt
    }
}
`;

interface CreateUserInterface {
	client: GraphQLClient;
	name: string;
}

export default async function createUser({
	client,
	name,
}: CreateUserInterface) {
	try {
		if (!client) {
			throw new Error("GraphQL client is required");
		}

		if (!name) {
			throw new Error("Name is required");
		}

		const { createUser } = await client.request<{ createUser: User }>(
			CREATE_USER,
			{ name },
		);

		if (!createUser) {
			throw new Error("User creation failed");
		}

		return createUser;
	} catch (error) {
		console.error(`Error creating user: ${error}`);
	}
}
