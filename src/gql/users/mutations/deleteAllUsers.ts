import type { GraphQLClient } from "graphql-request";

const DELETE_ALL_USERS = `
    mutation DeleteAllUsers {
        deleteAllUsers
    }
`;

interface DeleteAllUsersInterface {
	client: GraphQLClient;
}

export default async function deleteAllUsers({
	client,
}: DeleteAllUsersInterface) {
	try {
		if (!client) {
			throw new Error("GraphQL client is required");
		}

		const { deleteAllUsers } = await client.request<{
			deleteAllUsers: boolean;
		}>(DELETE_ALL_USERS);

		if (deleteAllUsers === null) {
			throw new Error("Users deletion failed");
		}

		return deleteAllUsers;
	} catch (error) {
		console.error(`Error deleting all users: ${error}`);
	}
}
