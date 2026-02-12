/**
 * AI Labs Particle Network Background
 * Animated neural network-style particles with mouse interaction
 */
(function () {
    const container = document.querySelector('.shader-background');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let w, h, particles, mouse = { x: -1000, y: -1000 }, raf;

    const CONFIG = {
        count: 80,
        speed: 0.3,
        maxDist: 160,
        mouseRadius: 200,
        mouseForce: 0.02,
        colors: ['#00b4db', '#0083b0', '#667eea', '#764ba2', '#4facfe'],
        lineColor: 'rgba(100, 180, 255, ',
        particleMinR: 1.5,
        particleMaxR: 3.5,
        pulseSpeed: 0.02,
    };

    function resize() {
        w = canvas.width = container.offsetWidth;
        h = canvas.height = container.offsetHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < CONFIG.count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * CONFIG.speed,
                vy: (Math.random() - 0.5) * CONFIG.speed,
                r: CONFIG.particleMinR + Math.random() * (CONFIG.particleMaxR - CONFIG.particleMinR),
                color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
                phase: Math.random() * Math.PI * 2,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // Update & draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Mouse repulsion
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONFIG.mouseRadius && dist > 0) {
                const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }

            // Damping
            p.vx *= 0.999;
            p.vy *= 0.999;

            p.x += p.vx;
            p.y += p.vy;
            p.phase += CONFIG.pulseSpeed;

            // Wrap around edges
            if (p.x < -20) p.x = w + 20;
            if (p.x > w + 20) p.x = -20;
            if (p.y < -20) p.y = h + 20;
            if (p.y > h + 20) p.y = -20;

            // Pulsing radius
            const pulse = 1 + Math.sin(p.phase) * 0.3;
            const r = p.r * pulse;

            // Glow
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
            gradient.addColorStop(0, p.color + '40');
            gradient.addColorStop(1, p.color + '00');
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONFIG.maxDist) {
                    const alpha = (1 - dist / CONFIG.maxDist) * 0.25;
                    ctx.beginPath();
                    ctx.strokeStyle = CONFIG.lineColor + alpha + ')';
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        raf = requestAnimationFrame(draw);
    }

    // Mouse tracking (passive, on document for full coverage)
    document.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Init
    window.addEventListener('resize', function () {
        resize();
        // Re-distribute particles on large resize
        if (particles) {
            particles.forEach(p => {
                if (p.x > w) p.x = Math.random() * w;
                if (p.y > h) p.y = Math.random() * h;
            });
        }
    });

    resize();
    createParticles();
    draw();
})();
