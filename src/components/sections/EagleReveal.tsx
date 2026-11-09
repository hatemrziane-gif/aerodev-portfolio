
"use client";

import { useEffect, useId, useRef, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/* ---------------------------------- */
/* Configuration                      */
/* ---------------------------------- */

const DESKTOP = {
  width: 1672,
  height: 941,
  portrait: "/images/hero/portrait-desk.png",
  eagle: "/images/hero/eagle-desk.png",
  revealStrokeWidth: 1200,
};

const MOBILE = {
  width: 941,
  height: 1672,
  portrait: "/images/hero/portrait-mob.png",
  eagle: "/images/hero/eagle-mob.png",
  revealStrokeWidth: 1600,
};

const TRIANGLE_COUNT = 8;
const LINE_COLOR = "#C8A45D";

const REVEAL_STORAGE_KEY = "aerodev-eagle-reveal-completed";

const BOUNDARY_LENGTH = 260;
const BOUNDARY_OPACITY = 0.75;
const BOUNDARY_STROKE_WIDTH = 1.2;
const BOUNDARY_DRAW_DURATION = 0.45;

const MERGED_LINE_OPACITY = 1 - (1 - BOUNDARY_OPACITY) ** 2;

const CENTER_OPACITY = 0.35;
const CENTER_STROKE_WIDTH = 0.7;

const REVEAL_DURATION = 0.45;

const ROTATION_STEP_DURATION = 2.2;
const ROTATION_PAUSE_DURATION = 0.3;
const ROTATION_STEP_ANGLE = 180;
const ROTATION_COUNT = 2;

const FIRST_REVEAL_ORDER = [0, 2, 4, 6];

const REMAINING_REVEAL_ORDER = Array.from(
  { length: TRIANGLE_COUNT },
  (_, index) => index,
).filter((index) => !FIRST_REVEAL_ORDER.includes(index));

const SHRINK_DURATION = 0.5;
const COLLAPSE_DURATION = 1.1;
const LINE_DISAPPEAR_DURATION = 0.55;

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

type Point = {
  x: number;
  y: number;
};

type EagleRevealProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  onRevealComplete: () => void;
};

type TriangleCollapseState = {
  firstX: number;
  firstY: number;
  secondX: number;
  secondY: number;
  outer: number;
};

/* ---------------------------------- */
/* Geometry helpers                   */
/* ---------------------------------- */

function getBoundaryPoint(
  angle: number,
  width: number,
  height: number,
): Point {
  const centerX = width / 2;
  const centerY = height / 2;

  const dx = Math.cos(angle);
  const dy = Math.sin(angle);

  const distanceX =
    Math.abs(dx) < 0.000001 ? Infinity : width / 2 / Math.abs(dx);

  const distanceY =
    Math.abs(dy) < 0.000001 ? Infinity : height / 2 / Math.abs(dy);

  const distance = Math.min(distanceX, distanceY);

  const x = centerX + dx * distance;
  const y = centerY + dy * distance;

  const normalize = (value: number, max: number) => {
    if (Math.abs(value) < 0.000001) return 0;

    if (Math.abs(value - max) < 0.000001) {
      return max;
    }

    return Number(value.toFixed(6));
  };

  return {
    x: normalize(x, width),
    y: normalize(y, height),
  };
}

