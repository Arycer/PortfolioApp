import React, {useEffect, useRef} from 'react';
import {Star, ShootingStar} from '../../types';

const StarBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const shootingStarsRef = useRef<ShootingStar[]>([]);
    const animationFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const shootingStarTimerRef = useRef<number>(0);

    // Función para registrar un mensaje en la consola
    useEffect(() => {
        console.log("StarBackground component mounted");

        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas element not found");
            return;
        }

        console.log("Canvas dimensions:", canvas.width, "x", canvas.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Cannot get 2D context from canvas");
            return;
        }

        // Colores posibles para las estrellas
        const starColors = [
            'rgb(255, 255, 255)', // Blanco
            'rgb(255, 255, 240)', // Blanco cálido
            'rgb(240, 240, 255)', // Blanco frío
            'rgb(255, 240, 230)', // Amarillento
            'rgb(230, 240, 255)'  // Azulado
        ];

        // Función para crear estrellas
        const createStars = (count: number): Star[] => {
            console.log(`Creating ${count} stars`);
            const stars: Star[] = [];
            for (let i = 0; i < count; i++) {
                // Distribución más natural con más estrellas pequeñas
                const sizeRand = Math.random();
                let size;

                if (sizeRand < 0.85) {
                    // 85% de estrellas pequeñas
                    size = Math.random() * 0.8 + 0.2;
                } else if (sizeRand < 0.97) {
                    // 12% de estrellas medianas
                    size = Math.random() * 0.7 + 0.8;
                } else {
                    // 3% de estrellas grandes
                    size = Math.random() * 1.0 + 1.5;
                }

                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size,
                    speed: Math.random() * 0.02 + 0.005,
                    opacity: Math.random() * 0.5 + 0.3,
                    twinkleSpeed: Math.random() * 0.01 + 0.003,
                    twinkleDirection: Math.random() > 0.5,
                    color: starColors[Math.floor(Math.random() * starColors.length)]
                });
            }
            return stars;
        };

        // Función para crear una estrella fugaz
        const createShootingStar = (): ShootingStar => {
            const angle = Math.PI * (Math.random() * 0.2 + 0.15); // Ángulo entre 15 y 35 grados
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height / 3), // Solo en la parte superior
                length: Math.random() * 80 + 50,
                speed: Math.random() * 10 + 15,
                opacity: 1,
                angle, // Ángulo de descenso
                life: 0,
                maxLife: Math.random() * 70 + 80
            };
        };

        // Función para redimensionar el canvas
        const resizeCanvas = () => {
            console.log("Resizing canvas to window dimensions");
            // Asegurarse de que el canvas tenga el tamaño correcto de la ventana
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            console.log("New canvas dimensions:", canvas.width, "x", canvas.height);

            // Ajustar número de estrellas según tamaño de pantalla y densidad de píxeles
            const pixelRatio = window.devicePixelRatio || 1;
            const starCount = Math.min(
                Math.floor((canvas.width * canvas.height) / (pixelRatio <= 1 ? 5000 : 7000)),
                1500 // Máximo de estrellas para evitar problemas de rendimiento
            );

            starsRef.current = createStars(starCount);
            shootingStarsRef.current = [];
        };

        // Inicializar el canvas y crear estrellas
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Función de animación
        const animate = (timestamp: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            const deltaTime = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Actualizar temporizador de estrellas fugaces
            shootingStarTimerRef.current += deltaTime;
            if (shootingStarTimerRef.current > 4000 && Math.random() < 0.1) { // Aproximadamente cada 4 segundos con 10% de probabilidad
                shootingStarsRef.current.push(createShootingStar());
                shootingStarTimerRef.current = 0;
            }

            // Dibujar estrellas normales
            starsRef.current.forEach(star => {
                // Actualizar posición con un movimiento muy lento (efecto de paralaje)
                star.y += star.speed * (deltaTime / 16); // Normalizado para ~60fps
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }

                // Efecto de parpadeo
                if (star.twinkleDirection) {
                    star.opacity += star.twinkleSpeed * (deltaTime / 16);
                    if (star.opacity >= 0.8) {
                        star.twinkleDirection = false;
                    }
                } else {
                    star.opacity -= star.twinkleSpeed * (deltaTime / 16);
                    if (star.opacity <= 0.3) {
                        star.twinkleDirection = true;
                    }
                }

                // Dibujar estrella
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = star.color.replace('rgb', 'rgba').replace(')', `, ${star.opacity})`);
                ctx.fill();

                // Brillo alrededor de estrellas más grandes
                if (star.size > 1.2) {
                    const glow = ctx.createRadialGradient(
                        star.x, star.y, 0,
                        star.x, star.y, star.size * 4
                    );
                    const colorBase = star.color.replace('rgb', 'rgba').replace(')', ', ');
                    glow.addColorStop(0, `${colorBase}${star.opacity * 0.7})`);
                    glow.addColorStop(1, `${colorBase}0)`);

                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
                    ctx.fillStyle = glow;
                    ctx.fill();
                }
            });

            // Actualizar y dibujar estrellas fugaces
            shootingStarsRef.current = shootingStarsRef.current.filter(shootingStar => {
                shootingStar.life += deltaTime / 16;

                if (shootingStar.life > shootingStar.maxLife) {
                    return false;
                }

                // Calcular opacidad basada en la vida
                const lifeRatio = shootingStar.life / shootingStar.maxLife;
                let opacity;

                if (lifeRatio < 0.2) {
                    // Fade in
                    opacity = lifeRatio * 5;
                } else if (lifeRatio > 0.8) {
                    // Fade out
                    opacity = (1 - lifeRatio) * 5;
                } else {
                    opacity = 1;
                }

                shootingStar.opacity = opacity;

                // Actualizar posición
                shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
                shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;

                // Dibujar estela
                ctx.beginPath();
                ctx.moveTo(shootingStar.x, shootingStar.y);

                const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
                const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

                ctx.lineTo(tailX, tailY);

                const gradient = ctx.createLinearGradient(
                    shootingStar.x, shootingStar.y,
                    tailX, tailY
                );

                gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                return true;
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Iniciar animación
        animationFrameRef.current = requestAnimationFrame(animate);

        // Limpiar al desmontar
        return () => {
            console.log("StarBackground component unmounting, cleaning up");
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    // Agregar log en consola cuando se renderiza el componente
    console.log("Rendering StarBackground component");

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            style={{
                backgroundColor: 'transparent',
                zIndex: 0,
                opacity: 1
            }}
            aria-hidden="true"
        />
    );
};

export default StarBackground; 