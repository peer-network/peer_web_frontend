let responsecodes = [];
fetch("./json/response-codes.json")
  .then((response) => response.json())
  .then((daten) => {
    responsecodes = daten;
  });
