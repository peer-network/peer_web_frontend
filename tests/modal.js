function createModal({ title = "", message = "", buttons = [], type = "info" }) {
    return new Promise((resolve) => {
        // Modal-Container erstellen
        const modal = document.createElement("div");
        modal.classList.add("modal-container");

        // Modal-Inhalt erstellen
        modal.innerHTML = `
            <div class="modal-content ${type}">
                <span class="modal-close">&times;</span>
                <h2 class="modal-title">${title}</h2>
                <p class="modal-message">${message}</p>
                <div class="modal-buttons">
                    ${buttons
                        .map((btn, index) => `<button class="modal-button" data-index="${index}">${btn}</button>`)
                        .join("")}
                </div>
            </div>
        `;

        // Modal zum Body hinzufügen
        document.body.appendChild(modal);

        // Modal anzeigen mit Fade-In
        setTimeout(() => modal.classList.add("modal-show"), 10);

        // Event-Listener für Buttons
        const buttonElements = modal.querySelectorAll(".modal-button");
        buttonElements.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                resolve(Number(index)); // Rückgabe des gedrückten Buttons
                closeModal(modal);
            });
        });

        // Event-Listener für das Schließen-Icon
        const closeButton = modal.querySelector(".modal-close");
        closeButton.addEventListener("click", () => {
            resolve(null); // Keine Auswahl
            closeModal(modal);
        });

        // Schließen bei Klick außerhalb des Modals
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                resolve(null); // Keine Auswahl
                closeModal(modal);
            }
        });
    });

    // Hilfsfunktion zum Schließen des Modals mit Fade-Out und Löschen des Inhalts
    function closeModal(modalElement) {
        modalElement.classList.add("modal-fade-out"); // Fade-Out-Animation
        setTimeout(() => {
            modalElement.innerHTML = ""; // Inhalt entfernen
            modalElement.remove(); // Modal aus dem DOM entfernen
        }, 300); // Zeit für die Fade-Out-Animation
    }
}
