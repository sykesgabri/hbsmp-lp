requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

var canvas = document.getElementById("rain");
var ctx = canvas.getContext("2d");

var width = 0;
var height = 0;

window.onresize = function onresize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
};

window.onresize();

var particules = [];
var gouttes = [];

var RAIN_COUNT = 6;
var DROP_COUNT = 5;
var DROP_COLOR = "#2e4e8a"; // dark navy blue

function Rain(X, Y) {
  particules.push({
    vitesseX: 0,
    vitesseY: Math.floor(Math.random() * 5 + 8),
    X: X,
    Y: Y,
    alpha: 0.85,
    couleur: DROP_COLOR,
  });
}

function explosion(X, Y, couleur) {
  var nombre = DROP_COUNT;
  while (nombre--) {
    gouttes.push({
      vitesseX: Math.floor(Math.random() * 5) - 2,
      vitesseY: Math.floor(Math.random() * -3) - 1,
      X: X,
      Y: Y,
      radius: 1,
      alpha: 0.9,
      couleur: couleur,
    });
  }
}

var gradient = null;

function buildGradient() {
  gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0,    "rgba(13,  17,  20,  1)"); // near-black night sky
  gradient.addColorStop(0.45, "rgba(29,  36,  40,  1)"); // base — mid sky
  gradient.addColorStop(1,    "rgba(61,  73,  77,  1)"); // surface1 — foggy ground
}

function rendu(ctx) {
  ctx.save();

  // Redraw solid gradient background every frame — no trails
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  var tau = Math.PI * 2;

  // Draw raindrops as Minecraft-style pixel streaks: 2px wide, tall thin rects
  for (var i = 0, p; (p = particules[i]); i++) {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.couleur;
    // Minecraft rain: 2px wide, height proportional to fall speed
    ctx.fillRect(p.X, p.Y, 3, p.vitesseY + 10);
  }

  // Draw splash droplets as small squares (pixel art look)
  for (var i = 0, g; (g = gouttes[i]); i++) {
    ctx.globalAlpha = g.alpha;
    ctx.fillStyle = g.couleur;
    ctx.fillRect(g.X, g.Y, g.radius * 2, g.radius * 2);
  }

  ctx.restore();
}

function update() {
  for (var i = 0, p; (p = particules[i]); i++) {
    p.X += p.vitesseX;
    p.Y += p.vitesseY + 5;
    if (p.Y > height - 15) {
      particules.splice(i--, 1);
      explosion(p.X, p.Y, p.couleur);
    }
  }

  for (var i = 0, g; (g = gouttes[i]); i++) {
    g.X += g.vitesseX;
    g.Y += g.vitesseY;
    g.vitesseY += 0.15; // gravity on splashes
    g.alpha -= 0.04;
    if (g.alpha <= 0) {
      gouttes.splice(i--, 1);
    }
  }

  var i = RAIN_COUNT;
  while (i--) {
    Rain(Math.floor(Math.random() * width), -15);
  }
}

// Draw the solid gradient base once, then overlay semi-transparent gradient each frame
function drawBase() {
  var base = ctx.createLinearGradient(0, 0, 0, height);
  base.addColorStop(0,    "#0D1114"); // near-black night sky
  base.addColorStop(0.45, "#1D2428"); // base — mid sky
  base.addColorStop(1,    "#3D494D"); // surface1 — foggy ground
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);
}

window.onresize = function onresize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  buildGradient();
  drawBase();
};

window.onresize();

(function boucle() {
  requestAnimFrame(boucle);
  update();
  rendu(ctx);
})();
