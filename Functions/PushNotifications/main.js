import { Expo } from "expo-server-sdk";

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
async function main(request, response) {


    const { expoPushTokens, title, body } = request.body;

    try {
        const result = await sendPushNotification(expoPushTokens, title, body);
        response.send({ success: true });
    } catch (error) {
        console.error('Error sending push notification:', error);
        response.send({ success: false });
    }
}

// Export the main function
export default { main };
