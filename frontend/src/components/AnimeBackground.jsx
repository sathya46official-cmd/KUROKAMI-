import { useEffect, useRef } from 'react';

export default function AnimeBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // ---- SAKURA PETALS ----
        class Petal {
            constructor() { this.reset(); this.y = Math.random() * canvas.height; }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -20;
                this.size = Math.random() * 5 + 2;
                this.speedY = Math.random() * 1.2 + 0.3;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.02;
                this.opacity = Math.random() * 0.25 + 0.05;
                this.hue = Math.random() > 0.5 ? 330 : 270;
                this.wave = Math.random() * Math.PI * 2;
                this.waveSpeed = Math.random() * 0.015 + 0.005;
            }
            update() {
                this.wave += this.waveSpeed;
                this.x += Math.sin(this.wave) * 0.4;
                this.y += this.speedY;
                this.rotation += this.rotSpeed;
                if (this.y > canvas.height + 20) this.reset();
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, 1)`;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // ---- ENERGY ORBS ----
        class Orb {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseSize = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.pulse = Math.random() * Math.PI * 2;
                this.hue = [270, 330, 190][Math.floor(Math.random() * 3)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.pulse += 0.02;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            draw() {
                const sz = this.baseSize + Math.sin(this.pulse) * 0.8;
                const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, sz * 8);
                glow.addColorStop(0, `hsla(${this.hue}, 80%, 70%, 0.35)`);
                glow.addColorStop(0.5, `hsla(${this.hue}, 80%, 60%, 0.08)`);
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.fillRect(this.x - sz * 8, this.y - sz * 8, sz * 16, sz * 16);
                ctx.beginPath();
                ctx.arc(this.x, this.y, sz, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 90%, 80%, 0.5)`;
                ctx.fill();
            }
        }

        // ---- ENERGY BEAM (Kamehameha-style) ----
        class EnergyBeam {
            constructor() { this.reset(); this.delay = Math.random() * 600; }
            reset() {
                this.active = false;
                this.timer = 0;
                this.lifetime = 120 + Math.random() * 100;
                this.delay = 400 + Math.random() * 800;
                // Beam origin & direction
                const side = Math.floor(Math.random() * 4);
                if (side === 0) { this.x = -20; this.y = Math.random() * canvas.height; this.angle = Math.random() * 0.6 - 0.3; }
                else if (side === 1) { this.x = canvas.width + 20; this.y = Math.random() * canvas.height; this.angle = Math.PI + Math.random() * 0.6 - 0.3; }
                else if (side === 2) { this.x = Math.random() * canvas.width; this.y = -20; this.angle = Math.PI / 2 + Math.random() * 0.6 - 0.3; }
                else { this.x = Math.random() * canvas.width; this.y = canvas.height + 20; this.angle = -Math.PI / 2 + Math.random() * 0.6 - 0.3; }
                this.hue = [210, 270, 330, 50][Math.floor(Math.random() * 4)]; // blue, purple, pink, golden
                this.width = 2 + Math.random() * 3;
                this.length = 200 + Math.random() * 400;
            }
            update() {
                if (!this.active) {
                    this.delay--;
                    if (this.delay <= 0) this.active = true;
                    return;
                }
                this.timer++;
                if (this.timer > this.lifetime) this.reset();
            }
            draw() {
                if (!this.active) return;
                const progress = this.timer / this.lifetime;
                const fadeIn = Math.min(progress * 5, 1);
                const fadeOut = Math.max(1 - (progress - 0.7) / 0.3, 0);
                const alpha = Math.min(fadeIn, fadeOut) * 0.4;
                if (alpha <= 0) return;
                const endX = this.x + Math.cos(this.angle) * this.length;
                const endY = this.y + Math.sin(this.angle) * this.length;

                // Outer glow
                ctx.save();
                ctx.globalAlpha = alpha * 0.3;
                ctx.strokeStyle = `hsla(${this.hue}, 90%, 70%, 1)`;
                ctx.lineWidth = this.width * 8;
                ctx.lineCap = 'round';
                ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, 1)`;
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                ctx.restore();

                // Core beam
                ctx.save();
                ctx.globalAlpha = alpha;
                const grad = ctx.createLinearGradient(this.x, this.y, endX, endY);
                grad.addColorStop(0, `hsla(${this.hue}, 100%, 85%, 1)`);
                grad.addColorStop(0.5, `hsla(${this.hue}, 90%, 70%, 1)`);
                grad.addColorStop(1, `hsla(${this.hue}, 100%, 85%, 0.3)`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = this.width;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                ctx.restore();

                // Core white center
                ctx.save();
                ctx.globalAlpha = alpha * 0.6;
                ctx.strokeStyle = 'white';
                ctx.lineWidth = this.width * 0.4;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                ctx.restore();
            }
        }

        // ---- SPEED LINES ----
        function drawSpeedLines() {
            const intensity = (Math.sin(time * 0.008) + 1) * 0.5 * 0.07;
            if (intensity < 0.01) return;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            for (let i = 0; i < 20; i++) {
                const angle = (Math.PI * 2 * i) / 20 + time * 0.001;
                const innerR = 200 + Math.sin(time * 0.01 + i) * 50;
                const outerR = innerR + 300 + Math.sin(time * 0.005 + i * 2) * 100;
                const x1 = cx + Math.cos(angle) * innerR;
                const y1 = cy + Math.sin(angle) * innerR;
                const x2 = cx + Math.cos(angle) * outerR;
                const y2 = cy + Math.sin(angle) * outerR;
                ctx.save();
                ctx.globalAlpha = intensity;
                ctx.strokeStyle = `hsla(270, 60%, 70%, 0.6)`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.restore();
            }
        }

        // ---- LIGHTNING ----
        function drawLightning(x1, y1, x2, y2, depth) {
            if (depth === 0) {
                ctx.lineTo(x2, y2);
                return;
            }
            const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 30;
            const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 30;
            drawLightning(x1, y1, mx, my, depth - 1);
            drawLightning(mx, my, x2, y2, depth - 1);
        }

        class Lightning {
            constructor() { this.reset(); }
            reset() {
                this.timer = 0;
                this.delay = 200 + Math.random() * 600;
                this.lifetime = 5 + Math.random() * 8;
                this.x = Math.random() * canvas.width;
                this.y = 0;
                this.endX = this.x + (Math.random() - 0.5) * 150;
                this.endY = Math.random() * canvas.height * 0.6;
                this.active = false;
                this.hue = Math.random() > 0.5 ? 270 : 200;
            }
            update() {
                if (!this.active) { this.delay--; if (this.delay <= 0) this.active = true; return; }
                this.timer++;
                if (this.timer > this.lifetime) this.reset();
            }
            draw() {
                if (!this.active) return;
                ctx.save();
                ctx.globalAlpha = 0.2 * (1 - this.timer / this.lifetime);
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 80%, 1)`;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 1)`;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                drawLightning(this.x, this.y, this.endX, this.endY, 4);
                ctx.stroke();
                ctx.restore();
            }
        }

        // Create all particles
        const petals = Array.from({ length: Math.min(18, Math.floor(canvas.width / 80)) }, () => new Petal());
        const orbs = Array.from({ length: Math.min(10, Math.floor(canvas.width / 120)) }, () => new Orb());
        const beams = Array.from({ length: 3 }, () => new EnergyBeam());
        const bolts = Array.from({ length: 2 }, () => new Lightning());

        const animate = () => {
            time++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Speed lines (subtle radial burst)
            drawSpeedLines();

            // Energy beams
            beams.forEach(b => { b.update(); b.draw(); });

            // Lightning
            bolts.forEach(b => { b.update(); b.draw(); });

            // Floating particles
            petals.forEach(p => { p.update(); p.draw(); });
            orbs.forEach(o => { o.update(); o.draw(); });

            animId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}
