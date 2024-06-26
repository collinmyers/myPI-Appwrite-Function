import { Expo } from "expo-server-sdk";
import { database } from "./appwriteConfig.js";
import { Query } from "appwrite";

async function getTokens() {

    const PAGE_SIZE = 25;

    let allTokens = [];

    let offset = 0;
    let response;
    try {
        do {
            response = await database.listDocuments(
                '<your-info-here>', // Database ID
                '<your-info-here>', // User Notification Tokens Collection ID
                [Query.limit(PAGE_SIZE), Query.offset(offset)]
            );

            allTokens = [...allTokens, ...response.documents];
            offset += PAGE_SIZE;
        } while (response.documents.length > 0);
        return allTokens.map(document => document['ExpoPushToken']);
    } catch (error) {
        return error;
    }
}

// Function to send push notification using Expo's API
async function sendPushNotification(expoPushTokens, notifTitle, notifBody) {
    try {

        // Create a new Expo SDK client
        let expo = new Expo();

        // Create the messages array
        let messages = [];
        for (let token of expoPushTokens) {
            // Check if each token is a valid push token
            if (!Expo.isExpoPushToken(token)) {
                console.error(`Push token ${token} is not a valid Expo push token`);
                continue;
            }

            // Create the message to send
            messages.push({
                to: token,
                sound: "default",
                title: notifTitle,
                body: notifBody,
            });
        }

        // Send the notifications
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
            for (let chunk of chunks) {
                try {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    tickets.push(...ticketChunk);
                } catch (error) {
                    console.error(error);
                }
            }
        })();
        return;
    } catch (error) {
        return error;
    }
}

// Main function entry point
export default async function main({ req, res, log, error }) {
    const title = req.headers.title;
    const body = req.headers.body;

    try {
        const expoPushTokens = await getTokens();
        await sendPushNotification(expoPushTokens, title, body);
        return res.json({ success: true });
    } catch (err) {
        error('Error sending push notification:', err);
        return res.send({ success: false });
    }
}