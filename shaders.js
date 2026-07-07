const canvasHost = document.getElementById('canva');

if (canvasHost) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let particles = [];
    let orbs = [];
    let nebulae = [];
    let shootingStars = [];
    let lightningBolts = [];

    function createParticles() {
        const amount = Math.max(300, Math.floor((width * height) / 1100));
        particles = Array.from({ length: amount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.2,
            vx: (Math.random() - 0.5) * (0.28 + Math.random() * 0.12),
            vy: (Math.random() - 0.5) * (0.28 + Math.random() * 0.12),
            alpha: Math.random() * 0.35 + 0.12,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.001 + Math.random() * 0.003,
            sizeFactor: Math.random() > 0.92 ? 2.8 : 1,
            drift: (Math.random() - 0.5) * 0.08,
            type: Math.random() > 0.92 ? 'star' : 'dust'
        }));
    }

    function createOrbs() {
        orbs = Array.from({ length: 5 }, (_, index) => ({
            x: width * (0.18 + index * 0.16),
            y: height * (0.2 + (index % 3) * 0.2),
            radius: 110 + index * 35,
            offset: Math.random() * Math.PI * 2,
            speed: 0.0004 + index * 0.00008
        }));
    }

    function getThemePalette() {
        const isBella = document.body.classList.contains('theme-bella');

        if (isBella) {
            return {
                backgroundTop: '#060402',
                backgroundMid: '#140c08',
                backgroundBottom: '#22140e',
                nebulaOne: 'rgba(168, 96, 33, 0.22)',
                nebulaTwo: 'rgba(85, 55, 24, 0.16)',
                nebulaThree: 'rgba(170, 118, 56, 0.16)',
                shimmer: 'rgba(255, 230, 196, 0.05)',
                orbGlow: 'rgba(255, 185, 90, 0.18)',
                orbSecondary: 'rgba(134, 83, 44, 0.1)',
                particleGlow: 'rgba(255, 236, 203, 0.6)',
                particleSecondary: 'rgba(228, 176, 100, 0.16)',
                starCore: 'rgba(255, 248, 232, 0.85)',
                starTrail: 'rgba(255, 228, 180, 0.4)'
            };
        }

        return {
            backgroundTop: '#01030a',
            backgroundMid: '#07111f',
            backgroundBottom: '#02050a',
            nebulaOne: 'rgba(80, 39, 255, 0.18)',
            nebulaTwo: 'rgba(0, 196, 255, 0.14)',
            nebulaThree: 'rgba(174, 64, 255, 0.16)',
            shimmer: 'rgba(255, 255, 255, 0.03)',
            orbGlow: 'rgba(122, 245, 255, 0.16)',
            orbSecondary: 'rgba(90, 88, 255, 0.09)',
            particleGlow: 'rgba(210, 240, 255, 0.55)',
            particleSecondary: 'rgba(160, 190, 255, 0.14)',
            starCore: 'rgba(255, 255, 255, 0.85)',
            starTrail: 'rgba(255, 255, 255, 0.33)'
        };
    }

    function createNebulae() {
        const palette = getThemePalette();
        nebulae = [
            { x: width * 0.25, y: height * 0.25, radius: width * 0.32, color: palette.nebulaOne },
            { x: width * 0.77, y: height * 0.22, radius: width * 0.28, color: palette.nebulaTwo },
            { x: width * 0.55, y: height * 0.8, radius: width * 0.24, color: palette.nebulaThree }
        ];
    }

    function createShootingStars() {
        shootingStars = Array.from({ length: 14 }, () => ({
            x: Math.random() * width * 1.2 - width * 0.1,
            y: Math.random() * height,
            length: 80 + Math.random() * 120,
            vx: 4 + Math.random() * 4,
            vy: 0.6 + Math.random() * 1.2,
            alpha: 0,
            life: Math.random() * 120 + 70,
            timer: 0
        }));
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createParticles();
        createOrbs();
        createNebulae();
        createShootingStars();
        lightningBolts = [];
    }

    function drawBackground(time) {
        const palette = getThemePalette();
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, palette.backgroundTop);
        gradient.addColorStop(0.45, palette.backgroundMid);
        gradient.addColorStop(1, palette.backgroundBottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        nebulae.forEach((nebula, index) => {
            const offsetX = Math.sin(time * 0.00017 + index * 1.2) * 20;
            const offsetY = Math.cos(time * 0.00014 + index * 0.9) * 16;
            const glow = ctx.createRadialGradient(nebula.x + offsetX, nebula.y + offsetY, 0, nebula.x + offsetX, nebula.y + offsetY, nebula.radius);
            glow.addColorStop(0, nebula.color);
            glow.addColorStop(0.3, 'rgba(255,255,255,0.08)');
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);
        });
        ctx.restore();

        const shimmer = Math.sin(time * 0.00045) * 0.02 + 0.02;
        ctx.fillStyle = `rgba(255, 255, 255, ${shimmer})`;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = palette.shimmer;
        ctx.fillRect(0, 0, width, height);
    }

