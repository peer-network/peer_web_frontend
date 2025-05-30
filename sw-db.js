let dbConnection = null;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const db = await openOrUpgradeIndexedDB("resources", "files", 1);

        // Essenzielle Dateien abrufen
        const response = await fetch("/cache.php");
        const essentialFiles = await response.json();

        // Dateien abrufen
        const fileData = await Promise.all(
          essentialFiles.map(async (file) => {
            const fileResponse = await fetch(file);
            const blob = await fileResponse.blob();
            return { url: file, content: blob };
          })
        );

        // Dateien in einer einzigen Transaktion speichern
        const transaction = db.transaction("files", "readwrite");
        const store = transaction.objectStore("files");
        fileData.forEach((data) => {
          store.put(data);
        });

        console.log("Alle essenziellen Dateien wurden erfolgreich gespeichert.");
      } catch (error) {
        console.error("Fehler beim Installieren:", error);
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method === "POST") {
    event.respondWith(handlePostRequest(request));
  } else if (isPHPJSorCSS(request.url)) {
    event.respondWith(handleStaleWhileRevalidate(request));
  } else if (isServiceWorker(request.url)) {
    event.respondWith(handleNetworkFirst(request));
  } else {
    event.respondWith(handleCacheFirst(request));
  }
});

async function handleStaleWhileRevalidate(request) {
  const compositeKey = await generateCompositeKey(request);

  // Prüfen, ob die Anfrage im Cache (IndexedDB) vorhanden ist
  const dbEntry = await getFromIndexedDB("resources", "files", compositeKey);

  if (dbEntry) {
    console.log(`Stale-WR: Gecachte Antwort geliefert für ${request.url}`);

    // Im Hintergrund versuchen, die Antwort zu aktualisieren
    fetch(request)
      .then(async (response) => {
        await saveRequestToIndexedDB(request, response);
        console.log(`Stale-WR: Cache aktualisiert für ${request.url}`);
      })
      .catch((error) => {
        console.error(`Stale-WR: Netzwerkaktualisierung fehlgeschlagen für ${request.url}`, error);
      });

    // Gecachte Antwort zurückgeben
    return new Response(dbEntry.content);
  }

  // Kein Cache verfügbar, versuchen, aus dem Netzwerk zu laden
  try {
    const response = await fetch(request);
    await saveRequestToIndexedDB(request, response);
    console.log(`Stale-WR: Netzwerkantwort gespeichert für ${request.url}`);
    return response;
  } catch (error) {
    console.error(`Stale-WR: Netzwerkfehler für ${request.url}:`, error);

    // Kein Cache und kein Netzwerk verfügbar
    return new Response("Netzwerkfehler und keine gecachten Daten verfügbar.", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

async function handlePostRequest(request) {
  const compositeKey = await generateCompositeKey(request);

  try {
    // Request-Body vorher klonen und auslesen
    const body = request.method === "POST" ? await request.clone().text() : "";

    // Anfrage an den Server senden
    const response = await fetch(request);

    // Erfolgreiche Antwort im Cache speichern
    await putToIndexedDB("resources", "files", {
      compositeKey,
      url: request.url,
      method: request.method,
      body, // Den zuvor gelesenen Body verwenden
      content: await response.clone().blob(),
    });

    console.log(`POST-Anfrage aus dem Netzwerk: ${request.url}`);
    return response; // Netzwerkantwort zurückgeben
  } catch (error) {
    console.error(`Netzwerkfehler bei POST-Anfrage: ${error.message}`);

    // Fallback auf IndexedDB, falls das Netzwerk fehlschlägt
    const dbEntry = await getFromIndexedDB("resources", "files", compositeKey);

    if (dbEntry) {
      console.log(`POST-Anfrage aus IndexedDB geliefert: ${compositeKey}`);
      return new Response(dbEntry.content);
    } else {
      // Kein Fallback verfügbar
      return new Response("Netzwerkfehler und keine gecachten Daten verfügbar.", {
        status: 503,
        statusText: "Service Unavailable",
      });
    }
  }
}

async function openIndexedDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Erstelle Object Store für GET- und POST-Anfragen
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "compositeKey" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function getFromIndexedDB(dbName, storeName, key) {
  try {
    const db = await openOrUpgradeIndexedDB(dbName, storeName, 1); // Datenbank öffnen

    if (!db.objectStoreNames.contains(storeName)) {
      throw new Error(`Object Store "${storeName}" existiert nicht in der Datenbank.`);
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly"); // Lesezugriff
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result); // Schlüssel gefunden
        } else {
          resolve(null); // Schlüssel nicht gefunden
        }
      };

      request.onerror = () => {
        console.error("Fehler beim Abrufen des Schlüssels:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error(`Fehler beim Zugriff auf die IndexedDB (getFromIndexedDB): ${error.message}`);
    throw error;
  }
}

async function putToIndexedDB(dbName, storeName, data) {
  const db = await openOrUpgradeIndexedDB(dbName, storeName, 1);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function generateCompositeKey(request) {
  const url = request.url;

  // Nur Body lesen, wenn die Methode POST ist
  let body = "";
  if (request.method === "POST") {
    try {
      body = await request.clone().text(); // Body auslesen
    } catch (error) {
      console.error("Fehler beim Lesen des Request-Bodys:", error);
      body = ""; // Falls der Body nicht lesbar ist
    }
  }

  // Zusammengesetzten Schlüssel erstellen
  return body ? `${url}?body=${body}` : url; // Body nur anhängen, wenn er existiert
}

async function saveRequestToIndexedDB(request, response) {
  const compositeKey = await generateCompositeKey(request);

  try {
    const responseBlob = await response.clone().blob(); // Response korrekt als Blob klonen
    console.log(responseBlob);

    await putToIndexedDB("resources", "files", {
      compositeKey,
      url: request.url,
      method: request.method,
      body: request.method === "POST" ? await request.clone().text() : "",
      content: responseBlob, // Blob speichern
      contentType: response.headers.get("Content-Type"), // MIME-Typ speichern
    });

    console.log(`Datei erfolgreich in IndexedDB gespeichert: ${request.url}`);
  } catch (error) {
    console.error(`Fehler beim Speichern der Datei in IndexedDB: ${error}`);
  }
}

async function handleStaleWhileRevalidate(request) {
  const compositeKey = await generateCompositeKey(request);

  // Prüfen, ob die Anfrage im Cache vorhanden ist
  const dbEntry = await getFromIndexedDB("resources", "files", compositeKey);

  if (dbEntry) {
    // Im Hintergrund aktualisieren
    fetch(request).then(async (response) => {
      await saveRequestToIndexedDB(request, response);
    });
    console.log(`Stale-WR: Gecachte Antwort geliefert für ${request.url}`);
    return new Response(dbEntry.content);
  } else {
    // Fallback auf Netzwerkanfrage und speichern
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Fehler bei der Netzwerkanfrage: ${response.status} ${response.statusText}`);
    }
    await saveRequestToIndexedDB(request, response);
    console.log(`Stale-WR: Netzwerkantwort gespeichert für ${request.url}`);
    return response;
  }
}

async function handleNetworkFirst(request) {
  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Fehler bei der Netzwerkanfrage: ${response.status} ${response.statusText}`);
    }
    await saveRequestToIndexedDB(request, response);
    console.log(`Network-First: Netzwerkantwort geliefert und gespeichert für ${request.url}`);
    return response;
  } catch (error) {
    console.log(`Network-First: Fallback auf Cache für ${request.url}`);
    const compositeKey = await generateCompositeKey(request);
    const dbEntry = await getFromIndexedDB("resources", "files", compositeKey);

    return dbEntry ? new Response(dbEntry.content) : new Response("Offline", { status: 503 });
  }
}

async function handleCacheFirst(request) {
  const compositeKey = await generateCompositeKey(request);

  // Prüfen, ob die Anfrage im Cache vorhanden ist
  const dbEntry = await getFromIndexedDB("resources", "files", compositeKey);

  if (dbEntry) {
    console.log(`Cache-First: Gecachte Antwort geliefert für ${request.url}`);
    return new Response(dbEntry.content);
  } else {
    // Fallback auf Netzwerkanfrage und speichern
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Fehler bei der Netzwerkanfrage: ${response.status} ${response.statusText}`);
    }
    await saveRequestToIndexedDB(request, response);
    console.log(`Cache-First: Netzwerkantwort gespeichert für ${request.url}`);
    return response;
  }
}

async function openOrUpgradeIndexedDB(dbName, storeName, version) {
  if (dbConnection) {
    return dbConnection; // Bereits geöffnete Verbindung zurückgeben
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Object Store erstellen, falls er nicht existiert
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "compositeKey" });
        console.log(`ObjectStore "${storeName}" wurde erstellt.`);
      }
    };

    request.onsuccess = (event) => {
      dbConnection = event.target.result; // Verbindung speichern
      resolve(dbConnection);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function isPHPJSorCSS(url) {
  // Prüfen, ob die URL mit .php, .js oder .css endet
  return /\.(php|js|css)$/i.test(url);
}
function isServiceWorker(url) {
  // Prüfen, ob die URL den Service Worker enthält
  return url.includes("/sw-db.js") || url.includes(GraphGL);
}
async function fetchAndCacheIfNotExists(request) {
  const compositeKey = await generateCompositeKey(request);

  try {
    // Datenbankzugriff
    const dbEntry = await getFromIndexedDB("resources", "files", compositeKey);

    if (dbEntry) {
      console.log(`Cache-Treffer: ${compositeKey}`);
      return new Response(dbEntry.content); // Antwort aus der DB
    } else {
      console.log(`Cache verfehlt: Hole aus dem Netzwerk -> ${request.url}`);
      const response = await fetch(request);

      // Antwort in IndexedDB speichern
      await putToIndexedDB("resources", "files", {
        compositeKey,
        url: request.url,
        method: request.method,
        body: request.method === "POST" ? await request.clone().text() : "",
        content: await response.clone().blob(),
      });

      return response;
    }
  } catch (error) {
    console.error("Fehler beim Zugriff auf die IndexedDB:", error);
    return new Response("Ein Fehler ist aufgetreten.", { status: 500 });
  }
}
