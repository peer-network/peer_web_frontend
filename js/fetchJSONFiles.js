'use strict'

async function fetchEndpoints() {
    try {
        const response = await fetch("https://media.getpeer.eu/assets/endpoints.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const releases = await response.json();

        // Get the version number safely
        const version = releases?.data?.web?.[0]?.version || "N/A";

        // Update all elements with class 'version-number'
        document.querySelectorAll('.version-number').forEach(el => {
            el.textContent = `Version ${version}`;
        });

    } catch (error) {
        console.error("Error loading version history:", error);
    }
}

// async function fetchJSONResponseCodes() {
//      try {
//         const response = await fetch("https://media.getpeer.eu/assets/endpoints.json");
//         const releases = await response.json();
//         // releases?.data?.web[0]?.version
//     } catch (error) {
//         console.error("Error loading version history:", error);
//     }
// }