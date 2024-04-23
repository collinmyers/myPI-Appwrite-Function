import { Account, Client, Query, Users } from "node-appwrite";

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
  const authenticatedUsers = usersList.filter(user => user.email !== "");
  return authenticatedUsers;
}

const filterUserInfo = (authenticatedUsers) => {
  return authenticatedUsers.map(({ $id, name, email, labels }) => ({ $id, name, email, labels }))
}
const validateUser = async (JWT, userID) => {
  try {
    const client = new Client();
    client
      .setEndpoint("https://mypi.bd.psu.edu/v1") //Appwrite Endpoint
      .setProject("653a90dd1993aebe707f") // Appwrite Project ID
      .setJWT(JWT)
      ;
    const account = new Account(client);
    const getAccountInfo = await account.get();
    if (getAccountInfo.$id === userID && getAccountInfo.labels.includes("ManageUsers")) {
      return true;
    } else {
      return "User ID provided does not match ID in JWT or user does not have the correct permissions";
    }
  } catch (err) {
    return err;
  }
}

export default async function main({ req, res, log, error }) {
  const JWT = req.headers["x-appwrite-user-jwt"];
  const userID = req.headers["x-appwrite-user-id"];

  try {
    const isUser = await validateUser(JWT, userID);

    if (isUser !== true) {
      error("Error:");
      error(isUser);
      return res.send("Not Authorized", 403);
    } else {
      const server = new Client();

      server
        .setEndpoint("https://mypi.bd.psu.edu/v1") // Your API Endpoint
        .setProject("653a90dd1993aebe707f") // Your project ID
        .setKey("b1259e652349c7f220aed6aa75b3f1f157c2aa58b224488525757ce3e7496791d69b77b80ce9903db94ddb7fcc75eff978fe8ef5f884cc2c60c33df62f9dafb7ce2c9d5b6095dcddeb42fff0e8455a6f077e7993f3fabb324e899b9221e238fcd5f51ef9dad5320202d129b44ea5eb145d4cd53db2ed3721f9f4a0cd990960e4") // Your secret API key
        ;

      const authenticatedUsers = await getEmailUsers(server);
      const userInfo = filterUserInfo(authenticatedUsers);
      console.log(userInfo.length);

      if (req.method === "GET") {
        return res.json({ userInfo });
      }

    }
  } catch (error) {
    console.error(error)
    error("Error during account retrieval:", err);
    return res.json({ success: false });
  }
}