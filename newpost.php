<!DOCTYPE html>
<html lang="de">

<head>
    <style>
        #drop-area {
            border: 2px dashed #ccc;
            padding: 20px;
            text-align: center;
            width: 300px;
            margin: auto;
            cursor: pointer;
        }

        #drop-area.hover {
            border-color: #000;
        }

        #preview-container {
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .preview-item {
            text-align: center;
            width: 150px;
            border: 1px solid #ccc;
            padding: 10px;
        }

        .preview-item img {
            max-width: 100%;
            height: auto;
        }

        .preview-item progress {
            width: 100%;
            height: 10px;
        }
    </style>
    <title>Dashboard</title>
</head>

<body>
    <header></header>
    <div id="drop-area">
        <p>Ziehe deine Bilder hierher oder klicke, um sie hochzuladen</p>
        <input type="file" id="file-input" accept="image/*" hidden multiple />
    </div>
    <div id="preview-container"></div>


    <script>
        const dropArea = document.getElementById("drop-area");
        const fileInput = document.getElementById("file-input");
        const previewContainer = document.getElementById("preview-container");

        dropArea.addEventListener("click", () => fileInput.click());

        dropArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropArea.classList.add("hover");
        });

        dropArea.addEventListener("dragleave", () => {
            dropArea.classList.remove("hover");
        });

        dropArea.addEventListener("drop", async (e) => {
            e.preventDefault();
            dropArea.classList.remove("hover");

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                processFiles(files);
            }
        });

        fileInput.addEventListener("change", async (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                processFiles(files);
            }
        });

        async function processFiles(files) {
            files.forEach(async (file) => {
                if (!file.type.startsWith("image/")) {
                    alert(`${file.name} ist keine Bilddatei.`);
                    return;
                }

                const previewItem = createPreviewItem(file.name);
                previewContainer.appendChild(previewItem);

                const progressBar = previewItem.querySelector("progress");
                const imageElement = previewItem.querySelector("img");

                updateProgress(progressBar, 10); // Fortschritt: Datei wird hochgeladen

                const base64 = await convertImageToBase64(file, progressBar);

                imageElement.src = `data:image/webp;base64,${base64}`;
                imageElement.style.display = "block";

                updateProgress(progressBar, 100); // Fortschritt: Fertig
            });
        }

        function createPreviewItem(fileName) {
            const previewItem = document.createElement("div");
            previewItem.className = "preview-item";

            previewItem.innerHTML = `
    <p>${fileName}</p>
    <img style="display: none;" alt="Vorschau" />
    <progress value="0" max="100"></progress>
  `;

            return previewItem;
        }

        async function convertImageToBase64(file, progressBar) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const reader = new FileReader();

                reader.onload = () => {
                    img.src = reader.result;
                };
                reader.onerror = reject;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    // Fortschritt auf 50 % setzen
                    updateProgress(progressBar, 50);

                    // Konvertiere zu WebP und hole die Base64-Daten
                    const webpDataUrl = canvas.toDataURL("image/webp");
                    resolve(webpDataUrl.split(",")[1]); // Base64-Teil zurückgeben
                };

                reader.readAsDataURL(file);
            });
        }

        function updateProgress(progressBar, value) {
            progressBar.value = value;
        }
    </script>
</body>