function drawJaggedLightning(x1, y1, x2, y2, displacement = 30, segments = 14) {
    const points = [{ x: x1, y: y1 }];

    for (let i = 1; i < segments; i++) {
        const t = i / segments;

        points.push({
            x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * displacement,
            y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * displacement
        });
    }

    points.push({ x: x2, y: y2 });

    return points;
}

function drawBoltPath(points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
}

function drawLightning() {

    // cria novos raios
    if (Math.random() < 0.02 && lightningBolts.length < 4) {
        const startX = Math.random() * width;
        const startY = Math.random() * height * 0.18;
        const endX = startX + (Math.random() - 0.5) * width * 0.35;
        const endY = startY + height * 0.3 + Math.random() * height * 0.22;

        lightningBolts.push({
            x1: startX,
            y1: startY,
            x2: endX,
            y2: endY,

            branches: Array.from({
                length: 8 + Math.floor(Math.random() * 8)
            }, () => ({
                offsetX: (Math.random() - 0.5) * 220,
                offsetY: 30 + Math.random() * 140
            })),

            life: 8 + Math.random() * 6,
            timer: 0,
            intensity: 0.8 + Math.random() * 0.4
        });
    }

    if (lightningBolts.length === 0) return;

    // flash global
    ctx.fillStyle = `rgba(200,230,255,${Math.random() * 0.05})`;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.lineCap = 'round';

    lightningBolts.forEach((bolt, index) => {

        bolt.timer++;

        const progress = bolt.timer / bolt.life;

        if (progress >= 1) {
            lightningBolts.splice(index, 1);
            return;
        }

        const alpha = (1 - progress) * bolt.intensity;

        // piscar elétrico
        const flicker = Math.random() * 0.5 + 0.5;
        ctx.globalAlpha = flicker;

        // gera caminho principal
        const mainPath = drawJaggedLightning(
            bolt.x1,
            bolt.y1,
            bolt.x2,
            bolt.y2,
            45,
            16
        );

        // camada externa glow
        ctx.strokeStyle = `rgba(100,180,255,${alpha * 0.35})`;
        ctx.lineWidth = 10;
        ctx.shadowBlur = 90;
        ctx.shadowColor = 'rgba(100,180,255,1)';
        drawBoltPath(mainPath);

        // camada média azul
        ctx.strokeStyle = `rgba(180,220,255,${alpha * 0.8})`;
        ctx.lineWidth = 5;
        ctx.shadowBlur = 60;
        ctx.shadowColor = 'rgba(180,220,255,1)';
        drawBoltPath(mainPath);

        // núcleo branco
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 1.6;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255,255,255,1)';
        drawBoltPath(mainPath);

        // ramificações
        bolt.branches.forEach((branch) => {

            const bx = bolt.x1 + (bolt.x2 - bolt.x1) * (Math.random() * 0.7);

            const by = bolt.y1 + (bolt.y2 - bolt.y1) * (Math.random() * 0.7);

            const ex = bx + branch.offsetX;
            const ey = by + branch.offsetY;

            const branchPath = drawJaggedLightning(
                bx,
                by,
                ex,
                ey,
                18,
                6
            );

            ctx.strokeStyle = `rgba(220,240,255,${alpha * 0.6})`;
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 25;
            drawBoltPath(branchPath);
        });

    });

    ctx.restore();
}
    function drawOrbs(time) {
        const palette = getThemePalette();

        orbs.forEach((orb, index) => {
            const pulse = 0.75 + Math.sin(time * 0.0003 + orb.offset) * 0.2;
            const x = width * (0.14 + index * 0.17) + Math.sin(time * 0.00018 + index) * width * 0.06;
            const y = height * (0.18 + (index % 3) * 0.2) + Math.cos(time * 0.00016 + orb.offset) * height * 0.06;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, orb.radius * 2.3);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${0.04 * pulse})`);
            gradient.addColorStop(0.25, `rgba(255, 255, 255, ${0.02 * pulse})`);
            gradient.addColorStop(0.6, palette.orbGlow);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, orb.radius * 2.3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawShootingStars(time) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'lighter';

        shootingStars.forEach((star) => {
            star.timer += 1;
            if (star.timer > star.life) {
                if (Math.random() < 0.24) {
                    star.x = Math.random() * width - 200;
                    star.y = Math.random() * height + 20;
                    star.length = 80 + Math.random() * 120;
                    star.vx = 4 + Math.random() * 4;
                    star.vy = 0.6 + Math.random() * 1.2;
                    star.life = Math.random() * 120 + 70 + 30;
                    star.timer = 0;
                }
            }

            const progress = Math.sin((star.timer / star.life) * Math.PI);
            const trailLength = star.length * progress + 4000;
            const alpha = Math.max(0, Math.min(1, progress * 1.4));
            const x = star.x + star.vx * star.timer * 0.5;
            const y = star.y + star.vy * star.timer * 0.5;

            const gradient = ctx.createLinearGradient(star.x, star.y, x, y);
            gradient.addColorStop(0, 'rgba(255,255,255,0)');
            gradient.addColorStop(0.6, `rgba(255,255,255,${alpha * 0.33})`);
            gradient.addColorStop(1, `rgba(255,255,255,${alpha})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - star.vx * trailLength * 0.06, y - star.vy * trailLength * 0.06);
            ctx.stroke();
        });

        ctx.restore();
    }

    function drawParticles(time) {
        const palette = getThemePalette();
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        particles.forEach((particle, index) => {
            particle.x += particle.vx + Math.sin(time * 0.00025 + index) * particle.drift;
            particle.y += particle.vy + Math.cos(time * 0.00018 + index) * particle.drift;

            if (particle.x < -18 || particle.x > width + 18) particle.x = Math.random() * width;
            if (particle.y < -18 || particle.y > height + 18) particle.y = Math.random() * height;

            const twinkle = 0.12 + Math.sin(time * particle.twinkleSpeed + particle.twinkle) * 0.8;
            const fade = Math.min(1, particle.alpha + twinkle * 0.22);
            const size = particle.radius * particle.sizeFactor;
            const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size * 3);

            if (particle.type === 'star') {
                gradient.addColorStop(0, `rgba(255, 255, 255, ${fade})`);
                gradient.addColorStop(0.2, `${palette.starTrail}`);
                gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.06)');
            } else {
                gradient.addColorStop(0, `${palette.particleGlow}`);
                gradient.addColorStop(0.3, `${palette.particleSecondary}`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    function animate(time) {
        ctx.clearRect(0, 0, width, height);
        drawBackground(time);
        //drawLightning();
        drawOrbs(time);
        drawParticles(time);
        drawShootingStars(time);
        requestAnimationFrame(animate);
    }

    canvasHost.appendChild(canvas);
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(animate);
}