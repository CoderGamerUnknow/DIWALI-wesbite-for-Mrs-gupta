import { useEffect, useRef, useState } from "react";
import { copyText } from "../../lib/lab";
import styles from "../LightLab.module.scss";

export function CopyButton({ text, label = "Copy", copiedLabel = "Copied ✓" }) {
  const [state, setState] = useState("idle");
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleCopy = async () => {
    window.clearTimeout(timerRef.current);
    const ok = await copyText(text);
    setState(ok ? "done" : "failed");
    timerRef.current = window.setTimeout(() => setState("idle"), 1800);
  };

  return (
    <button
      type="button"
      className={`${styles.miniButton} ${state === "done" ? styles.miniButtonDone : ""}`}
      onClick={handleCopy}
    >
      {state === "done" ? copiedLabel : state === "failed" ? "Copy failed" : label}
    </button>
  );
}

/**
 * A small canvas of sparks, used by the firework and sparkler features.
 * mode "burst" explodes on tap; "trail" follows the pointer.
 */
export function SparkPad({ mode = "burst", color = "#ffd166", hint = "" }) {
  const canvasRef = useRef(null);
  const colorRef = useRef(color);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
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

    const explode = (x, y, count = 30) => {
      if (!width || !height) return;
      const base = colorRef.current;
      const power = mode === "trail" ? 1.5 : 3.4;

      for (let index = 0; index < count; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = power * (0.35 + Math.random() * 0.9);
        const life = 650 + Math.random() * 650;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          ttl: life,
          color: Math.random() > 0.22 ? base : "#fff6dc",
          size: 0.9 + Math.random() * 1.7,
          gravity: 0.03,
          drag: 0.97,
        });
      }

      if (particles.length > 640) particles = particles.slice(-640);
    };

    const trail = (x, y) => {
      for (let index = 0; index < 3; index += 1) {
        const life = 380 + Math.random() * 420;
        particles.push({
          x: x + (Math.random() - 0.5) * 7,
          y: y + (Math.random() - 0.5) * 7,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6,
          life,
          ttl: life,
          color: Math.random() > 0.35 ? colorRef.current : "#fff6dc",
          size: 0.8 + Math.random() * 1.5,
          gravity: 0.012,
          drag: 0.985,
        });
      }
      if (particles.length > 640) particles = particles.slice(-640);
    };

    const frame = (time) => {
      const delta = Math.min(40, time - last);
      last = time;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      particles = particles.filter((particle) => particle.life > 0);
      particles.forEach((particle) => {
        particle.life -= delta;
        particle.vx *= particle.drag;
        particle.vy = particle.vy * particle.drag + particle.gravity;
        particle.x += (particle.vx * delta) / 16;
        particle.y += (particle.vy * delta) / 16;

        const alpha = Math.max(0, particle.life / particle.ttl);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x - particle.vx * 3, particle.y - particle.vy * 3);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = window.requestAnimationFrame(frame);
    };

    const onPointerDown = (event) => {
      const rect = canvas.getBoundingClientRect();
      explode(event.clientX - rect.left, event.clientY - rect.top, 40);
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      trail(event.clientX - rect.left, event.clientY - rect.top);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    raf = window.requestAnimationFrame(frame);

    if (mode === "burst") {
      canvas.addEventListener("pointerdown", onPointerDown);
    } else {
      canvas.addEventListener("pointermove", onPointerMove);
    }

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      particles = [];
    };
  }, [mode]);

  return (
    <div className={styles.sparkWrap}>
      <canvas
        ref={canvasRef}
        className={styles.sparkCanvas}
        aria-label={mode === "burst" ? "Tap to burst a firework" : "Move to draw sparks"}
      />
      {hint && <p className={styles.sparkHint}>{hint}</p>}
    </div>
  );
}
