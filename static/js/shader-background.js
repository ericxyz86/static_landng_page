/**
 * AI Labs WebGL Shader Background
 * Creates an animated neural network-inspired background using WebGL shaders
 */

class AILabsShaderBackground {
    constructor(container, options = {}) {
        this.container = container;
        
        // AI Labs themed configuration
        this.color = options.color || [0.2, 0.6, 1.0]; // AI Labs blue-cyan
        this.speed = options.speed || 0.4; // Slower, more professional
        this.amplitude = options.amplitude || 0.08; // Subtle mouse interaction
        this.mouseReact = options.mouseReact !== false;
        this.complexity = options.complexity || 1.0; // For performance scaling
        
        this.mousePos = { x: 0.5, y: 0.5 };
        this.isWebGLSupported = false;
        this.animationId = null;
        
        this.checkWebGLSupport();
        if (this.isWebGLSupported) {
            this.init();
        }
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            this.isWebGLSupported = !!gl;
            canvas.remove();
        } catch (e) {
            this.isWebGLSupported = false;
        }
    }

    async init() {
        try {
            // Import OGL library with timeout
            const importPromise = import('https://cdn.skypack.dev/ogl');
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Import timeout')), 10000)
            );
            
            const { Renderer, Program, Mesh, Color, Triangle } = await Promise.race([
                importPromise, 
                timeoutPromise
            ]);
            
            this.Renderer = Renderer;
            this.Program = Program;
            this.Mesh = Mesh;
            this.Color = Color;
            this.Triangle = Triangle;
            
            this.setupRenderer();
            this.setupGeometry();
            this.setupEventListeners();
            this.resize();
            this.animate();
            
            console.info('WebGL shader background initialized successfully');
            
        } catch (error) {
            console.warn('Failed to load WebGL shader background:', error);
            this.fallbackToCSS();
        }
    }

    setupRenderer() {
        this.renderer = new this.Renderer({
            alpha: true,
            premultipliedAlpha: false,
            antialias: false, // Disable for better mobile performance
        });
        
        this.gl = this.renderer.gl;
        this.gl.clearColor(0, 0, 0, 0); // Transparent background
        
        // Style the canvas
        const canvas = this.gl.canvas;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'none';
        
        this.container.appendChild(canvas);
    }

    setupGeometry() {
        // AI Labs themed vertex shader
        const vertexShader = `
            attribute vec2 uv;
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 0, 1);
            }
        `;

        // AI Labs themed fragment shader with neural network patterns
        const fragmentShader = `
            precision highp float;
            uniform float uTime;
            uniform vec3 uColor;
            uniform vec3 uResolution;
            uniform vec2 uMouse;
            uniform float uAmplitude;
            uniform float uSpeed;
            uniform float uComplexity;
            varying vec2 vUv;
            
            // Noise function for organic movement
            float noise(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            // Neural network node function
            float neuralNode(vec2 p, float t) {
                float d = length(p);
                float pulse = sin(t * 2.0 + d * 10.0) * 0.5 + 0.5;
                return smoothstep(0.02, 0.0, d) * pulse;
            }
            
            void main() {
                float mr = min(uResolution.x, uResolution.y);
                vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
                
                // Mouse interaction (subtle)
                uv += (uMouse - vec2(0.5)) * uAmplitude * 0.5;
                
                float time = uTime * uSpeed;
                
                // Create flowing data streams
                float streams = 0.0;
                for (float i = 1.0; i <= 8.0 * uComplexity; i++) {
                    float freq = i * 0.5;
                    streams += sin(uv.x * freq + time + i) * cos(uv.y * freq * 0.8 + time * 0.7 + i * 2.0) / i;
                }
                
                // Neural network connections
                float connections = 0.0;
                vec2 grid = floor(uv * 6.0);
                vec2 gridUv = fract(uv * 6.0) - 0.5;
                
                // Create neural nodes at grid points
                for (float x = -1.0; x <= 1.0; x++) {
                    for (float y = -1.0; y <= 1.0; y++) {
                        vec2 nodePos = vec2(x, y) * 0.3;
                        float nodeOffset = noise(grid + vec2(x, y)) * 6.28;
                        nodePos += vec2(sin(time + nodeOffset), cos(time * 0.8 + nodeOffset)) * 0.1;
                        connections += neuralNode(gridUv - nodePos, time) * 0.8;
                    }
                }
                
                // Combine effects
                float pattern = streams * 0.3 + connections;
                
                // Create the final color with AI Labs palette
                vec3 baseColor = uColor;
                vec3 accentColor = vec3(0.0, 0.8, 1.0); // Cyan accent
                
                // Color mixing based on pattern intensity
                vec3 finalColor = mix(baseColor, accentColor, pattern * 0.5);
                finalColor *= (0.3 + pattern * 0.7); // Intensity modulation
                
                // Add subtle pulsing
                float pulse = sin(time * 0.5) * 0.1 + 0.9;
                finalColor *= pulse;
                
                // Fade edges for seamless blending
                float fadeX = smoothstep(0.0, 0.3, abs(uv.x));
                float fadeY = smoothstep(0.0, 0.3, abs(uv.y));
                float fade = (1.0 - fadeX) * (1.0 - fadeY);
                
                gl_FragColor = vec4(finalColor * fade, fade * 0.8);
            }
        `;

        const geometry = new this.Triangle(this.gl);
        this.program = new this.Program(this.gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new this.Color(...this.color) },
                uResolution: { value: new this.Color(1, 1, 1) },
                uMouse: { value: new Float32Array([0.5, 0.5]) },
                uAmplitude: { value: this.amplitude },
                uSpeed: { value: this.speed },
                uComplexity: { value: this.complexity },
            },
            transparent: true,
        });
        
        this.mesh = new this.Mesh(this.gl, { geometry, program: this.program });
    }

    setupEventListeners() {
        this.handleResize = this.resize.bind(this);
        this.handleMouseMove = this.onMouseMove.bind(this);
        this.handleVisibilityChange = this.onVisibilityChange.bind(this);
        
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('orientationchange', this.handleResize);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        if (this.mouseReact) {
            this.container.addEventListener('mousemove', this.handleMouseMove);
            this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
        }
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    setupPerformanceMonitoring() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        
        setInterval(() => {
            const now = performance.now();
            this.fps = this.frameCount / ((now - this.lastTime) / 1000);
            this.frameCount = 0;
            this.lastTime = now;
            
            // Reduce complexity if performance is poor
            if (this.fps < 30 && this.complexity > 0.5) {
                this.complexity *= 0.9;
                if (this.program) {
                    this.program.uniforms.uComplexity.value = this.complexity;
                }
            }
        }, 2000);
    }

    resize() {
        if (!this.renderer) return;
        
        const rect = this.container.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
        
        this.renderer.setSize(rect.width, rect.height, pixelRatio);
        
        if (this.program) {
            this.program.uniforms.uResolution.value = new this.Color(
                this.gl.canvas.width,
                this.gl.canvas.height,
                this.gl.canvas.width / this.gl.canvas.height
            );
        }
    }

    onMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        
        this.updateMousePosition(x, y);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1.0 - (touch.clientY - rect.top) / rect.height;
        
        this.updateMousePosition(x, y);
    }

    updateMousePosition(x, y) {
        this.mousePos = { x, y };
        if (this.program) {
            this.program.uniforms.uMouse.value[0] = x;
            this.program.uniforms.uMouse.value[1] = y;
        }
    }

    onVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    animate(t = 0) {
        if (!this.renderer || !this.program) return;
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.frameCount++;
        
        this.program.uniforms.uTime.value = t * 0.001;
        this.renderer.render({ scene: this.mesh });
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId && this.renderer) {
            this.animate();
        }
    }

    destroy() {
        this.pause();
        
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        if (this.mouseReact) {
            this.container.removeEventListener('mousemove', this.handleMouseMove);
        }
        
        if (this.gl && this.gl.canvas) {
            this.gl.canvas.remove();
        }
    }

    fallbackToCSS() {
        // Fallback is handled by CSS - the existing gradient background
        console.info('Using CSS gradient fallback for background');
    }

    // Update shader parameters (for dark mode, etc.)
    updateColor(newColor) {
        this.color = newColor;
        if (this.program) {
            this.program.uniforms.uColor.value = new this.Color(...newColor);
        }
    }

    updateSpeed(newSpeed) {
        this.speed = newSpeed;
        if (this.program) {
            this.program.uniforms.uSpeed.value = newSpeed;
        }
    }
}

// Global instance management
window.AILabsShaderBackground = AILabsShaderBackground;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        console.info('Reduced motion preferred, skipping shader background');
        return;
    }

    const shaderContainer = document.querySelector('.shader-background');
    if (shaderContainer) {
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        window.aiLabsShader = new AILabsShaderBackground(shaderContainer, {
            color: isDarkMode ? [0.1, 0.3, 0.6] : [0.2, 0.6, 1.0],
            speed: 0.4,
            amplitude: 0.08,
            complexity: window.innerWidth > 768 ? 1.0 : 0.6, // Reduce complexity on mobile
        });
    }
});

// Handle dark mode changes
if (typeof window !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const isDarkMode = document.documentElement.classList.contains('dark');
                if (window.aiLabsShader) {
                    window.aiLabsShader.updateColor(
                        isDarkMode ? [0.1, 0.3, 0.6] : [0.2, 0.6, 1.0]
                    );
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
}