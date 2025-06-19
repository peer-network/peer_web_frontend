// Elemente, die gesnappt werden sollen
const snapElements = document.querySelectorAll('.card');
const scrollContainer = document.querySelector('#main');

// Status, um mehrfaches Scrollen zu verhindern
let isSnapping = false;

// Scroll-Event-Listener
scrollContainer.addEventListener('scroll', () => {
    if (isSnapping) return; // Verhindere mehrfaches Auslösen
    
    isSnapping = true;
    setTimeout(() => {
        // 1. Aktuelle Scroll-Position ermitteln
        const scrollPosition = scrollContainer.scrollTop;
        
        // 2. Zielposition (nächstes Snap-Element) finden
        const snapTarget = findClosestSnap(scrollPosition);

        // 3. Sanft scrollen
        scrollContainer.scrollTo({ top: snapTarget, behavior: 'smooth' });

        isSnapping = false;
    }, 100); // Verzögerung, um Scrollen zu stabilisieren
});

// Funktion: Finde die nächste Snap-Position
function findClosestSnap(current) {
    const snapPositions = Array.from(snapElements).map(el => el.offsetTop);
    return snapPositions.reduce((prev, curr) => 
        Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev
    );
}
