import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import gsap from "gsap";
import { Diya } from "../components/Diya";
import { site } from "../const/site";
import styles from "./Share.module.scss";

const getPageUrl = () => {
  if (typeof window === "undefined") return "";
  const { origin, pathname } = window.location;
  const cleanPath = pathname.replace(/\/+$/, "");
  return `${origin}${cleanPath}`;
};

const drawSpacedText = (ctx, text, centerX, y, spacing, font, color) => {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  const characters = Array.from(text);
  const widths = characters.map((character) => ctx.measureText(character).width);
  const total =
    widths.reduce((sum, width) => sum + width, 0) + spacing * (characters.length - 1);
  let x = centerX - total / 2;
  characters.forEach((character, index) => {
    ctx.fillText(character, x, y);
    x += widths[index] + spacing;
  });
  ctx.restore();
};

const roundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

// A4 at 300 DPI.
const A4 = { width: 2480, height: 3508 };

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Largest size (down to `min`) that keeps `text` inside `maxWidth`. */
const fitFontSize = (ctx, text, weight, family, maxWidth, start, min = 120) => {
  let size = start;
  ctx.font = `${weight} ${size}px ${family}`;
  while (size > min && ctx.measureText(text).width > maxWidth) {
    size -= 4;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
};

/** A four-pointed spark, drawn as a path so it never depends on a font. */
const drawSpark = (ctx, cx, cy, radius) => {
  const inner = radius * 0.26;
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.quadraticCurveTo(cx + inner, cy - inner, cx + radius, cy);
  ctx.quadraticCurveTo(cx + inner, cy + inner, cx, cy + radius);
  ctx.quadraticCurveTo(cx - inner, cy + inner, cx - radius, cy);
  ctx.quadraticCurveTo(cx - inner, cy - inner, cx, cy - radius);
  ctx.closePath();
  ctx.fill();
};

/** A clay diya drawn in canvas, for the light A4 sheet. */
const drawPrintDiya = (ctx, cx, cy, scale) => {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  const halo = ctx.createRadialGradient(0, -60, 20, 0, -60, 260);
  halo.addColorStop(0, "rgba(255, 178, 70, 0.42)");
  halo.addColorStop(0.6, "rgba(255, 178, 70, 0.12)");
  halo.addColorStop(1, "rgba(255, 178, 70, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, -60, 260, 0, Math.PI * 2);
  ctx.fill();

  const flame = ctx.createLinearGradient(0, -215, 0, -32);
  flame.addColorStop(0, "#fff8de");
  flame.addColorStop(0.4, "#ffd166");
  flame.addColorStop(1, "#ef8a1e");
  ctx.fillStyle = flame;
  ctx.beginPath();
  ctx.moveTo(0, -215);
  ctx.bezierCurveTo(46, -148, 66, -108, 46, -70);
  ctx.bezierCurveTo(31, -42, 13, -32, 0, -32);
  ctx.bezierCurveTo(-13, -32, -31, -42, -46, -70);
  ctx.bezierCurveTo(-66, -108, -46, -148, 0, -215);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255, 253, 240, 0.9)";
  ctx.beginPath();
  ctx.moveTo(0, -168);
  ctx.bezierCurveTo(24, -128, 34, -104, 23, -82);
  ctx.bezierCurveTo(15, -64, 7, -58, 0, -58);
  ctx.bezierCurveTo(-7, -58, -15, -64, -23, -82);
  ctx.bezierCurveTo(-34, -104, -24, -128, 0, -168);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#4a2711";
  ctx.fillRect(-4, -40, 8, 26);

  ctx.fillStyle = "rgba(120, 72, 30, 0.16)";
  ctx.beginPath();
  ctx.ellipse(0, 36, 205, 34, 0, 0, Math.PI * 2);
  ctx.fill();

  const bowl = ctx.createLinearGradient(-160, -10, 160, 100);
  bowl.addColorStop(0, "#e0aa63");
  bowl.addColorStop(0.45, "#a45c2a");
  bowl.addColorStop(1, "#6b3517");
  ctx.fillStyle = bowl;
  ctx.beginPath();
  ctx.moveTo(-172, 0);
  ctx.bezierCurveTo(-150, 74, -84, 108, 0, 108);
  ctx.bezierCurveTo(84, 108, 150, 74, 172, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#e8b264";
  ctx.beginPath();
  ctx.ellipse(0, 0, 172, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#41200f";
  ctx.beginPath();
  ctx.ellipse(0, 3, 134, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 226, 171, 0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 168, 27, 0, Math.PI * 0.08, Math.PI * 0.92);
  ctx.stroke();

  ctx.restore();
};

/**
 * The printable card. Deliberately light: a dark A4 page wastes ink and smudges
 * on home printers, so the sheet is cream with wine and gold type.
 */
const drawPrintSheet = (ctx, qrImage, pageUrl) => {
  const { width, height } = A4;
  const display = '"Cinzel Decorative", Georgia, "Times New Roman", serif';
  const body = '"Outfit", "Segoe UI", Arial, sans-serif';
  const hindiFamily = '"Tiro Devanagari Hindi", "Nirmala UI", serif';

  const paper = ctx.createLinearGradient(0, 0, width, height);
  paper.addColorStop(0, "#fffcf2");
  paper.addColorStop(0.55, "#fdf2e0");
  paper.addColorStop(1, "#f8e8d0");
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, width, height);

  const warmth = ctx.createRadialGradient(1240, 980, 100, 1240, 980, 1500);
  warmth.addColorStop(0, "rgba(255, 205, 110, 0.24)");
  warmth.addColorStop(0.55, "rgba(255, 205, 110, 0.07)");
  warmth.addColorStop(1, "rgba(255, 205, 110, 0)");
  ctx.fillStyle = warmth;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(184, 137, 47, 0.14)";
  ctx.lineWidth = 2;
  [420, 540, 660, 780].forEach((radius) => {
    ctx.beginPath();
    ctx.arc(1240, 1080, radius, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.strokeStyle = "#c1974a";
  ctx.lineWidth = 7;
  ctx.strokeRect(110, 110, width - 220, height - 220);
  ctx.strokeStyle = "rgba(193, 151, 74, 0.35)";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(148, 148, width - 296, height - 296);

  ctx.strokeStyle = "#b8892f";
  ctx.lineWidth = 4;
  [
    [110, 110, 1, 1],
    [width - 110, 110, -1, 1],
    [110, height - 110, 1, -1],
    [width - 110, height - 110, -1, -1],
  ].forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x + 104 * sx, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + 104 * sy);
    ctx.stroke();
  });

  drawPrintDiya(ctx, 1240, 540, 1.15);

  drawSpacedText(
    ctx,
    "THE FESTIVAL OF LIGHTS",
    1240,
    800,
    10,
    `500 44px ${body}`,
    "#a06a1c"
  );

  const titleSize = Math.min(
    fitFontSize(ctx, "Happy", 700, display, 1960, 304),
    fitFontSize(ctx, "Diwali", 700, display, 1960, 304)
  );
  const titleFill = ctx.createLinearGradient(0, 880, 0, 1420);
  titleFill.addColorStop(0, "#5b1b2c");
  titleFill.addColorStop(1, "#7d2a26");
  ctx.textAlign = "center";
  ctx.fillStyle = titleFill;
  ctx.fillText("Happy", 1240, 1060);
  ctx.fillText("Diwali", 1240, 1060 + Math.round(titleSize * 0.98));

  const hindiSize = fitFontSize(ctx, "शुभ दीपावली", 400, hindiFamily, 1300, 92, 60);
  ctx.fillStyle = "#b8791d";
  ctx.font = `400 ${hindiSize}px ${hindiFamily}`;
  ctx.fillText("शुभ दीपावली", 1240, 1500);

  ctx.strokeStyle = "rgba(184, 137, 47, 0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(1010, 1582);
  ctx.lineTo(1470, 1582);
  ctx.stroke();
  ctx.fillStyle = "#b8892f";
  drawSpark(ctx, 1240, 1583, 18);

  ctx.save();
  ctx.shadowColor = "rgba(90, 45, 12, 0.18)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 24;
  ctx.fillStyle = "#fffdf8";
  roundedRect(ctx, 700, 1650, 1080, 1080, 30);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "#c1974a";
  ctx.lineWidth = 3;
  roundedRect(ctx, 700, 1650, 1080, 1080, 30);
  ctx.stroke();
  ctx.strokeStyle = "rgba(184, 137, 47, 0.3)";
  ctx.lineWidth = 1.5;
  roundedRect(ctx, 726, 1676, 1028, 1028, 22);
  ctx.stroke();

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(qrImage, 770, 1720, 940, 940);

  drawSpacedText(
    ctx,
    "SCAN TO OPEN THE WISH",
    1240,
    2850,
    12,
    `500 50px ${body}`,
    "#8a5a14"
  );

  drawSpacedText(
    ctx,
    `FOR ${site.principalShort.toUpperCase()} · ${site.diwaliLabel.toUpperCase()}`,
    1240,
    2942,
    7,
    `500 42px ${body}`,
    "#6b3a2a"
  );

  ctx.fillStyle = "rgba(184, 137, 47, 0.55)";
  [-92, -46, 0, 46, 92].forEach((offset) =>
    drawSpark(ctx, 1240 + offset, 3040, 9)
  );

  drawSpacedText(
    ctx,
    `WITH LOVE, FROM ${site.letter.signature.toUpperCase()}`,
    1240,
    3140,
    8,
    `400 34px ${body}`,
    "#9a7a52"
  );

  ctx.fillStyle = "rgba(122, 90, 58, 0.7)";
  ctx.font = '26px "SFMono-Regular", Consolas, "Liberation Mono", monospace';
  ctx.fillText(pageUrl.replace(/^https?:\/\//, ""), 1240, 3225);
};

export function Share() {
  const sectionRef = useRef(null);
  const qrRef = useRef(null);
  const printQrRef = useRef(null);
  const [pageUrl, setPageUrl] = useState(getPageUrl);
  const [isLocal, setIsLocal] = useState(false);
  const [busy, setBusy] = useState("");
  const [feedback, setFeedback] = useState("");
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setPageUrl(getPageUrl());
    setIsLocal(
      /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)
    );
    setCanShare(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(""), 3200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-share-copy] > *", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-share-copy]", start: "top 80%" },
      });

      gsap.from("[data-share-card]", {
        opacity: 0,
        y: 46,
        rotate: 2,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-share-card]", start: "top 84%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setFeedback("Link copied. Share the light.");
    } catch {
      const helper = document.createElement("textarea");
      helper.value = pageUrl;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      try {
        document.execCommand("copy");
        setFeedback("Link copied. Share the light.");
      } catch {
        setFeedback("Select the link above to copy it.");
      }
      helper.remove();
    }
  };

  const shareLink = async () => {
    try {
      await navigator.share({
        title: `Happy Diwali, ${site.principalShort} — A Wish From Your Students`,
        text: "A handmade Diwali wish from your students.",
        url: pageUrl,
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        setFeedback("The share sheet didn't open. Try copying the link.");
      }
    }
  };

  const downloadCard = async () => {
    const qrCanvas = qrRef.current?.querySelector("canvas");
    if (!qrCanvas) return;

    setBusy("card");
    setFeedback("");

    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const qrImage = await loadImage(qrCanvas.toDataURL("image/png"));

      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1528;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      const background = ctx.createLinearGradient(0, 0, 1080, 1528);
      background.addColorStop(0, "#09040f");
      background.addColorStop(0.5, "#180a24");
      background.addColorStop(1, "#2b0c1d");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, 1080, 1528);

      const glow = ctx.createRadialGradient(540, 390, 40, 540, 390, 700);
      glow.addColorStop(0, "rgba(244, 201, 93, 0.22)");
      glow.addColorStop(0.55, "rgba(244, 130, 50, 0.07)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 1080, 1528);

      ctx.strokeStyle = "rgba(244, 201, 93, 0.09)";
      ctx.lineWidth = 1;
      [220, 290, 360, 430].forEach((radius) => {
        ctx.beginPath();
        ctx.arc(540, 340, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      for (let index = 0; index < 120; index += 1) {
        const x = ((index * 173.7) % 1010) + 35;
        const y = ((index * 97.3) % 1440) + 30;
        const radius = index % 11 === 0 ? 1.7 : 0.9;
        ctx.globalAlpha = 0.2 + ((index * 7) % 50) / 100;
        ctx.fillStyle = index % 3 === 0 ? "#ffe6a3" : "#fff7e8";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = "rgba(244, 201, 93, 0.7)";
      ctx.lineWidth = 2;
      ctx.strokeRect(44, 44, 992, 1440);
      ctx.strokeStyle = "rgba(244, 201, 93, 0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(62, 62, 956, 1404);

      // Corner flourishes.
      ctx.strokeStyle = "rgba(255, 230, 163, 0.8)";
      ctx.lineWidth = 3;
      [
        [44, 44, 1, 1],
        [1036, 44, -1, 1],
        [44, 1484, 1, -1],
        [1036, 1484, -1, -1],
      ].forEach(([x, y, sx, sy]) => {
        ctx.beginPath();
        ctx.moveTo(x + 46 * sx, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + 46 * sy);
        ctx.stroke();
      });

      drawSpacedText(
        ctx,
        "✦  THE FESTIVAL OF LIGHTS  ✦",
        540,
        150,
        5,
        "500 22px Outfit, Arial, sans-serif",
        "#f4c95d"
      );

      ctx.textAlign = "center";
      ctx.fillStyle = "#ffe6a3";
      ctx.font = '700 124px "Cinzel Decorative", Georgia, serif';
      ctx.fillText("Happy", 540, 340);
      ctx.fillText("Diwali", 540, 476);

      ctx.fillStyle = "#f4c95d";
      ctx.font = '400 40px "Tiro Devanagari Hindi", Georgia, serif';
      ctx.fillText("शुभ दीपावली", 540, 556);

      ctx.strokeStyle = "rgba(244, 201, 93, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(390, 600);
      ctx.lineTo(690, 600);
      ctx.stroke();
      ctx.fillStyle = "#f4c95d";
      ctx.font = '20px Georgia, serif';
      ctx.fillText("✦", 540, 608);

      drawSpacedText(
        ctx,
        `A WISH FOR ${site.principalShort.toUpperCase()}`,
        540,
        654,
        3.4,
        "500 22px Outfit, Arial, sans-serif",
        "rgba(255, 247, 232, 0.68)"
      );

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 22;
      ctx.fillStyle = "#fff8ea";
      roundedRect(ctx, 278, 700, 524, 524, 26);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = "rgba(180, 118, 35, 0.28)";
      ctx.lineWidth = 2;
      roundedRect(ctx, 290, 712, 500, 500, 20);
      ctx.stroke();

      ctx.drawImage(qrImage, 320, 742, 440, 440);

      drawSpacedText(
        ctx,
        "SCAN TO OPEN THE WISH",
        540,
        1282,
        4.5,
        "500 22px Outfit, Arial, sans-serif",
        "#f4c95d"
      );

      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255, 247, 232, 0.52)";
      ctx.font = "300 23px Outfit, Arial, sans-serif";
      ctx.fillText("WITH LOVE, FROM", 540, 1350);

      ctx.fillStyle = "#ffe6a3";
      ctx.font = '700 34px "Cinzel Decorative", Georgia, serif';
      ctx.fillText("Your Students", 540, 1398);

      drawSpacedText(
        ctx,
        `${site.diwaliLabel.toUpperCase()}  ·  DIWALI ${site.year}`,
        540,
        1450,
        4,
        "400 17px Outfit, Arial, sans-serif",
        "rgba(255, 247, 232, 0.4)"
      );

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Could not create the card");

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `happy-diwali-wish-for-${slugify(site.principalShort)}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);

      setFeedback("Card downloaded. Send it, print it, keep it.");
    } catch {
      setFeedback("The card couldn't be prepared. Please try again.");
    } finally {
      setBusy("");
    }
  };

  const downloadPrintSheet = async () => {
    const qrCanvas = printQrRef.current?.querySelector("canvas");
    if (!qrCanvas) return;

    setBusy("sheet");
    setFeedback("");

    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const qrImage = await loadImage(qrCanvas.toDataURL("image/png"));

      const canvas = document.createElement("canvas");
      canvas.width = A4.width;
      canvas.height = A4.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      drawPrintSheet(ctx, qrImage, pageUrl);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) throw new Error("Could not create the sheet");

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `diwali-print-sheet-for-${slugify(site.principalShort)}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);

      setFeedback("A4 sheet ready — print it at 100% (Actual size) on A4 paper.");
    } catch {
      setFeedback("The print sheet couldn't be prepared. Please try again.");
    } finally {
      setBusy("");
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `A Diwali wish for ${site.principalShort}, from your students.\n${pageUrl}`
  )}`;

  return (
    <section className={`section ${styles.share}`} id="share" ref={sectionRef}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy} data-share-copy>
          <p className="eyebrow">One last thing</p>
          <h2 className="section-title">
            Take the light
            <br />
            <em>with you.</em>
          </h2>
          <p className={`lead ${styles.lead}`}>
            This page is the card. But if you would like something you can print,
            forward, or keep on the fridge — we made that too.
          </p>

          <ul className={styles.steps}>
            <li>
              <span className={styles.stepNumber}>01</span>
              <div>
                <strong>Scan the QR</strong>
                <p>Point any phone camera at the code and the wish opens.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>02</span>
              <div>
                <strong>Share the link</strong>
                <p>Send it to someone whose Diwali deserves a little more light.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>03</span>
              <div>
                <strong>Keep the card</strong>
                <p>
                  Save the card for screens — or a light A4 sheet you can print
                  and hand over.
                </p>
              </div>
            </li>
          </ul>

          <div className={styles.actions}>
            <button
              type="button"
              className="btn"
              onClick={downloadCard}
              disabled={Boolean(busy)}
            >
              {busy === "card" ? "Preparing card…" : "Download the card"}
              <span aria-hidden="true">↓</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={downloadPrintSheet}
              disabled={Boolean(busy)}
            >
              {busy === "sheet" ? "Preparing sheet…" : "Print sheet (A4)"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={copyLink}>
              Copy link
            </button>
            <a
              className="text-link"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
              <span aria-hidden="true">↗</span>
            </a>
            {canShare && (
              <button type="button" className="text-link" onClick={shareLink}>
                Share
                <span aria-hidden="true">↗</span>
              </button>
            )}
          </div>

          <p className={styles.feedback} role="status">
            {feedback}
          </p>

          <p className={styles.url} title={pageUrl}>
            {pageUrl}
          </p>

          {isLocal && (
            <p className={styles.hint}>
              You&apos;re previewing locally — the QR points to this local address.
              Open the deployed site before downloading the card for the principal.
            </p>
          )}
        </div>

        <div className={styles.cardWrap}>
          <div className={styles.card} data-share-card>
            <span className={styles.cardTopDiya} aria-hidden="true">
              <Diya lit />
            </span>
            <p className={styles.cardKicker}>With love, from your students</p>
            <h3 className={styles.cardTitle}>
              Happy
              <br />
              <em>Diwali</em>
            </h3>
            <p className={`${styles.cardHindi} hindi`} lang="hi">शुभ दीपावली</p>

            <div
              className={styles.qrFrame}
              ref={qrRef}
              role="img"
              aria-label={`QR code that opens ${pageUrl}`}
            >
              {pageUrl && (
                <QRCodeCanvas
                  value={pageUrl}
                  size={480}
                  level="H"
                  marginSize={2}
                  bgColor="#fff8ea"
                  fgColor="#170a12"
                  title="QR code to open the Diwali wish"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              )}
            </div>

            <p className={styles.scanHint}>Scan to open the wish</p>
            <p className={styles.cardFor}>
              For {site.principalShort} · {site.diwaliLabel}
            </p>

            <span className={styles.cardBottomGarland} aria-hidden="true">
              ✦ ✦ ✦ ✦ ✦
            </span>
          </div>

          <p className={styles.cardNote}>
            The QR is generated live, so it always points to this page.
          </p>
        </div>
      </div>

      {pageUrl && (
        <div className={styles.printQr} ref={printQrRef} aria-hidden="true">
          <QRCodeCanvas
            value={pageUrl}
            size={1200}
            level="H"
            marginSize={2}
            bgColor="#fffdf8"
            fgColor="#241005"
          />
        </div>
      )}
    </section>
  );
}
