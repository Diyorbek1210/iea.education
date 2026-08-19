import { useEffect, useRef, useState } from "react";

export type AvatarEmotion =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "happy"
  | "surprised";

interface AiAvatarProps {
  emotion: AvatarEmotion;
  size?: number;
}

const SEED = "wrua5c0x";

function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/10.x/toon-head/svg?seed=${encodeURIComponent(seed)}&size=200&eyesVariant=happy,wide,wink&clothesColor=0b3286,147f3c,ec4899&hairColor=000000&skinColor=b6e3f4,b98e6a&beardVariant=&clothesProbability=100&clothesVariant=dress`;
}

export function AiAvatar({ emotion, size = 200 }: AiAvatarProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const lookTimerRef = useRef<ReturnType<typeof setInterval>>(null);
  const lookFrameRef = useRef<number>(null);

  // Load the SVG and animate eyes
  useEffect(() => {
    fetch(getAvatarUrl(SEED))
      .then((r) => r.text())
      .then((svg) => {
        // Inject CSS animations into the SVG for eye blink and look-around
        const animatedSvg = svg
          .replace(
            "<svg ",
            `<svg style="overflow:visible" `,
          );
        setSvgContent(animatedSvg);
      })
      .catch(() => {
        // Fallback: use img tag
        setSvgContent("");
      });
  }, []);

  // Eye blink + look around animation on the loaded SVG
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

    // Find all circle/ellipse elements that could be eyes
    const ellipses = svg.querySelectorAll("ellipse");
    const circles = svg.querySelectorAll("circle");

    // Try to find eye whites (larger white ellipses in the eye area)
    const eyeWhites: SVGEllipseElement[] = [];
    ellipses.forEach((el) => {
      const fill = el.getAttribute("fill");
      const cy = parseFloat(el.getAttribute("cy") || "0");
      const rx = parseFloat(el.getAttribute("rx") || "0");
      const ry = parseFloat(el.getAttribute("ry") || "0");
      if (fill === "white" && ry > 5 && cy > 60 && cy < 110) {
        eyeWhites.push(el);
      }
    });

    // Find pupils (small dark circles in eye area)
    const pupils: SVGCircleElement[] = [];
    circles.forEach((el) => {
      const fill = el.getAttribute("fill");
      const cy = parseFloat(el.getAttribute("cy") || "0");
      const r = parseFloat(el.getAttribute("r") || "0");
      if ((fill === "#1A1A1A" || fill === "#000" || fill === "black") && r < 5 && cy > 60 && cy < 110) {
        pupils.push(el);
      }
    });

    // Blink animation
    const blink = () => {
      eyeWhites.forEach((eye) => {
        const origRy = parseFloat(eye.getAttribute("ry") || "9");
        eye.setAttribute("ry", "1");
        setTimeout(() => eye.setAttribute("ry", String(origRy)), 120);
      });
      blinkTimerRef.current = setTimeout(blink, 2000 + Math.random() * 3000);
    };
    blinkTimerRef.current = setTimeout(blink, 1500);

    // Look around animation
    let lookX = 0, lookY = 0, targetX = 0, targetY = 0;
    const pickTarget = () => {
      targetX = (Math.random() - 0.5) * 4;
      targetY = (Math.random() - 0.5) * 2;
    };
    pickTarget();
    lookTimerRef.current = setInterval(pickTarget, 2500);

    const animate = () => {
      lookX += (targetX - lookX) * 0.05;
      lookY += (targetY - lookY) * 0.05;
      pupils.forEach((p) => {
        const origCx = parseFloat(p.getAttribute("cx") || "0");
        const origCy = parseFloat(p.getAttribute("cy") || "0");
        p.setAttribute("cx", String(origCx + lookX));
        p.setAttribute("cy", String(origCy + lookY));
      });
      lookFrameRef.current = requestAnimationFrame(animate);
    };
    lookFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
      if (lookTimerRef.current) clearInterval(lookTimerRef.current);
      if (lookFrameRef.current) cancelAnimationFrame(lookFrameRef.current);
    };
  }, [svgContent]);

  const bodyAnim =
    emotion === "idle"
      ? "animate-[breathe_4s_ease-in-out_infinite]"
      : emotion === "listening"
        ? "animate-[lean-forward_2s_ease-in-out_infinite]"
        : emotion === "thinking"
          ? "animate-[tilt_3s_ease-in-out_infinite]"
          : emotion === "speaking"
            ? "animate-[speak-bounce_0.6s_ease-in-out_infinite]"
            : emotion === "happy"
              ? "animate-[celebrate_0.5s_ease-in-out_infinite]"
              : "";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {(emotion === "listening" || emotion === "speaking") && (
        <div
          className="absolute inset-0 rounded-full animate-pulse opacity-15"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
        />
      )}

      <div ref={containerRef} className={`relative ${bodyAnim}`}>
        {svgContent ? (
          <div
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{ width: size, height: size }}
            className="rounded-full"
          />
        ) : (
          <img
            src={getAvatarUrl(SEED)}
            alt="AI Teacher"
            width={size}
            height={size}
            className="rounded-full"
          />
        )}

        {/* Emotion particles */}
        {emotion === "happy" && (
          <span className="absolute -top-1 -right-1 text-sm animate-[float-up_1.5s_ease-in-out_infinite]">✨</span>
        )}
        {emotion === "thinking" && (
          <span className="absolute -top-2 right-0 text-xs animate-[float-up_2s_ease-in-out_infinite]">💭</span>
        )}
        {emotion === "speaking" && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot [animation-delay:0.4s]" />
          </div>
        )}
      </div>
    </div>
  );
}
