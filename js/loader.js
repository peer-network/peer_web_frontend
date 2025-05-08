// Function to create the loader element
function createLoaderElement() {
  const loadingOverlay = document.createElement("div");
  loadingOverlay.id = "loading-overlay";
  loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            `;

  const loaderDiv = document.createElement("div");
  loaderDiv.className = "loader";
  loaderDiv.style.cssText = `
                width: 100px;
                height: 100px;
                display: flex; /* For centering the image */
                justify-content: center;
                align-items: center;
            `;

  const imgElement = document.createElement("img");
  imgElement.src = "svg/logo_farbe.svg";
  imgElement.alt = "loading";
  imgElement.style.height = "3rem";
  imgElement.style.animation = "loading 4s ease 0s infinite";

  loaderDiv.appendChild(imgElement);

  loadingOverlay.appendChild(loaderDiv);

  return loadingOverlay;
}

let loaderInstance;

// Function to show the loader
function showLoader() {
  if (!loaderInstance) {
    loaderInstance = createLoaderElement();
    document.body.appendChild(loaderInstance);
  }
  loaderInstance.style.display = "flex";
  document.body.style.pointerEvents = "none";
}

// Function to hide the loader
function hideLoader() {
  if (loaderInstance) {
    loaderInstance.style.display = "none";
    document.body.style.pointerEvents = "";
  }
}

