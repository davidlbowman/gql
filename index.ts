import { faker } from "@faker-js/faker";
import { GraphQLClient } from "graphql-request";
import createUser from "./src/gql/users/mutations/createUser";
import deleteAllUsers from "./src/gql/users/mutations/deleteAllUsers";
import getUsers from "./src/gql/users/queries/getUsers";

const client = new GraphQLClient("http://localhost:4000/graphql");

async function createNewUser() {
	const name = faker.person.fullName();
	await createUser({ client, name })
		.then((user) => {
			console.log(user);
		})
		.catch(console.error);
}

async function main() {
	// First ensure clean slate
	await deleteAllUsers({ client });

	// Wait a moment to ensure deletion is complete
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Create new users
	const user1 = await createNewUser();
	const user2 = await createNewUser();

	// Wait a moment to ensure creation is complete
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Now try to get users
	try {
		const users = await getUsers({ client });
		console.log("All users:", users);
	} catch (error) {
		console.error("Error fetching users:", error);
	}
}

main().catch(console.error);
