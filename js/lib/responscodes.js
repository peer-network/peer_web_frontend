fetch("./json/response-codes.json")
  .then((response) => response.json())
  .then((daten) => {
    responsecodes = daten;
    console.log("Response codes loaded successfully." + responsecodes.data);
  });
