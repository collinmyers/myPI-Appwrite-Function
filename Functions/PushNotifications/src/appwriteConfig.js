// Imports needed to function
import { Client, Databases, Storage } from "appwrite";

// Create a client to connect
const client = new Client()
    .setEndpoint("<your-info-here>")
    .setProject('<your-info-here>');


export const database = new Databases(client); // Named export use {databases} when importing
export const storage = new Storage(client); // Named export use {storage} when importing

export default client; // default export use the word client when exporting