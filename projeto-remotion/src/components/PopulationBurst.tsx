import React, { useMemo } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SAFE_FACE_ZONE } from "../compositions/monster_safezones";

type Person = {
  x: number;
  y: number;
  size: number;
  delay: number;
  opacity: number;
  blur: number;
};

const makePeople = (): Person[] =>
  Array.from({ length: 260 }, (_, index) => {
    const col = index % 24;
    const row = Math.floor(index / 24);
    const jitterX = ((index * 37) % 19) - 9;
    const jitterY = ((index * 53) % 23) - 11;
    const rawY = 115 + row * 76 + jitterY;
    const y =
      rawY > SAFE_FACE_ZONE.top - 40 && rawY < SAFE_FACE_ZONE.bottom + 40
        ? rawY + 360
        : rawY;
    return {
      x: 18 + col * 44 + jitterX,
      y,
      size: 18 + ((index * 13) % 22),
      delay: (index % 14) * 0.8,
      opacity: 0.075 + ((index * 7) % 12) / 100,
      blur: index % 4 === 0 ? 2.2 : 0.5,
    };
  });

type PopulationBurstProps = {
  start: number;
  end: number;
};

export const PopulationBurst: React.FC<PopulationBurstProps> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const people = useMemo(makePeople, []);
  const globalOpacity = interpolate(sec, [start, start + 1.25, end - 0.55, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: globalOpacity,
        background:
          "radial-gradient(circle at 50% 36%, rgba(26,58,92,0.2), rgba(0,0,0,0) 58%)",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {people.map((person, index) => {
        const local = Math.max(0, (sec - start) * fps - person.delay);
        const opacity = interpolate(local, [0, 8], [0, person.opacity], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const yDrift = interpolate(sec, [start, end], [0, -18 - (index % 5) * 6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: person.x,
              top: person.y + yDrift,
              width: person.size,
              height: person.size * 1.7,
              opacity,
              filter: `blur(${person.blur}px)`,
            }}
          >
            <div
              style={{
                width: person.size * 0.45,
                height: person.size * 0.45,
                margin: "0 auto",
                borderRadius: "50%",
                backgroundColor: "white",
              }}
            />
            <div
              style={{
                width: person.size * 0.62,
                height: person.size * 0.9,
                margin: "2px auto 0",
                borderRadius: "45% 45% 18% 18%",
                backgroundColor: "white",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
