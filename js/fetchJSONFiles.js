'use strict'

async function fetchEndpoints() {
    // const ENDPOINT_URL = "https://media.getpeer.eu/assets/endpoints.json";
    const ENDPOINT_URL = "https://media.peerapp.eu/assets/endpoints.json";
    const DEFAULT_VERSION = "1.9.0";
    const LOCAL_KEY = "APP_VERSION";
    const VERSION = localStorage.getItem(LOCAL_KEY) || null;

    // if (VERSION) {
    //     updateVersionElements(VERSION)
    //     return;
    // }

    try {
        // trying to fetch the latest version
        const response = await fetch(ENDPOINT_URL, { cache: "no-store" });
        if (!response.ok) throw new Error(`Failed to fetch: HTTP ${response.status}`);

        const releases = await response.json();
        const latestVersion = releases?.data?.web?.[0]?.version || DEFAULT_VERSION;
        
        // Update localStorage
        localStorage.setItem(LOCAL_KEY, latestVersion);

        // Update UI
        updateVersionElements(latestVersion);

    } catch (error) {
        console.error("Error loading version history:", error);

        // Fallback to existing or default version
        const storedVersion = localStorage.getItem(LOCAL_KEY) || DEFAULT_VERSION;
        updateVersionElements(storedVersion);
    }
}

// update UI
function updateVersionElements(version) {
    document.querySelectorAll(".version-number")
        .forEach(el => el.textContent = `Version ${version}`);
}