const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Parameter für das rotierende Quadrat
const squareSide = 400;
const halfSide = squareSide / 2;

// Ballparameter
const ballRadius = 30; // Etwas größer, damit das Symbol gut zu sehen ist
const maxSpeed = 0.01;
const gravity = 0.1; // Konstante Schwerkraft in Canvas-Koordinaten (immer nach unten)

// Bildobjekte für die Symbole laden
const diamondImg = new Image();
diamondImg.src = "../img/peer.webp";

const bitcoinImg = new Image();
bitcoinImg.src = "../img/solana-sol-seeklogo.png";

const solanaImg = new Image();
solanaImg.src = "../img/bitcoin-btc-logo.png";

const gemImg = new Image();
gemImg.src = "../img/gem.png";

// Erstelle drei Bälle mit fest zugewiesenen Symbolen und zufälliger Bewegung
const balls = [
  {
    x: -halfSide / 2,
    y: -halfSide / 2,
    vx: (Math.random() * 2 - 1) * maxSpeed,
    vy: (Math.random() * 2 - 1) * maxSpeed,
    radius: ballRadius,
    image: diamondImg,
  },
  {
    x: halfSide / 2,
    y: -halfSide / 2,
    vx: (Math.random() * 2 - 1) * maxSpeed,
    vy: (Math.random() * 2 - 1) * maxSpeed,
    radius: ballRadius,
    image: bitcoinImg,
  },
  {
    x: 0,
    y: halfSide / 2,
    vx: (Math.random() * 2 - 1) * maxSpeed,
    vy: (Math.random() * 2 - 1) * maxSpeed,
    radius: ballRadius,
    image: solanaImg,
  },
  {
    x: 0,
    y: halfSide / 2,
    vx: (Math.random() * 2 - 1) * maxSpeed,
    vy: (Math.random() * 2 - 1) * maxSpeed,
    radius: ballRadius,
    image: gemImg,
  },
];

let rotationAngle = 0;

// Update-Funktion: bewegt die Bälle, wendet die (konstante) Schwerkraft an,
// und überprüft Kollisionen mit den Quadratgrenzen und untereinander.
function update() {
  // Die Schwerkraft (0, gravity) gilt in Canvas-Koordinaten.
  // Um sie im Koordinatensystem des Quadrats anzuwenden, transformieren wir sie:
  // squareGravity = R(-rotationAngle) * (0, gravity)
  // Dabei gilt:
  //   gx = gravity * sin(rotationAngle)
  //   gy = gravity * cos(rotationAngle)
  const gx = gravity * Math.sin(rotationAngle);
  const gy = gravity * Math.cos(rotationAngle);

  // Bewegung der Bälle inklusive Gravitation
  for (let ball of balls) {
    ball.vx += gx;
    ball.vy += gy;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Kollision mit den Grenzen des Quadrats
    if (ball.x - ball.radius < -halfSide) {
      ball.x = -halfSide + ball.radius;
      ball.vx *= -1;
    }
    if (ball.x + ball.radius > halfSide) {
      ball.x = halfSide - ball.radius;
      ball.vx *= -1;
    }
    if (ball.y - ball.radius < -halfSide) {
      ball.y = -halfSide + ball.radius;
      ball.vy *= -1;
    }
    if (ball.y + ball.radius > halfSide) {
      ball.y = halfSide - ball.radius;
      ball.vy *= -1;
    }
  }

  // Kollisionen zwischen den Bällen (einfache elastische Kollisionen)
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const ball1 = balls[i];
      const ball2 = balls[j];

      let dx = ball2.x - ball1.x;
      let dy = ball2.y - ball1.y;
      let dist = Math.hypot(dx, dy);
      let minDist = ball1.radius + ball2.radius;

      if (dist < minDist) {
        // Normalenvektor der Kollision
        let nx = dx / dist;
        let ny = dy / dist;

        // Relative Geschwindigkeit in Normalrichtung
        let dvx = ball1.vx - ball2.vx;
        let dvy = ball1.vy - ball2.vy;
        let relVel = dvx * nx + dvy * ny;

        if (relVel > 0) continue;

        // Austausch der Geschwindigkeiten entlang der Normalen (elastische Kollision)
        let impulse = (2 * relVel) / 2; // beide Massen = 1
        ball1.vx -= impulse * nx;
        ball1.vy -= impulse * ny;
        ball2.vx += impulse * nx;
        ball2.vy += impulse * ny;

        // Überlappung korrigieren
        let overlap = minDist - dist;
        ball1.x -= (overlap / 2) * nx;
        ball1.y -= (overlap / 2) * ny;
        ball2.x += (overlap / 2) * nx;
        ball2.y += (overlap / 2) * ny;
      }
    }
  }

  // Erhöhe den Rotationswinkel des Quadrats
  rotationAngle += 0.005;
}

// Zeichen-Funktion: rotiert das Quadrat und zeichnet es sowie die Bälle mit Symbolen
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  // Ursprung in die Mitte des Canvas verschieben und das Quadrat rotieren
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotationAngle);

  // Zeichne das Quadrat
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.strokeRect(-halfSide, -halfSide, squareSide, squareSide);

  // Zeichne die Bälle
  for (let ball of balls) {
    ctx.save();
    // Ball als gefüllten Kreis (Hintergrund) zeichnen
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.fill();

    // Clippe den Kreis, damit das Symbol rund erscheint
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.clip();

    // Symbolbild zeichnen (falls geladen)
    if (ball.image.complete) {
      ctx.drawImage(ball.image, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    } else {
      // Platzhalter
      ctx.fillStyle = "#ccc";
      ctx.fillRect(ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    }
    ctx.restore();

    // Zeichne Rand um den Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#000";
    ctx.stroke();
  }
  ctx.restore();
}

// Animationsschleife
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
