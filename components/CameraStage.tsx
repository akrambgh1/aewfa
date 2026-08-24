"use client";

export default function CameraStage({ children }) {
  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d"
      }}
    >
      {children}
    </div>
  );
}