import { Client, Query, Users } from "node-appwrite";

const getEmailUsers = async (server) => {
  const PAGE_SIZE = 100;
  let offset = 0;
  const users = new Users(server);

  let usersList = [];
  const response = await users.list([Query.limit(PAGE_SIZE), Query.offset(offset)]);
  const numberOfUsers = response.total;
  const firstSetOfUsers = response.users;

  usersList = usersList.concat(firstSetOfUsers);

  let usersSoFar = response.users.length;
  offset += usersSoFar;

  while (usersSoFar < numberOfUsers) {
    const loopResponse = await users.list([Query.limit(PAGE_SIZE), Query.offset(offset)]);
    const currentSetOfUsers = loopResponse.users;
    usersList = usersList.concat(currentSetOfUsers);
    offset += loopResponse.users.length;
    usersSoFar += loopResponse.users.length;
  }
  return usersList;
}

export default async function main({ req, res, log, error }) {
  try {
    const server = new Client();
    server
      .setEndpoint("<your-info-here>") // Your API Endpoint
      .setProject("<your-info-here>") // Your project ID
      .setKey("<your-info-here>") // Your secret API key
      ;

    const allUsers = await getEmailUsers(server);

    if (req.method === "GET") {
      return res.json({ allUsers });
    }

  } catch (error) {
    error(error)
    error("Error during account retrieval:", error);
    return res.json({ success: false });
  }
}