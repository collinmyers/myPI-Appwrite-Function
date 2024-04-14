import { Account, Client, Databases, Query, Users } from "node-appwrite";

const getUserNotificationDocuments = async (databases, targetUser) => {
  try {
    const result = await databases.listDocuments(
      "653ae4b2740b9f0a5139", // Database ID
      "65d651f3af4d612b0b75", // Push Notifications Collections ID
      [Query.equal("UID", [targetUser])]
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
        "653ae4b2740b9f0a5139", // Database ID
        "65d651f3af4d612b0b75", // Push Notifications Collections ID
        doc.$id
      );
    });
    await Promise.all(deletePromises);
    return deletePromises;
  } catch (err) {
    return err;
  }
}

const deleteLabels = async (users, targetUser) => {
  try {
    const response = await users.updateLabels(targetUser, []);
    return response;
  } catch (err) {
    return err;
  }
};

const deleteUser = async (users, targetUser) => {
  try {
    const result = await users.delete(
      targetUser
    );
    return result;
  } catch (err) {
    return err;
  }
}

const validateUser = async (JWT, targetUser) => {
  try {
    const client = new Client();
    client
      .setEndpoint("https://mypi.bd.psu.edu/v1") //Appwrite Endpoint
      .setProject("653a90dd1993aebe707f") // Appwrite Project ID
      .setJWT(JWT)
      ;
    const account = new Account(client);
    const getAccountInfo = await account.get();
    if (getAccountInfo.$id === targetUser && getAccountInfo.labels.includes("ManageUsers")) {
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
  const targetUser = req.headers["target-user"];

  try {
    const isUser = await validateUser(JWT, userID);

    if (isUser !== true) {
      error("Error:");
      error(isUser);
      return res.send("Not Authorized", 403);
    } else {
      const server = new Client();
      server
        .setEndpoint("https://mypi.bd.psu.edu/v1") // Appwrite Endpoint
        .setProject("653a90dd1993aebe707f") // Appwrite Project ID
        .setKey("bc4b4d88ab4f9ce020a6be2dee0106daec1a528e98eeac08b67a30057dc51d57e49bd6410181a73a48cde931f89308cc023fef151a22e7e1fdafbee958d10c7b5561c69fd3cac780933eb7f6582a4e20661fbc8c305d6398df1beeac7bbdc2c06d546717b5e248f91a2116de3ce12e3f317531b0e7693159a4288ef142bce19e") // Serverside API Key
        ;

      const serverDatabases = new Databases(server);
      const serverUsers = new Users(server);

      const userDocuments = await getUserNotificationDocuments(serverDatabases, targetUser);

      await DeleteUserNotificationDocuments(serverDatabases, userDocuments);

      await deleteLabels(serverUsers, targetUser);

      await deleteUser(serverUsers, targetUser);
    }
  } catch (err) {
    error("Error during account deletion:", err);
    return res.json({ success: false });
  }
  return res.json({ success: true });
};