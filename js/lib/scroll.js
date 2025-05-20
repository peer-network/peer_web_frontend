function setScrollPercent(el, percent, smooth = false) {
  // Prozent-Wert innerhalb von [0,100] begrenzen
  const pct = Math.min(100, Math.max(0, percent));

  // Gesamt-scrollbarer Bereich in px
  const scrollableHeight = el.scrollHeight - el.clientHeight;

  // Ziel-Scroll-Position in px
  const target = scrollableHeight * (pct / 100);

  if (smooth) {
    el.scrollTo({ top: target, behavior: "smooth" });
  } else {
    el.scrollTop = target;
  }
}
