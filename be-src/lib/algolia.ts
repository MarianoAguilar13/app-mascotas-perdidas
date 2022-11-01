import algoliasearch from "algoliasearch";
import "dotenv/config";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

// exporto el index, que es el indice al que estoy apuntado en la
//app de algolia
const index = client.initIndex("pets");

export { index };
