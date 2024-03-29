import { Client, Databases, Query } from "node-appwrite";


const client = new Client();

client
  .setEndpoint("https://mypi.bd.psu.edu/v1")
  .setProject("653a90dd1993aebe707f")
  .setKey("b1ed4f82ba15e2e718fd41c03e7a3c686785b28edc0ba2e96a867d7272192cdd97c4d5c839012e03f860e6dbab9c21a46211730c95871440b2dfd85aa548aec21d5b24e390ebcff12eef05fcaab7ac2c395aa57b55432565185c846c8319ac3798e7c864a9a951721229b7537dfdd434fe5983cc6b5be718eaefd965440936ee")
  ;
const database = new Databases(client);



async function getAliases() {

  const PAGE_SIZE = 25;

  let offset = 0;
  let allAliases = [];
  let finalAllAliases = [];

  let response;
  do {
    response = await database.listDocuments(
      '653ae4b2740b9f0a5139',
      '65f9d24372191350e360',
      [Query.limit(PAGE_SIZE), Query.offset(offset)]
    );

    allAliases = [...allAliases, ...response.documents];
    offset += PAGE_SIZE;
  } while (response.documents.length > 0);

  let iterator = 0;

  allAliases.forEach(document => {
    finalAllAliases[iterator] = document['UserName'];
    iterator++;
  });

  return finalAllAliases;
}

async function deletePOIs(Aliases) {


  const PAGE_SIZE = 25;

  let offset = 0;

  let PoiIDs = [];

  let allFoodPOIs = [];


  let response
  do {
    response = await database.listDocuments(
      '653ae4b2740b9f0a5139',
      '65565099921adc2d835b',
      [Query.limit(PAGE_SIZE), Query.offset(offset), Query.contains("Name", Aliases)]
    );

    allFoodPOIs = [...allFoodPOIs, ...response.documents];

    offset += PAGE_SIZE;

  } while (response.documents.length > 0);

  let iterator = 0;

  allFoodPOIs.forEach(document => {
    PoiIDs[iterator] = document['$id'];
    iterator++;
  });




  for (let i = 0; i < PoiIDs.length; ++i) {
    try {
      response = await database.deleteDocument(
        '653ae4b2740b9f0a5139',
        '65565099921adc2d835b',
        (PoiIDs[i])
      );
    } catch (error) {
      console.error(error);
    }
  }

}


// Main function entry point
export default async function main({ req, res }) {


  const allAliases = await getAliases();

  try {
    const response = deletePOIs(allAliases);
    return res.json({ success: true });
  } catch (error) {
    console.error('Error Deleting POIs:', error);
    return res.send({ success: false });
  }
}
