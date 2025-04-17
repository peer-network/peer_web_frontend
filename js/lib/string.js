function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return number.toString();
}
function sanitizeString(str) {
  // Der reguläre Ausdruck sucht nach allen Zeichen, die NICHT:
  // - Groß- oder Kleinbuchstaben (A-Z, a-z)
  // - Ziffern (0-9)
  // - Leerzeichen
  // - Bindestriche (-)
  // - Unterstriche (_)
  // sind und ersetzt sie durch einen leeren String.
  return str.replace(/[^A-Za-z0-9 \-_]/g, "");
}
function extractAfterComma(str) {
  return str.includes(",") ? str.split(",")[1] : str;
}
async function loadTextFile(url, element) {
  // let id = document.getElementById(elementId);
  // const textcontainer = id.querySelector(".custom-text");
  try {
    const response = await fetch(url);
    const text = await response.text();

    element.innerText = text;
  } catch (error) {
    element.innerText = "Fehler beim Laden der Datei.";
  }
}
function sliceTextAtWord(text, maxLength = 140) {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  return sliced.slice(0, lastSpace);
}
async function readBytes(url, byteCount) {
  try {
    const response = await fetch(url);
    const reader = response.body.getReader();
    const { value, done } = await reader.read(); // Erstes Chunk lesen

    if (done) {
      // document.getElementById('output').innerText = "Datei ist leer oder konnte nicht gelesen werden.";
      return;
    }

    // Nur die ersten `byteCount` Bytes nehmen
    const slicedValue = value.slice(0, byteCount);
    const text = new TextDecoder("utf-8").decode(slicedValue);
    return text;
    // document.getElementById('output').innerText = text;
  } catch (error) {
    console.error("Fehler beim Lesen der Datei:", error);
    // document.getElementById('output').innerText = "Fehler beim Laden der Datei.";
  }
}
