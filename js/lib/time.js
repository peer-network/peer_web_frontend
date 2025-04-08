function timeAgo(datetime) {
  const now = Date.now(); // Aktuelle Zeit in Millisekunden
  const timestamp = new Date(adjustForDSTAndFormat(datetime)); // ISO-konforme Umwandlung

  const elapsed = now - timestamp - 3600000; // Verstrichene Zeit in Millisekunden

  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // Durchschnittlicher Monat mit 30 Tagen
  const years = Math.floor(days / 365); // Durchschnittliches Jahr mit 365 Tagen

  if (seconds < 60) return `${seconds} second` + (seconds > 1 ? "s ago" : " ago");
  if (minutes < 60) return `${minutes} minute` + (minutes > 1 ? "s ago" : " ago");
  if (hours < 24) return `${hours} hour` + (hours > 1 ? "s ago" : " ago");
  if (days < 7) return `${days} day` + (days > 1 ? "s ago" : " ago");
  if (weeks < 4) return `${weeks} week` + (weeks > 1 ? "s ago" : " ago");
  if (months < 12) return `${months} month` + (months > 1 ? "s ago" : " ago");
  return `${years} year` + (years > 1 ? "s ago" : " ago");
}
function adjustForDSTAndFormat(timestampStr) {
  // Timestamp-String in Date umwandeln
  const date = new Date(timestampStr.replace(" ", "T"));

  // Sommerzeit prüfen
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  const isDST = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset()) !== date.getTimezoneOffset();

  // Wenn DST, eine Stunde abziehen
  if (isDST) {
    date.setHours(date.getHours() + 1);
  }

  // ISO-String zurückgeben
  return date.toISOString();
}
