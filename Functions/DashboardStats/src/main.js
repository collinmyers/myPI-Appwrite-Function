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
      "<your-info-here>", // Database ID
      "<your-info-here>", // Events Collection ID
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
      "<your-info-here>", // Database ID
      "<your-info-here>", // Points of Interest Collection ID
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
      "<your-info-here>", // Database ID
      "<your-info-here>", // Notifications Collection ID
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
      "<your-info-here>", // Database ID
      "<your-info-here>", // Dashboard Stats Collection ID
      "<your-info-here>", // Document ID
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
      .setEndpoint("<your-info-here>") // Your API Endpoint
      .setProject("<your-info-here>") // Your project ID
      .setKey("<your-info-here>") // Your secret API key
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