import { Client, Users, Account } from 'node-appwrite';

const updateUser = async (name, email, labels, userID, serverUsers) => {

  try {
    await serverUsers.updateName(userID, name);
    await serverUsers.updateEmail(userID, email);
    await serverUsers.updateLabels(userID, labels);
  } catch (err) {
    return err;
  }


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
  const callingUserID = req.headers["x-appwrite-user-id"];

  const name = req.headers.name;
  const email = req.headers.email;
  const labels = req.headers.labels;
  const targetUserID = req.headers.targetuserid;

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
          .setEndpoint("https://mypi.bd.psu.edu/v1") // Your API Endpoint
          .setProject("653a90dd1993aebe707f") // Your project ID
          .setKey("dfec38a5697f030cb29b326929e98113ec72cac460b91bbbf5ad66d74d73bdc3f3bd47c7de04c11c7464b55af3254f9b8f7f5add0d7bcded703a93a8395c623709051320e6d3e8d09d2137d00868833e7408bb1778339088a812f80390ecfd3389e0ea291178a307f50763961f59664314eaeca5c268e840dee7cb7c2a0dc5c3") // Your secret API key
          ;
        const serverUsers = new Users(server);
        const user = await updateUser(name, email, labels, targetUserID, serverUsers);
        log(user);

      }


    } catch (err) {
      error("Error Updating User", err);
      return res.json({ success: false });
    }

    return res.json({ success: true });
  }


};
