import { Expo } from "expo-server-sdk";
import { database } from "./appwriteConfig.js";
import { Query } from "appwrite";

async function getTokens() {

    const PAGE_SIZE = 25;

    let allTokens = [];
    let finalAllTokens = [];

    let offset = 0;
    let response;
    do {
        response = await database.listDocuments(
            '653ae4b2740b9f0a5139',
            '65d651f3af4d612b0b75',
            [Query.limit(PAGE_SIZE), Query.offset(offset)]
        );

        allTokens = [...allTokens, ...response.documents];
        offset += PAGE_SIZE;
    } while (response.documents.length > 0);

    let iterator = 0;

    allTokens.forEach(document => {
        finalAllTokens[iterator] = document['ExpoPushToken'];
        iterator++;
    });


    return finalAllTokens;
}

// Function to send push notification using Expo's API
async function sendPushNotification(expoPushTokens, notifTitle, notifBody) {

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
}

// Main function entry point
export default async function main({ req, res }) {


    const title = req.headers.title;
    const body = req.headers.body;
    const expoPushTokens = await getTokens();

    try {
        const result = await sendPushNotification(expoPushTokens, title, body);
        return res.json({ success: true });
    } catch (error) {
        console.error('Error sending push notification:', error);
        return res.send({ success: false });
    }
}
