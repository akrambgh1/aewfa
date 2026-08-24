"use client";

import Scene3D from "./Scene3D";

export default function PropertyShowcase3D() {
  return (
    <section className="px-10 py-32">
      <h2 className="text-4xl mb-10">3D Property Experience</h2>

      <div className="h-[45rem] w-[100rem] rounded-2xl overflow-hidden">
        <Scene3D />
      </div>
    </section>
  );
}