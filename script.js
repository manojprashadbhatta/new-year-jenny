const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const burstSound = document.getElementById('burstSound');
const messageEl = document.getElementById('message');

// Particle class for fireworks bursts
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random() * 2 + 1;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 5 + 2;
    this.friction = 0.95;
    this.gravity = 0.05;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.005;
  }
  update() {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

let particles = [];

// Create a burst of particles (firework) at (x, y)
function createFirework(x, y) {
  burstSound.currentTime = 0;
  burstSound.play();
  const colors = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#fd79a8', '#a29bfe'];
  for (let i = 0; i < 50; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(new Particle(x, y, color));
  }
}

// Generate an array of stars for the background
let stars = [];
function createStars() {
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.7,
      radius: Math.random() * 1.5,
      color: 'white'
    });
  }
}
createStars();

// Define the moon properties
let moon = {
  x: canvas.width * 0.8,
  y: canvas.height * 0.2,
  radius: 40,
  color: '#fdfdfd',
  glow: 'rgba(255,255,200,0.5)'
};

// Draw the static background: sky, stars, moon, and ground
function drawBackground() {
  // Draw night-sky gradient
  let grd = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
  grd.addColorStop(0, "#0d0d1d");
  grd.addColorStop(1, "#1a1a33");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw stars
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.fill();
  });
  
  // Draw moon with a glow effect
  ctx.save();
  ctx.shadowColor = moon.glow;
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI * 2);
  ctx.fillStyle = moon.color;
  ctx.fill();
  ctx.restore();
  
  // Draw ground as a dark silhouette
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.85);
  ctx.lineTo(canvas.width, canvas.height * 0.85);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fillStyle = "#0d0d1d";
  ctx.fill();
}

// Animation loop: clear, redraw background, update and draw particles
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.draw();
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(animate);
}
animate();

// Trigger fireworks and message on click
canvas.addEventListener('click', (e) => {
  createFirework(e.clientX, e.clientY);
  messageEl.style.opacity = 1;
  setTimeout(() => {
    messageEl.style.opacity = 0;
  }, 3000);
});

// Update canvas size and regenerate stars/moon on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  createStars();
  moon.x = canvas.width * 0.8;
  moon.y = canvas.height * 0.2;
});
