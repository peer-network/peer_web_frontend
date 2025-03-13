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
