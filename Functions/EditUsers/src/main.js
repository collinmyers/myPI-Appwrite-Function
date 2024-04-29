import { Client, Users, Account } from 'node-appwrite';

const updateUser = async (name, email, labels, userID, serverUsers) => {

  try {
    const accountInfo = await serverUsers.get(userID);


    if (accountInfo.name != name) {
      await serverUsers.updateName(userID, name);

    }

    if (accountInfo.email != email) {
      await serverUsers.updateEmail(userID, email);

    }

    await serverUsers.updateLabels(userID, labels);


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
  const callingUserID = req.headers["x-appwrite-user-id"];

  const body = JSON.parse(req.body);

  const name = req.headers.name;
  const email = req.headers.email;
  const labels = body.labels;
  const targetUserID = req.headers.targetuserid;

  log(labels)

  if (req.method === 'PATCH') {

    try {
      const isUser = await validateUser(JWT, callingUserID);

      if (isUser !== true) {
        error("Error:");
        error(isUser);
        return res.send("Not Authorized", 403);
      } else {
        const server = new Client();
        server
          .setEndpoint("<your-info-here>") // Your API Endpoint
          .setProject("<your-info-here>") // Your project ID
          .setKey("<your-info-here>") // Your secret API key
          ;
        const serverUsers = new Users(server);
        await updateUser(name, email, labels, targetUserID, serverUsers);

      }


    } catch (err) {
      error("Error Updating User", err);
      return res.json({ success: false });
    }

    return res.json({ success: true });
  }


};