function getMidpoint(a: Point, b: Point): Point {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function getShortBoundaryPoint(
  point: Point,
  centerX: number,
  centerY: number,
): Point {
  const dx = point.x - centerX;
  const dy = point.y - centerY;

  const length = Math.sqrt(dx * dx + dy * dy);

  return {
    x: centerX + (dx / length) * BOUNDARY_LENGTH,
    y: centerY + (dy / length) * BOUNDARY_LENGTH,
  };
}

function polygonPoints(
  center: Point,
  first: Point,
  second: Point,
) {
  return [
    `${center.x},${center.y}`,
    `${first.x},${first.y}`,
    `${second.x},${second.y}`,
  ].join(" ");
}

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

export default function EagleReveal({
  sectionRef,
  overlayRef,
  contentRef,
  onRevealComplete,
}: EagleRevealProps) {
  const uniqueId = useId();

  const [isMobile, setIsMobile] = useState(false);
  const [isScreenReady, setIsScreenReady] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  const rotatingHolesRef = useRef<SVGGElement>(null);
  const rotatingBoundariesRef = useRef<SVGGElement>(null);

  const remainingHolesRef = useRef<SVGGElement>(null);
  const remainingBoundariesRef = useRef<SVGGElement>(null);

  const eagleMaskBaseRef = useRef<SVGRectElement>(null);

  const completionCallbackRef = useRef(onRevealComplete);

  const animationStartedRef = useRef(false);

  useEffect(() => {
    completionCallbackRef.current = onRevealComplete;
  }, [onRevealComplete]);

  /* ---------------------------------- */
  /* Responsive detection               */
  /* ---------------------------------- */

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1199px)");

    let readyFrame = 0;

    const updateScreen = () => {
      // Hide SVG while changing its configuration.
      setIsScreenReady(false);

      // Select the correct device configuration.
      setIsMobile(mediaQuery.matches);

      // Reveal SVG after React applies the new configuration.
      cancelAnimationFrame(readyFrame);

      readyFrame = requestAnimationFrame(() => {
        setIsScreenReady(true);
      });
    };

    updateScreen();

    mediaQuery.addEventListener("change", updateScreen);

    return () => {
      cancelAnimationFrame(readyFrame);
      mediaQuery.removeEventListener("change", updateScreen);
    };
  }, []);

  /* ---------------------------------- */
  /* Responsive configuration           */
  /* ---------------------------------- */

  const config = isMobile ? MOBILE : DESKTOP;

  const WIDTH = config.width;
  const HEIGHT = config.height;

  const CENTER_X = WIDTH / 2;
  const CENTER_Y = HEIGHT / 2;

  /* ---------------------------------- */
  /* Image dimensions                   */
  /* ---------------------------------- */

  const portraitWidth = isMobile ? 891 : 1504;
  const portraitHeight = isMobile ? 1200 : 800;

  const portraitY = isMobile
    ? HEIGHT - portraitHeight - 180
    : HEIGHT - portraitHeight;

  const portraitX = isMobile ? 117 : 100;

  const eagleOriginalWidth = isMobile ? 941 : 1504;
  const eagleOriginalHeight = isMobile ? 1672 : 900;

  const EAGLE_SCALE = 0.92;

  const eagleWidth = eagleOriginalWidth * EAGLE_SCALE;
  const eagleHeight = eagleOriginalHeight * EAGLE_SCALE;

  const eagleX =
    (isMobile ? 0 : 65) +
    (eagleOriginalWidth - eagleWidth) / 2;

  const eagleY = HEIGHT - eagleHeight;

  /* ---------------------------------- */
  /* Generate geometry                  */
  /* ---------------------------------- */

  const points = Array.from(
    { length: TRIANGLE_COUNT },
    (_, index) => {
      const angle = (index / TRIANGLE_COUNT) * Math.PI * 2;

      return getBoundaryPoint(angle, WIDTH, HEIGHT);
    },
  );

  const triangles = points.map((point, index) => {
    const nextPoint = points[(index + 1) % TRIANGLE_COUNT];

    const midpoint = getMidpoint(point, nextPoint);

    return {
      index,
      polygon: polygonPoints(
        { x: CENTER_X, y: CENTER_Y },
        point,
        nextPoint,
      ),
      midpoint,
    };
  });

  /* ---------------------------------- */
  /* GSAP animation                     */
  /* ---------------------------------- */

  useGSAP(
    () => {
      if (!isScreenReady) return;

      let timeline: gsap.core.Timeline | null = null;
      let frame = 0;

      let handleWheel: ((event: WheelEvent) => void) | null = null;
      let handleTouchStart: ((event: TouchEvent) => void) | null = null;
      let handleTouchMove: ((event: TouchEvent) => void) | null = null;
      let handleScroll: (() => void) | null = null;

      let touchStartY = 0;

      const removeStartListeners = () => {
        if (handleWheel) {
          window.removeEventListener("wheel", handleWheel);
        }

        if (handleTouchStart) {
          window.removeEventListener("touchstart", handleTouchStart);
        }

        if (handleTouchMove) {
          window.removeEventListener("touchmove", handleTouchMove);
        }

        if (handleScroll) {
          window.removeEventListener("scroll", handleScroll);
        }
      };

      frame = requestAnimationFrame(() => {
        const svg = svgRef.current;
        const section = sectionRef.current;

        const rotatingHoles = rotatingHolesRef.current;
        const rotatingBoundaries = rotatingBoundariesRef.current;

        const remainingHoles = remainingHolesRef.current;
        const remainingBoundaries = remainingBoundariesRef.current;

        const eagleMaskBase = eagleMaskBaseRef.current;

        const overlay = overlayRef.current;
        const content = contentRef.current;

        /* Validate refs */

        if (
          !svg ||
          !section ||
          !rotatingHoles ||
          !rotatingBoundaries ||
          !remainingHoles ||
          !remainingBoundaries ||
          !eagleMaskBase ||
          !overlay ||
          !content
        ) {
          console.error("EagleReveal: Required refs are missing.");
          return;
        }

        /* Collect SVG elements */

        const centerLines = Array.from(
          svg.querySelectorAll<SVGLineElement>("[data-center-line]"),
        );

        const revealLines = Array.from(
          svg.querySelectorAll<SVGLineElement>("[data-triangle-reveal]"),
        );

        const boundaryLines = Array.from(
          rotatingBoundaries.querySelectorAll<SVGLineElement>(
            "[data-triangle-boundary]",
          ),
        );

        const rotatingHolePolygons = Array.from(
          rotatingHoles.querySelectorAll<SVGPolygonElement>(
            "[data-rotating-hole]",
          ),
        );

        const remainingHolePolygons = Array.from(
          remainingHoles.querySelectorAll<SVGPolygonElement>(
            "[data-remaining-hole]",
          ),
        );

        const remainingBoundaryLines = Array.from(
          remainingBoundaries.querySelectorAll<SVGLineElement>(
            "[data-remaining-boundary]",
          ),
        );

        const contentItems = Array.from(
          content.querySelectorAll<HTMLElement>("[data-hero-item]"),
        );

        const navbar =
          section.querySelector<HTMLElement>("[data-navbar]");

        const scrollHint =
          section.querySelector<HTMLElement>("[data-scroll-hint]");

        /* Validate elements */

        if (
          centerLines.length !== 2 ||
          revealLines.length !== TRIANGLE_COUNT ||
          boundaryLines.length !== FIRST_REVEAL_ORDER.length * 2 ||
          rotatingHolePolygons.length !== FIRST_REVEAL_ORDER.length ||
          remainingHolePolygons.length !== REMAINING_REVEAL_ORDER.length ||
          remainingBoundaryLines.length !==
            REMAINING_REVEAL_ORDER.length * 2
        ) {
          console.error("EagleReveal: SVG elements are missing.");
          return;
        }

        /* Reset initial states */

        gsap.set(overlay, {
          autoAlpha: 0,
        });

        if (navbar) {
          gsap.set(navbar, {
            autoAlpha: 0,
            y: -20,
          });
        }

        gsap.set(contentItems, {
          autoAlpha: 0,
          y: 30,
        });

        if (scrollHint) {
          gsap.set(scrollHint, {
            autoAlpha: 1,
            y: 0,
          });
        }

        centerLines.forEach((line) => {
          const length = line.getTotalLength();

          gsap.set(line, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 0,
          });
        });

        gsap.set(revealLines, {
          attr: {
            "stroke-width": 0,
          },
          opacity: 1,
        });

        gsap.set(rotatingHolePolygons, {
          opacity: 0,
          rotation: 0,
        });

        gsap.set(
          [...boundaryLines, ...remainingBoundaryLines],
          {
            strokeDasharray: BOUNDARY_LENGTH,
            strokeDashoffset: BOUNDARY_LENGTH,
            opacity: 0,
          },
        );

        gsap.set(remainingHolePolygons, {
          opacity: 0,
        });

        gsap.set([rotatingHoles, rotatingBoundaries], {
          rotation: 0,
          svgOrigin: `${CENTER_X} ${CENTER_Y}`,
        });

        gsap.set(eagleMaskBase, {
          attr: {
            fill: "white",
          },
        });

        REMAINING_REVEAL_ORDER.forEach(
          (triangleIndex, orderIndex) => {
            remainingHolePolygons[orderIndex].setAttribute(
              "points",
              triangles[triangleIndex].polygon,
            );
          },
        );

        /* Check previous animation state */

        let hasAlreadyPlayed = false;

        try {
          hasAlreadyPlayed =
            sessionStorage.getItem(REVEAL_STORAGE_KEY) === "true";
        } catch {
          hasAlreadyPlayed = false;
        }

        /* Create timeline */

        timeline = gsap.timeline({
          paused: true,
          defaults: {
            overwrite: "auto",
          },

          onComplete: () => {
            try {
              sessionStorage.setItem(REVEAL_STORAGE_KEY, "true");
            } catch {
              // Storage may be unavailable.
            }

            removeStartListeners();
            animationStartedRef.current = true;

            completionCallbackRef.current();
          },
        });

        /* 1. Draw central vertical line */

        timeline.to(centerLines[0], {
          strokeDashoffset: 0,
          opacity: CENTER_OPACITY,
          duration: 0.15,
          ease: "none",
        });

        /* 2. Draw central horizontal line */

        timeline.to(centerLines[1], {
          strokeDashoffset: 0,
          opacity: CENTER_OPACITY,
          duration: 0.15,
          ease: "none",
        });

        timeline.to({}, { duration: 0.2 });

        /* 3. Reveal first four triangles */

        FIRST_REVEAL_ORDER.forEach((triangleIndex) => {
          const revealLine = revealLines[triangleIndex];

          const triangleBoundaryLines = boundaryLines.filter(
            (line) =>
              Number(line.dataset.triangleBoundary) === triangleIndex,
          );

          triangleBoundaryLines.forEach((line) => {
            timeline!.to(
              line,
              {
                strokeDashoffset: 0,
                opacity: BOUNDARY_OPACITY,
                duration: BOUNDARY_DRAW_DURATION,
                ease: "power2.out",
              },
              "<",
            );
          });

          timeline!.to(
            revealLine,
            {
              attr: {
                "stroke-width": config.revealStrokeWidth,
              },
              duration: REVEAL_DURATION,
              ease: "power1.inOut",
            },
            "<",
          );

          timeline!.to(
            rotatingHolePolygons[
              FIRST_REVEAL_ORDER.indexOf(triangleIndex)
            ],
            {
              opacity: 1,
              duration: 0.08,
              ease: "none",
            },
          );
        });

        /* 4. Remove temporary reveal lines */

        const firstRevealLines = FIRST_REVEAL_ORDER.map(
          (index) => revealLines[index],
        );

        timeline.to(firstRevealLines, {
          opacity: 0,
          duration: 0.1,
          ease: "none",
        });

        /* 5. Rotate first four triangles */

        for (
          let step = 1;
          step <= ROTATION_COUNT;
          step++
        ) {
          timeline.to([rotatingHoles, rotatingBoundaries], {
            rotation: step * ROTATION_STEP_ANGLE,
            duration: ROTATION_STEP_DURATION,
            ease: "sine.inOut",
            svgOrigin: `${CENTER_X} ${CENTER_Y}`,
          });

          if (step < ROTATION_COUNT) {
            timeline.to(
              {},
              {
                duration: ROTATION_PAUSE_DURATION,
              },
            );
          }
        }

        /* 6. Switch to remaining eagle holes */

        timeline.set(eagleMaskBase, {
          attr: {
            fill: "black",
          },
        });

        timeline.set(remainingHolePolygons, {
          attr: {
            fill: "white",
          },
          opacity: 1,
        });

        timeline.set(boundaryLines, {
          opacity: 0,
        });

        timeline.set(remainingBoundaryLines, {
          strokeDashoffset: 0,
          opacity: BOUNDARY_OPACITY,
        });

        /* 7. Collapse remaining triangles */

        const survivingLines: SVGLineElement[] = [];
        const duplicateLines: SVGLineElement[] = [];

        REMAINING_REVEAL_ORDER.forEach(
          (triangleIndex, orderIndex) => {
            const firstPoint = points[triangleIndex];

            const secondPoint =
              points[(triangleIndex + 1) % TRIANGLE_COUNT];

            const firstShort = getShortBoundaryPoint(
              firstPoint,
              CENTER_X,
              CENTER_Y,
            );

            const secondShort = getShortBoundaryPoint(
              secondPoint,
              CENTER_X,
              CENTER_Y,
            );

            const merged = getMidpoint(
              firstShort,
              secondShort,
            );

            const firstStretch =
              Math.hypot(
                firstPoint.x - CENTER_X,
                firstPoint.y - CENTER_Y,
              ) /
                BOUNDARY_LENGTH -
              1;

            const secondStretch =
              Math.hypot(
                secondPoint.x - CENTER_X,
                secondPoint.y - CENTER_Y,
              ) /
                BOUNDARY_LENGTH -
              1;

            const firstLine =
              remainingBoundaryLines[orderIndex * 2];

            const secondLine =
              remainingBoundaryLines[orderIndex * 2 + 1];

            const polygon = remainingHolePolygons[orderIndex];

            const state: TriangleCollapseState = {
              firstX: firstShort.x,
              firstY: firstShort.y,
              secondX: secondShort.x,
              secondY: secondShort.y,
              outer: 1,
            };

            const render = () => {
              const firstScale = 1 + firstStretch * state.outer;
              const secondScale = 1 + secondStretch * state.outer;

              polygon.setAttribute(
                "points",
                [
                  `${CENTER_X},${CENTER_Y}`,
                  `${CENTER_X + (state.firstX - CENTER_X) * firstScale},${
                    CENTER_Y + (state.firstY - CENTER_Y) * firstScale
                  }`,
                  `${CENTER_X + (state.secondX - CENTER_X) * secondScale},${
                    CENTER_Y + (state.secondY - CENTER_Y) * secondScale
                  }`,
                ].join(" "),
              );

              firstLine.setAttribute("x2", String(state.firstX));
              firstLine.setAttribute("y2", String(state.firstY));

              secondLine.setAttribute("x2", String(state.secondX));
              secondLine.setAttribute("y2", String(state.secondY));
            };

            survivingLines.push(firstLine);
            duplicateLines.push(secondLine);

            timeline!.to(
              state,
              {
                outer: 0,
                duration: SHRINK_DURATION,
                ease: "power2.inOut",
                onUpdate: render,
              },
              orderIndex === 0 ? undefined : "<",
            );

            timeline!.to(
              state,
              {
                firstX: merged.x,
                firstY: merged.y,
                secondX: merged.x,
                secondY: merged.y,
                duration: COLLAPSE_DURATION,
                ease: "power3.inOut",
                onUpdate: render,
              },
              "<",
            );
          },
        );

        /* 8. Merge duplicate lines */

        timeline.set(duplicateLines, {
          opacity: 0,
        });

        timeline.set(survivingLines, {
          opacity: MERGED_LINE_OPACITY,
        });

        /* 9. Retract merged lines */

        timeline.to(survivingLines, {
          strokeDashoffset: BOUNDARY_LENGTH,
          opacity: 0,
          duration: LINE_DISAPPEAR_DURATION,
          ease: "power2.inOut",
        });

        /* 10. Remove central symbol */

        timeline.to(
          centerLines,
          {
            opacity: 0,
            strokeDashoffset: (_index, target) =>
              (target as SVGLineElement).getTotalLength(),
            duration: LINE_DISAPPEAR_DURATION,
            ease: "power2.inOut",
          },
          "<",
        );

        /* 11. Reveal black overlay */

        timeline.to(overlay, {
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
        });

        /* 12. Hide scroll indicator */

        if (scrollHint) {
          timeline.to(scrollHint, {
            autoAlpha: 0,
            y: 12,
            duration: 0.3,
            ease: "power2.out",
          });
        }

        /* 13. Reveal Hero content */

        timeline.to(
          contentItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.16,
            ease: "power3.out",
          },
          "-=0.35",
        );

        if (navbar) {
          timeline.to(
            navbar,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "<",
          );
        }

        /* Start animation on first downward scroll */

        if (hasAlreadyPlayed) {
          animationStartedRef.current = true;
          timeline.progress(1);
        } else {
          animationStartedRef.current = false;

          const startAnimation = () => {
            if (animationStartedRef.current) return;

            animationStartedRef.current = true;

            removeStartListeners();

            timeline?.play(0);
          };

          handleWheel = (event: WheelEvent) => {
            if (event.deltaY > 0) {
              startAnimation();
            }
          };

          handleTouchStart = (event: TouchEvent) => {
            touchStartY = event.touches[0]?.clientY ?? 0;
          };

          handleTouchMove = (event: TouchEvent) => {
            const currentY =
              event.touches[0]?.clientY ?? touchStartY;

            if (currentY < touchStartY) {
              startAnimation();
            }
          };

          handleScroll = () => {
            if (window.scrollY > 0) {
              startAnimation();
            }
          };

          window.addEventListener("wheel", handleWheel, {
            passive: true,
          });

          window.addEventListener("touchstart", handleTouchStart, {
            passive: true,
          });

          window.addEventListener("touchmove", handleTouchMove, {
            passive: true,
          });

          window.addEventListener("scroll", handleScroll, {
            passive: true,
          });
        }
      });

      return () => {
        cancelAnimationFrame(frame);

        if (timeline) {
          timeline.kill();
        }

        if (handleWheel) {
          window.removeEventListener("wheel", handleWheel);
        }

        if (handleTouchStart) {
          window.removeEventListener("touchstart", handleTouchStart);
        }

        if (handleTouchMove) {
          window.removeEventListener("touchmove", handleTouchMove);
        }

        if (handleScroll) {
          window.removeEventListener("scroll", handleScroll);
        }
      };
    },
    {
      dependencies: [
        isMobile,
        isScreenReady,
        sectionRef,
        overlayRef,
        contentRef,
      ],
      revertOnUpdate: true,
    },
  );

  /* ---------------------------------- */
  /* Render                             */
  /* ---------------------------------- */

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-obsidian">
      <div
        data-scroll-hint
        className="
          pointer-events-none
          absolute
          bottom-8
          left-1/2
          z-50
          flex
          -translate-x-1/2
          flex-col
          items-center
          gap-3
          text-[#C8A45D]
        "
      >
        <span
          className="
            whitespace-nowrap
            text-[10px]
            font-medium
            tracking-[0.35em]
          "
        >
          SCROLL TO EXPLORE
        </span>

        <div className="relative h-10 w-px overflow-hidden bg-[#C8A45D]/25">
          <span className="scroll-indicator-beam absolute left-0 top-0 h-1/2 w-full bg-[#C8A45D]" />
        </div>
      </div>

      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        style={{
          visibility: isScreenReady ? "visible" : "hidden",
          opacity: isScreenReady ? 1 : 0,
        }}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio={
          isMobile ? "xMidYMid slice" : "xMidYMid meet"
        }
      >
        <defs>
          {triangles.map((triangle) => (
            <clipPath
              key={triangle.index}
              id={`${uniqueId}-triangle-${triangle.index}`}
              clipPathUnits="userSpaceOnUse"
            >
              <polygon points={triangle.polygon} />
            </clipPath>
          ))}

          <mask
            id={`${uniqueId}-portrait-mask`}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={WIDTH}
            height={HEIGHT}
            style={{ maskType: "alpha" }}
          >
            <image
              href={config.eagle}
              x={eagleX}
              y={eagleY}
              width={eagleWidth}
              height={eagleHeight}
              preserveAspectRatio="xMidYMid meet"
            />
          </mask>

          <mask
            id={`${uniqueId}-eagle-mask`}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={WIDTH}
            height={HEIGHT}
          >
            <rect
              ref={eagleMaskBaseRef}
              x="0"
              y="0"
              width={WIDTH}
              height={HEIGHT}
              fill="white"
            />

            {triangles.map((triangle) => (
              <g
                key={triangle.index}
                clipPath={`url(#${uniqueId}-triangle-${triangle.index})`}
              >
                <line
                  data-triangle-reveal={triangle.index}
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={triangle.midpoint.x}
                  y2={triangle.midpoint.y}
                  stroke="white"
                  strokeWidth={0}
                />
              </g>
            ))}

            <g ref={rotatingHolesRef}>
              {FIRST_REVEAL_ORDER.map((triangleIndex) => (
                <polygon
                  key={triangleIndex}
                  data-rotating-hole
                  points={triangles[triangleIndex].polygon}
                  fill="black"
                  opacity="0"
                />
              ))}
            </g>

            <g ref={remainingHolesRef}>
              {REMAINING_REVEAL_ORDER.map((triangleIndex) => (
                <polygon
                  key={triangleIndex}
                  data-remaining-hole
                  points={triangles[triangleIndex].polygon}
                  fill="white"
                  opacity="0"
                />
              ))}
            </g>
          </mask>
        </defs>

        <image
          href={config.portrait}
          x={portraitX}
          y={portraitY}
          width={portraitWidth}
          height={portraitHeight}
          preserveAspectRatio="xMidYMid meet"
          mask={`url(#${uniqueId}-portrait-mask)`}
        />

        <image
          href={config.eagle}
          x={eagleX}
          y={eagleY}
          width={eagleWidth}
          height={eagleHeight}
          preserveAspectRatio="xMidYMid meet"
          mask={`url(#${uniqueId}-eagle-mask)`}
        />

        <g
          ref={rotatingBoundariesRef}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={BOUNDARY_STROKE_WIDTH}
          strokeLinecap="round"
          pointerEvents="none"
        >
          {FIRST_REVEAL_ORDER.map((triangleIndex) => {
            const firstPoint = getShortBoundaryPoint(
              points[triangleIndex],
              CENTER_X,
              CENTER_Y,
            );

            const secondPoint = getShortBoundaryPoint(
              points[(triangleIndex + 1) % TRIANGLE_COUNT],
              CENTER_X,
              CENTER_Y,
            );

            return (
              <g key={triangleIndex}>
                <line
                  data-triangle-boundary={triangleIndex}
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={firstPoint.x}
                  y2={firstPoint.y}
                  opacity={0}
                />

                <line
                  data-triangle-boundary={triangleIndex}
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={secondPoint.x}
                  y2={secondPoint.y}
                  opacity={0}
                />
              </g>
            );
          })}
        </g>

        <g
          ref={remainingBoundariesRef}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={BOUNDARY_STROKE_WIDTH}
          strokeLinecap="round"
          pointerEvents="none"
        >
          {REMAINING_REVEAL_ORDER.map((triangleIndex) => {
            const firstPoint = getShortBoundaryPoint(
              points[triangleIndex],
              CENTER_X,
              CENTER_Y,
            );

            const secondPoint = getShortBoundaryPoint(
              points[(triangleIndex + 1) % TRIANGLE_COUNT],
              CENTER_X,
              CENTER_Y,
            );

            return (
              <g key={triangleIndex}>
                <line
                  data-remaining-boundary
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={firstPoint.x}
                  y2={firstPoint.y}
                  opacity={0}
                />

                <line
                  data-remaining-boundary
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={secondPoint.x}
                  y2={secondPoint.y}
                  opacity={0}
                />
              </g>
            );
          })}
        </g>

        <g
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={CENTER_STROKE_WIDTH}
          strokeLinecap="round"
        >
          <line
            data-center-line
            x1={CENTER_X}
            y1={CENTER_Y - 25}
            x2={CENTER_X}
            y2={CENTER_Y + 25}
            opacity={0}
          />

          <line
            data-center-line
            x1={CENTER_X - 25}
            y1={CENTER_Y}
            x2={CENTER_X + 25}
            y2={CENTER_Y}
            opacity={0}
          />
        </g>
      </svg>
    </div>
  );
}
