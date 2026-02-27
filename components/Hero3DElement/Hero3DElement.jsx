'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './Hero3DElement.module.css';

export default function Hero3DElement() {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 4;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        // Low resolution for that retro/raw vibe, scaled up via CSS
        renderer.setSize(300, 300);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // TorusKnot for a complex, tech-y shape
        const geometry = new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16);

        // Wireframe material matching the accent blue
        const material = new THREE.MeshBasicMaterial({
            color: '#2b00ff', // var(--accent)
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        let rafId;

        const render = () => {
            // Gentle rotation
            mesh.rotation.x += 0.002;
            mesh.rotation.y += 0.003;
            mesh.rotation.z += 0.001;

            renderer.render(scene, camera);
            rafId = requestAnimationFrame(render);
        };

        render();

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            renderer.dispose();
            if (material) material.dispose();
            if (geometry) geometry.dispose();
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className={styles.container} aria-hidden="true" />;
}
