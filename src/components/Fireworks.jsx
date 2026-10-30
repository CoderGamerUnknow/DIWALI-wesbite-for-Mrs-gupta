import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import styles from "./Fireworks.module.scss";

const COLORS = ["#ffd166", "#ffb703", "#ff8a3d", "#ff6f91", "#ffe6a3", "#7ce0c3", "#c9a2ff"];

export const Fireworks = forwardRef(function Fireworks({ className = "" }, ref) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  const burst = (x, y, options = {}) => {
    sceneRef.current?.burst(x, y, options);
  };

  const volley = () => {
    sceneRef.current?.volley();
  };

  useImperativeHandle(ref, () => ({ burst, volley }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = false;
    let lastAuto = 0;
    let nextAuto = 900;
    let particles = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const explode = (x, y, count = 46, scale = 1) => {
      if (!width || !height) return;
      const base = COLORS[Math.floor(Math.random() * COLORS.length)];
      const secondary = COLORS[Math.floor(Math.random() * COLORS.length)];
      const power = (2.4 + Math.random() * 2.6) * scale;

      for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = power * (0.35 + Math.random() * 0.85);
        const ttl = 44 + Math.random() * 46;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: ttl,
          ttl,
          color: Math.random() > 0.5 ? base : secondary,
          size: 0.9 + Math.random() * 1.8,
          gravity: 0.028 + Math.random() * 0.018,
          drag: 0.975 + Math.random() * 0.012,
        });
      }

      // A soft flash at the heart of the burst.
      particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        life: 13,
        ttl: 13,
        color: "#fff6dc",
        size: 7,
        gravity: 0,
        drag: 0.96,
      });

      if (particles.length > 900) {
        particles = particles.slice(-900);
      }
    };

    const randomBurst = (count = 34, scale = 0.85) => {
      explode(
        width * (0.16 + Math.random() * 0.68),
        height * (0.14 + Math.random() * 0.34),
        count,
        scale
      );
    };

    const scene = {
      burst: (x, y, { count = 44, scale = 1 } = {}) => explode(x, y, count, scale),
      volley: () => {
        const x = width / 2 || 300;
        const y = height * 0.36 || 160;
        explode(x, y, 64, 1.25);
        [180, 360, 540].forEach((delay, index) =>
          window.setTimeout(
            () =>
              explode(
                width * (0.25 + index * 0.22),
                height * (0.22 + (index % 2) * 0.18),
                46,
                1
              ),
            delay
          )
        );
      },
    };
    sceneRef.current = scene;

    const frame = (time) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      if (visible && time - lastAuto > nextAuto) {
        randomBurst();
        lastAuto = time;
        nextAuto = 1500 + Math.random() * 2100;
      }

      particles = particles.filter((particle) => particle.life > 1);

      particles.forEach((particle) => {
        particle.life -= 1;
        particle.vx *= particle.drag;
        particle.vy = particle.vy * particle.drag + particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const alpha = Math.max(0, particle.life / particle.ttl);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(
          particle.x - particle.vx * 2.4,
          particle.y - particle.vy * 2.4
        );
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = window.requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastAuto = 0;
      raf = window.requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };

    resize();

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.15 }
    );
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(canvas);

    const onCelebrate = () => {
      if (!visible) return;
      scene.volley();
    };
    window.addEventListener("diwali:celebrate", onCelebrate);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("diwali:celebrate", onCelebrate);
      sceneRef.current = null;
      particles = [];
    };
  }, []);

  return <canvas ref={canvasRef} className={`${styles.canvas} ${className}`.trim()} aria-hidden="true" />;
});
