import { Client, Databases, Query } from "node-appwrite";

const client = new Client();

client
  .setEndpoint("https://mypi.bd.psu.edu/v1") // Your API Endpoint
  .setProject("653a90dd1993aebe707f") // Your project ID
  .setKey("f5b4297a913e131ba4a11344b1047c08d7e7ba02dc91ff0c0ae7828e0c9d4143080e3fd7c60674abf0b78d6bdbb4cd214eaa9e2a6084030080387e9a358d14f8bbb61eda2922792c222d444ba7d458f32b7cc6758a07b2c195d01ee132236262255a02121d7e2ff189041065e0cf652e9c327dae3f8ba5c798ded51177578da1")
  ;
const databases = new Databases(client);

const getUserNotificationDocuments = async (userID) => {
  try {
    const result = await databases.listDocuments(
      "653ae4b2740b9f0a5139", // databaseId
      "65d651f3af4d612b0b75", // collectionId
      [Query.equal("UID", [userID])] // queries (optional)
    );
    return result;
  } catch (err) {
    console.error(err);
  }
}

const DeleteUserNotificationDocuments = async (userDocuments) => {
  try {
    const deletePromises = userDocuments.documents.map(async doc => {
      await databases.deleteDocument(
        "653ae4b2740b9f0a5139", // databaseId
        "65d651f3af4d612b0b75", // collectionId
        doc.$id // documentId
      );
      console.log(`Document ${doc.$id} deleted`);
    });
    await Promise.all(deletePromises);
  } catch (err) {
    console.error(err)
  }
}

export default async function main({ req, res }) {

  const userID = "6548168316c0284db777"

  const userDocuments = await getUserNotificationDocuments(userID);

  const deleteUserDocuments = await DeleteUserNotificationDocuments(userDocuments);
};