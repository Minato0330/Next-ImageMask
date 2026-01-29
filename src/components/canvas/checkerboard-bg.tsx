"use client";

export function CheckerboardBg() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(45deg, var(--checkerboard-color, #e5e5e5) 25%, transparent 25%),
          linear-gradient(-45deg, var(--checkerboard-color, #e5e5e5) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, var(--checkerboard-color, #e5e5e5) 75%),
          linear-gradient(-45deg, transparent 75%, var(--checkerboard-color, #e5e5e5) 75%)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        opacity: 0.3,
      }}
    />
  );
}
