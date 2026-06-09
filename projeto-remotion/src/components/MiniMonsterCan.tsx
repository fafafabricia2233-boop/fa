import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

type MiniMonsterCanProps = {
  src?: string;
};

export const MiniMonsterCan: React.FC<MiniMonsterCanProps> = ({
  src = staticFile("monster/monster_can_reference_clean.png"),
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        right: 54,
        top: 760,
        display: "flex",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      {[0, 1, 2, 3].map((item) => {
        const local = Math.max(0, frame - item * 2);
        const opacity = interpolate(local, [0, 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(local, [0, 5], [34, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const scale = interpolate(local, [0, 5], [0.8, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        return (
          <Img
            key={item}
            src={src}
            style={{
              width: 74,
              height: 168,
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: 8,
              opacity,
              transform: `translateY(${y}px) scale(${scale}) rotate(${item % 2 ? 3 : -3}deg)`,
              boxShadow:
                "0 0 18px rgba(46,204,113,0.28), 0 16px 34px rgba(0,0,0,0.42)",
              border: "1px solid rgba(46,204,113,0.45)",
            }}
          />
        );
      })}
    </div>
  );
};
