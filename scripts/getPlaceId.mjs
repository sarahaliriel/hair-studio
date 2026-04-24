const apiKey = process.env.GOOGLE_MAPS_API_KEY;

if (!apiKey) {
  console.log("Falta GOOGLE_MAPS_API_KEY");
  process.exit(1);
}

const textQuery = "Ideias e Tranças, R. Silva Carvalho 54B, 1250-255 Lisboa";

const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.googleMapsUri",
  },
  body: JSON.stringify({
    textQuery,
    maxResultCount: 5,
    languageCode: "pt-PT",
  }),
});

const data = await res.json();

for (const p of data.places || []) {
  console.log("ID:", p.id);
  console.log("Nome:", p.displayName?.text);
  console.log("Morada:", p.formattedAddress);
  console.log("Maps:", p.googleMapsUri);
  console.log("------");
}