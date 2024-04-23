import { Client, Databases, Query, Users } from 'node-appwrite';

const getUserStats = async (server) => {
  try {
    const users = new Users(server);
    const response = await users.list();
    const totalUsers = response.total;
    const authResponse = await users.list([Query.notEqual("name", [""]), Query.notEqual("email", [""])]);
    const authenticatedUsers = authResponse.total;
    return [totalUsers, authenticatedUsers];
  } catch (error) {
    return error;
  }
}

const getTotalEvents = async (database) => {
  try {
    const documents = await database.listDocuments(
      "653ae4b2740b9f0a5139", // Database ID
      "655280f07e30eb37c8e8", // Events Collection ID
      [] // queries (optional)
    );
    return documents.total;
  } catch (error) {
    return error;
  }
}

const getTotalPoints = async (database) => {
  try {
    const documents = await database.listDocuments(
      "653ae4b2740b9f0a5139", // Database ID
      "65565099921adc2d835b", // Points of Interest Collection ID
      [] // queries (optional)
    );
    return documents.total;
  } catch (error) {
    return error;
  }
}

const getTotalNotifications = async (database) => {
  try {
    const documents = await database.listDocuments(
      "653ae4b2740b9f0a5139", // Database ID
      "6552848655e88d169d7d", // Notifications Collection ID
      [] // queries (optional)
    );
    return documents.total;
  } catch (error) {
    return error;
  }
}

const updateStats = async (database, totalUsers, registedUsers, totalEvents, totalPoints, totalNotifications) => {
  try {
    return await database.updateDocument(
      "653ae4b2740b9f0a5139", // Database ID
      "6615e856000645282f59", // Dashboard Stats Collection ID
      "6615ea7b00122f0676dc", // Document ID
      {
        "TotalUsers": totalUsers,
        "RegisteredUsers": registedUsers,
        "TotalEvents": totalEvents,
        "TotalPoints": totalPoints,
        "TotalNotifications": totalNotifications
      }, // data (optional)
      [] // permissions (optional)
    );
  } catch (error) {
    return error;
  }
}

export default async function main({ req, res, log, error }) {
  try {
    const server = new Client();

    server
      .setEndpoint("https://mypi.bd.psu.edu/v1") // Your API Endpoint
      .setProject("653a90dd1993aebe707f") // Your project ID
      .setKey("53df142f37437c58a518bf518af6019334a51d384d040b604ee94ecea0c554a83abbf19bb10176fb7e28b7445f74dbc6d003d7e2dec09f4ba4b31926c84b6eaeac4bfb68cb82b4b748817040ca8b8bdb770f3d65368f5a716a5f84fdbd22b635b7c865f3caaff5abe16c71958b2ce0770c0e2596b6f2ae9af647064b89a9729c") // Your secret API key
      ;

    const database = new Databases(server);

    const [totalUsers, registedUsers] = await getUserStats(server);

    const totalEvents = await getTotalEvents(database);

    const totalPoints = await getTotalPoints(database);

    const totalNotifications = await getTotalNotifications(database);

    // pre-condition: a document with attributes of all 0's must be made in appwrite for this to work
    const updateDoc = await updateStats(database, totalUsers, registedUsers, totalEvents, totalPoints, totalNotifications);
    log("Updated Dashboard Stats")
    log(updateDoc);
  } catch (err) {
    error("Error retrieving dashboard stats")
    error(err);
    return res.json({ success: false });
  }
  return res.json({ success: true });
};