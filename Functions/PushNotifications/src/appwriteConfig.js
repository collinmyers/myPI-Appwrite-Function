// Imports needed to function
import { Client, Databases, Storage } from "appwrite";


// Create a client to connect
const client = new Client()
    .setEndpoint("https://mypi.bd.psu.edu/v1")
    .setProject('653a90dd1993aebe707f');


export const database = new Databases(client); // Named export use {databases} when importing
export const storage = new Storage(client); // Named export use {storage} when importing


export default client; // default export use the word client when exporting