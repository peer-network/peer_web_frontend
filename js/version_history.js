document.addEventListener("DOMContentLoaded", () => {

    let releases = []; 

    async function loadVersionHistory() {
        try {
            const response = await fetch("json/version_releases.json");
            releases = await response.json();

            const leftPanel = document.getElementById("left_versionHistory");

            leftPanel.innerHTML = "";

            releases.forEach((release, index) => {
                const btn = document.createElement("a");
                btn.id = release.id;
                btn.textContent = release.version;
                btn.addEventListener("click", () => {
                    leftPanel.querySelectorAll("a").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");

                    showVersionDetails(index);
                });
                leftPanel.appendChild(btn);
            });

            const firstBtn = leftPanel.querySelector("a");
            if (firstBtn) {
                firstBtn.classList.add("active");
                showVersionDetails(0);
            }
        } catch (error) {
            console.error("Error loading version history:", error);
        }
    }

    // Function to display details of a selected version
    function showVersionDetails(index) {
        const release = releases[index];
        const rightPanel = document.getElementById("right_versionHistory");

        rightPanel.innerHTML = `
            <div class="releaseVersion_header">
                <h1 class="xxl_font_size bold"> ${release.version}</h1>
                <span>${release.date}</span>
            </div>
            ${release.changes.map(change => `
                <div class="releaseVersion_content">
                    <h2 class="md_font_size bold">${change.title}</h2>
                    ${change.description.map(desc => `<p>${desc}</p>`).join("")}
                </div>
            `).join("")}
            <div class="releaseVersion_btns">
                ${release.links.map(link => `
                    <a href="${link.href}" target="_blank" class="button btn-transparent Versionbtn-link">
                        ${link.label}
                    </a>
                `).join("")}
            </div>
        `;
    }

    loadVersionHistory();
});