'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './SpotifyTopArtists.module.css';

export default function ArtistEffect() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

    // 2D orthographic camera matches the plane exactly
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // We want a transparent background to overlay on the UI
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Set internal render resolution higher than CSS container
    const width = 450;
    const height = 450;
    renderer.setSize(width, height); 
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Scale canvas down via CSS to fit container exactly
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = 'auto';
    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    let rafId;
    let material;
    let geometry;

    textureLoader.load('/artist.png', (texture) => {
      // Ensure the image doesn't wrap oddly
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      // Geometry matches the orthogonal camera bounds
      geometry = new THREE.PlaneGeometry(2, 2);
      
      material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          tDiffuse: { value: texture },
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform float uTime;
          varying vec2 vUv;
          
          // Noise functions
          float hash(vec2 p) {
              vec3 p3  = fract(vec3(p.xyx) * 0.1031);
              p3 += dot(p3, p3.yzx + 33.33);
              return fract((p3.x + p3.y) * p3.z);
          }
          float noise(vec2 x) {
              vec2 p = floor(x);
              vec2 f = fract(x);
              f = f * f * (3.0 - 2.0 * f);
              return mix(mix(hash(p + vec2(0.0, 0.0)), hash(p + vec2(1.0, 0.0)), f.x),
                        mix(hash(p + vec2(0.0, 1.0)), hash(p + vec2(1.0, 1.0)), f.x), f.y);
          }

          void main() {
              // Since our canvas is wider than original (380x400) to give room for particles
              // We scale/shift UVs to map the texture to the left side
              vec2 texUv = vec2(vUv.x * 1.3 - 0.05, vUv.y);
              
              vec4 tex = vec4(0.0);
              if (texUv.x >= 0.0 && texUv.x <= 1.0) {
                  tex = texture2D(tDiffuse, texUv);
              }
              
              // Mask for dissipation effect (starts near the right edge of the image)
              float effectMask = smoothstep(0.4, 0.9, vUv.x);
              
              // Particle drifting wind
              vec2 flow = vec2(uTime * 0.25, sin(uTime * 0.15) * 0.05);
              
              // Noise fields
              float n1 = noise((vUv - flow) * 20.0);
              float n2 = noise((vUv - flow * 1.5) * 45.0);
              
              float particleNoise = n1 * 0.5 + n2 * 0.5;
              
              // Core blue / purple aesthetic
              vec3 particleColor = vec3(0.05, 0.2, 0.85); // deep bright blue
              vec4 finalColor = tex;
              
              if (effectMask > 0.0) {
                  // Erode the right side of the original image
                  float erosion = effectMask * noise((vUv + flow * 0.5) * 10.0);
                  finalColor.a *= (1.0 - clamp(erosion * 1.5, 0.0, 1.0));
                  
                  // Add glowing highlight particles on the image
                  if (tex.a > 0.1) {
                      float pMask = step(0.65, particleNoise) * effectMask;
                      finalColor.rgb = mix(finalColor.rgb, particleColor * 1.2, pMask);
                  }
                  
                  // Emit trailing particles to the empty right space
                  if (tex.a < 0.1 && vUv.x > 0.2) {
                      // Stricter threshold for floating particles
                      float tail = step(0.72 + (vUv.x - 0.5)*0.2, particleNoise); 
                      // Fade out smoothly at the far right edge
                      float alphaDrop = smoothstep(1.0, 0.85, vUv.x);
                      float pAlpha = tail * effectMask * alphaDrop * 0.7;
                      
                      finalColor += vec4(particleColor * pAlpha, pAlpha);
                  }
              }
              
              // Slightly crush contrast & tint to match the multiply-blend mood
              float lum = dot(finalColor.rgb, vec3(0.299, 0.587, 0.114));
              vec3 tinted = mix(finalColor.rgb, vec3(0.15, 0.15, 0.6) * lum, 0.4);
              finalColor.rgb = tinted;
              
              // Drop manual premultiply to avoid dark fringing/invisibility in WebGL
            // finalColor.rgb *= finalColor.a;
            
            gl_FragColor = finalColor;
        }
        `
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let t = 0;

      const render = () => {
        t += 0.02;
        material.uniforms.uTime.value = t;
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(render);
      };
      render();
    });

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

  return <div ref={mountRef} className={styles.artistCornerContainer} aria-hidden="true" />;
}
