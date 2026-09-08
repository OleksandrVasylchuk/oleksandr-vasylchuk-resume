/**
 * "Deploy Run" — a tiny endless runner drawn on a 2D canvas.
 * You are the deploy. Jump over bugs, plugin conflicts and the white screen of death.
 * Grab coffee for bonus points. Space / ArrowUp / tap to jump (double jump allowed).
 */

export type RunnerEvents = {
  onScore: (score: number) => void;
  onGameOver: (score: number) => void;
};

type Kind = "bug" | "fire" | "wsod" | "coffee";
interface Entity {
  kind: Kind;
  x: number;
  y: number;
  w: number;
  h: number;
  vy?: number;
  taken?: boolean;
}

const EMOJI: Record<Kind, string> = { bug: "🐛", fire: "🔥", wsod: "💀", coffee: "☕" };

export class Runner {
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private running = false;
  private over = false;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private s = 1; // scale factor relative to 360px height
  private groundY = 0;
  private player = { x: 0, y: 0, vy: 0, size: 44, jumps: 0, tilt: 0 };
  private entities: Entity[] = [];
  private speed = 0;
  private spawnIn = 0;
  private dist = 0;
  private coffee = 0;
  private time = 0;
  private lastScoreEmit = 0;
  private particles: { x: number; y: number; vx: number; vy: number; life: number; c: string }[] = [];
  private shake = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private ev: RunnerEvents,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.s = this.h / 360;
    this.groundY = this.h * 0.8;
    this.player.size = 42 * this.s;
    this.player.x = this.w * 0.16;
    if (!this.running) this.drawIdle();
  }

  get score() {
    return Math.floor(this.dist / 10) + this.coffee * 50;
  }

  start() {
    this.entities = [];
    this.particles = [];
    this.speed = 330 * this.s;
    this.spawnIn = 1.2;
    this.dist = 0;
    this.coffee = 0;
    this.time = 0;
    this.over = false;
    this.running = true;
    this.player.y = this.groundY - this.player.size;
    this.player.vy = 0;
    this.player.jumps = 0;
    this.last = performance.now();
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
  }

  jump() {
    if (!this.running || this.over) return;
    if (this.player.jumps >= 2) return;
    this.player.vy = -(this.player.jumps === 0 ? 760 : 640) * this.s;
    this.player.jumps++;
    this.burst(this.player.x + this.player.size / 2, this.player.y + this.player.size, 8, "#c8ff4d");
  }

  private burst(x: number, y: number, n: number, c: string) {
    for (let i = 0; i < n; i++) {
      this.particles.push({ x, y, vx: (Math.random() - 0.5) * 260 * this.s, vy: (Math.random() - 0.9) * 260 * this.s, life: 0.5 + Math.random() * 0.4, c });
    }
  }

  private spawn() {
    const r = Math.random();
    const s = this.s;
    if (r < 0.2) {
      this.entities.push({ kind: "coffee", x: this.w + 40, y: this.groundY - (120 + Math.random() * 70) * s, w: 30 * s, h: 30 * s });
    } else if (r < 0.55) {
      this.entities.push({ kind: "bug", x: this.w + 40, y: this.groundY - 34 * s, w: 34 * s, h: 32 * s });
    } else if (r < 0.85) {
      this.entities.push({ kind: "fire", x: this.w + 40, y: this.groundY - 46 * s, w: 32 * s, h: 44 * s });
    } else {
      this.entities.push({ kind: "wsod", x: this.w + 40, y: this.groundY - 40 * s, w: 46 * s, h: 38 * s });
      if (Math.random() < 0.5) this.entities.push({ kind: "bug", x: this.w + 40 + 60 * s, y: this.groundY - 34 * s, w: 34 * s, h: 32 * s });
    }
  }

  private loop = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;
    this.update(dt);
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    if (this.over) {
      this.particles.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 900 * this.s * dt;
        p.life -= dt;
      });
      this.particles = this.particles.filter((p) => p.life > 0);
      this.shake *= 0.9;
      return;
    }
    const s = this.s;
    this.time += dt;
    this.speed = Math.min(980 * s, this.speed + 14 * s * dt);
    this.dist += this.speed * dt;

    // player physics
    const p = this.player;
    p.vy += 2100 * s * dt;
    p.y += p.vy * dt;
    const floor = this.groundY - p.size;
    if (p.y >= floor) {
      if (p.jumps > 0) this.burst(p.x + p.size / 2, this.groundY, 5, "#7d8494");
      p.y = floor;
      p.vy = 0;
      p.jumps = 0;
    }
    p.tilt = Math.max(-0.35, Math.min(0.35, p.vy / (900 * s)));

    // spawn
    this.spawnIn -= dt;
    if (this.spawnIn <= 0) {
      this.spawn();
      const base = Math.max(0.55, 1.5 - this.time * 0.02);
      this.spawnIn = base + Math.random() * 0.7;
    }

    // entities
    for (const e of this.entities) {
      e.x -= this.speed * dt;
      if (e.kind === "coffee") e.y += Math.sin(this.time * 5 + e.x * 0.01) * 20 * s * dt;
    }
    this.entities = this.entities.filter((e) => e.x + e.w > -20 && !e.taken);

    // collisions (shrunken hitboxes so it feels fair)
    const px = p.x + p.size * 0.18;
    const py = p.y + p.size * 0.18;
    const pw = p.size * 0.64;
    const ph = p.size * 0.72;
    for (const e of this.entities) {
      const ex = e.x + e.w * 0.2;
      const ey = e.y + e.h * 0.2;
      const ew = e.w * 0.6;
      const eh = e.h * 0.65;
      if (px < ex + ew && px + pw > ex && py < ey + eh && py + ph > ey) {
        if (e.kind === "coffee") {
          e.taken = true;
          this.coffee++;
          this.burst(e.x + e.w / 2, e.y + e.h / 2, 12, "#ffd166");
        } else {
          this.gameOver();
          break;
        }
      }
    }

    // particles
    this.particles.forEach((q) => {
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.vy += 900 * s * dt;
      q.life -= dt;
    });
    this.particles = this.particles.filter((q) => q.life > 0);

    if (this.time - this.lastScoreEmit > 0.1) {
      this.lastScoreEmit = this.time;
      this.ev.onScore(this.score);
    }
  }

  private gameOver() {
    this.over = true;
    this.shake = 14 * this.s;
    this.burst(this.player.x + this.player.size / 2, this.player.y + this.player.size / 2, 40, "#ff5d5d");
    this.ev.onScore(this.score);
    this.ev.onGameOver(this.score);
    setTimeout(() => this.stop(), 1200);
  }

  /* ---------- drawing ---------- */
  private drawBackdrop() {
    const { ctx, w, h, s } = this;
    ctx.clearRect(0, 0, w, h);
    // moving grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    const gap = 48 * s;
    const off = (this.dist * 0.5) % gap;
    ctx.beginPath();
    for (let x = -off; x < w; x += gap) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gap) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
    // ground
    ctx.strokeStyle = "#c8ff4d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY + 1);
    ctx.lineTo(w, this.groundY + 1);
    ctx.stroke();
    // ground ticks
    ctx.strokeStyle = "rgba(200,255,77,0.35)";
    ctx.lineWidth = 1;
    const tick = 32 * s;
    const toff = this.dist % tick;
    ctx.beginPath();
    for (let x = -toff; x < w; x += tick) {
      ctx.moveTo(x, this.groundY + 6);
      ctx.lineTo(x + 12 * s, this.groundY + 6);
    }
    ctx.stroke();
  }

  private drawPlayer() {
    const { ctx } = this;
    const p = this.player;
    ctx.save();
    ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
    ctx.rotate(p.tilt);
    const r = p.size * 0.28;
    ctx.fillStyle = "#c8ff4d";
    ctx.shadowColor = "rgba(200,255,77,0.6)";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.roundRect(-p.size / 2, -p.size / 2, p.size, p.size, r);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#0a0d02";
    ctx.font = `800 ${p.size * 0.42}px Syne, Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("OV", 0, p.size * 0.03);
    ctx.restore();
  }

  private drawEntities() {
    const { ctx } = this;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const e of this.entities) {
      ctx.font = `${e.h}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      ctx.fillText(EMOJI[e.kind], e.x + e.w / 2, e.y + e.h / 2 + e.h * 0.05);
    }
    for (const q of this.particles) {
      ctx.globalAlpha = Math.max(0, q.life);
      ctx.fillStyle = q.c;
      ctx.fillRect(q.x, q.y, 4 * this.s, 4 * this.s);
    }
    ctx.globalAlpha = 1;
  }

  private draw() {
    const { ctx } = this;
    ctx.save();
    if (this.shake > 0.5) ctx.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake);
    this.drawBackdrop();
    this.drawEntities();
    this.drawPlayer();
    ctx.restore();
  }

  drawIdle() {
    this.player.y = this.groundY - this.player.size;
    this.drawBackdrop();
    this.drawPlayer();
  }
}

export function tierFor(score: number) {
  if (score < 300) return { title: "Intern deploy", note: "The site went down. Happens to everyone on a Friday." };
  if (score < 800) return { title: "Middle deploy", note: "Survived the sprint. Some hotfixes required." };
  if (score < 1500) return { title: "Senior deploy", note: "Zero-downtime. Clients didn't even notice." };
  return { title: "Tech Lead material", note: "You clearly know your way around production. Let's talk." };
}
