function tempMedia(folder) {
  // let domain = document.getElementById("config").dataset.host;
  const newUrl = domain.replace("://", "://media.") + folder;
  // let s = "https://media.getpeer.eu" + folder;
  return newUrl;
}