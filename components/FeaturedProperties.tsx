"use client";

import { properties } from "../lib/data";
import PropertyCard from "./PropertyCard";

export default function FeaturedProperties() {
  return (
    <section id="properties" className="px-10 py-32 w-full ">
      <h2 className="text-4xl mb-10">Featured Properties</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}