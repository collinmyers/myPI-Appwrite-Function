import { Client, Users } from "node-appwrite";

const client = new Client();

client
  .setEndpoint("https://mypi.bd.psu.edu/v1") // Your API Endpoint
  .setProject("653a90dd1993aebe707f") // Your project ID
  .setKey("b1259e652349c7f220aed6aa75b3f1f157c2aa58b224488525757ce3e7496791d69b77b80ce9903db94ddb7fcc75eff978fe8ef5f884cc2c60c33df62f9dafb7ce2c9d5b6095dcddeb42fff0e8455a6f077e7993f3fabb324e899b9221e238fcd5f51ef9dad5320202d129b44ea5eb145d4cd53db2ed3721f9f4a0cd990960e4") // Your secret API key
  ;

const getEmailUsers = async () => {
  const users = new Users(client);
  const response = await users.list();
  const usersList = response.users;
  const authenticatedUsers = usersList.filter(user => user.email !== "");
  return authenticatedUsers;
}
const filterUserInfo = async (authenticatedUsers) => {
  return authenticatedUsers.map(({ $id, name, email }) => ({ $id, name, email }));
}

export default async function main({ req, res }) {
  const authenticatedUsers = await getEmailUsers();
  const filteredUsersList = await filterUserInfo(authenticatedUsers);

  if (req.method === "GET") {
    return res.json({ filteredUsersList });
  }
}