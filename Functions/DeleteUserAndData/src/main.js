import { Account, Client, Databases, Query, Users } from "node-appwrite";

const getUserNotificationDocuments = async (databases, userID) => {
  try {
    const result = await databases.listDocuments(
      "<your-info-here>", // Database ID
      "<your-info-here>", // Push Notifications Collections ID
      [Query.equal("UID", [userID])]
    );
    return result;
  } catch (err) {
    return err;
  }
}

const DeleteUserNotificationDocuments = async (databases, userDocuments) => {
  try {
    const deletePromises = userDocuments.documents.map(async doc => {
      await databases.deleteDocument(
        "<your-info-here>", // Database ID
        "<your-info-here>", // Push Notifications Collections ID
        doc.$id
      );
    });
    await Promise.all(deletePromises);
    return deletePromises;
  } catch (err) {
    return err;
  }
}

const deleteLabels = async (users, userID) => {
  try {
    const response = await users.updateLabels(userID, []);
    return response;
  } catch (err) {
    return err;
  }
};

const deleteUser = async (users, userID) => {
  try {
    const result = await users.delete(
      userID
    );
    return result;
  } catch (err) {
    return err;
  }
}

const validateUser = async (JWT, userID) => {
  try {
    const client = new Client();
    client
      .setEndpoint("<your-info-here>") //Appwrite Endpoint
      .setProject("<your-info-here>") // Appwrite Project ID
      .setJWT(JWT)
      ;
    const account = new Account(client);
    const getAccountInfo = await account.get();
    if (getAccountInfo.$id === userID) {
      return true;
    } else {
      return "User ID provided does not match ID in JWT";
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
        .setEndpoint("<your-info-here>") // Appwrite Endpoint
        .setProject("<your-info-here>") // Appwrite Project ID
        .setKey("<your-info-here>") // Serverside API Key
        ;

      const serverDatabases = new Databases(server);
      const serverUsers = new Users(server);

      const userDocuments = await getUserNotificationDocuments(serverDatabases, userID);

      await DeleteUserNotificationDocuments(serverDatabases, userDocuments);

      await deleteLabels(serverUsers, userID);

      await deleteUser(serverUsers, userID);
    }
  } catch (err) {
    error("Error during account deletion:", err);
    return res.json({ success: false });
  }
  return res.json({ success: true });
};