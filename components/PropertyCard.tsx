"use client";

import { motion } from "framer-motion";

export default function PropertyCard({ property }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="rounded-2xl overflow-hidden bg-white/5">
      <img src={property.image} className="h-64 w-full object-cover" />
      <div className="p-5">
        <h3>{property.title}</h3>
      </div>
    </motion.div>
  );
}