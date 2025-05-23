// Beispiel für Node.js oder moderne Browser, die fetch unterstützen

// Definiere die Introspektions-Query als Template-String
const introspectionQuery = `
  {
    __schema {
      types {
        name
        fields {
          name
        }
      }
    }
  }
`;

// Funktion, die die Anfrage durchführt
async function fetchGraphQLSchema() {
  try {
    const response = await fetch("https://peernetwork.eu/graphql", {
      // Ersetze diese URL durch deinen GraphQL-Endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    if (!response.ok) {
      throw new Error("Netzwerkantwort war nicht ok");
    }

    const result = await response.json();
    console.log("Schema:", result.data.__schema);
  } catch (error) {
    console.error("Fehler beim Abrufen des Schemas:", error);
  }
}

// Rufe die Funktion auf, um das Schema abzufragen
fetchGraphQLSchema();
