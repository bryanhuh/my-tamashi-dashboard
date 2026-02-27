'use client';

import { useEffect, useRef } from 'react';
import styles from './HeroParticles.module.css';

export default function HeroParticles() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // We'll map the accent color (often blue/cobalt) for the particles
        // The CSS variable --accent might be #2b00ff

        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.0003,
            speedY: (Math.random() - 0.5) * 0.0003,
            opacity: Math.random() * 0.4 + 0.1,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2,
        }));

        let animationFrameId;

        const resize = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        let time = 0;

        const render = () => {
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            particles.forEach(p => {
                // Move
                p.x = (p.x + p.speedX + 1) % 1;
                p.y = (p.y + p.speedY + 1) % 1;

                // Twinkle
                const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(time * p.twinkleSpeed + p.twinklePhase));

                ctx.beginPath();
                ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);

                // Using a soft cobalt blue for the particles to match tamashi theme
                ctx.fillStyle = `rgba(43, 0, 255, ${currentOpacity})`;
                ctx.fill();
            });

            time++;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.particles} aria-hidden="true" />;
}
