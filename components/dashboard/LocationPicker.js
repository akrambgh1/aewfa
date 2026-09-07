"use client";

import { useEffect } from "react";
import {
MapContainer,
TileLayer,
Marker,
useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/*

* Fix Leaflet's default marker icons in Next.js.
  */

const markerIcon = L.icon({
iconUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

iconRetinaUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

shadowUrl:
"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

iconSize: [25, 41],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
shadowSize: [41, 41],
});

/*

* Default map position.
*
* Algiers / Algeria
  */

const DEFAULT_POSITION = {
lat: 36.7538,
lng: 3.0588,
};

/*

* Component that listens for map clicks.
  */

function MapClickHandler({ onChange }) {
useMapEvents({
click(event) {
onChange({
lat: event.latlng.lat,
lng: event.latlng.lng,
});
},
});

return null;
}

export default function LocationPicker({
value,
onChange,
}) {
/*

* If a location was already selected,
* center the map there.
*
* Otherwise use Algiers.
  */

const position = value
? [value.lat, value.lng]
: [DEFAULT_POSITION.lat, DEFAULT_POSITION.lng];

return ( <div className="relative h-[300px] w-full"> <MapContainer
     center={position}
     zoom={13}
     scrollWheelZoom={true}
     className="h-full w-full"
   > <TileLayer
       attribution='&copy; OpenStreetMap contributors'
       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
     />


    <MapClickHandler onChange={onChange} />

    {value && (
      <Marker
        position={[value.lat, value.lng]}
        icon={markerIcon}
      />
    )}
  </MapContainer>

  {!value && (
    <div className="pointer-events-none absolute bottom-3 left-1/2 z-[1000] -translate-x-1/2 border border-[#c4956a55] bg-[#1a1410]/90 px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-white shadow-lg">
      Click map to select location
    </div>
  )}

  {value && (
    <div className="pointer-events-none absolute left-3 top-3 z-[1000] border border-[#c4956a55] bg-[#1a1410]/90 px-3 py-2 text-[9px] uppercase tracking-[0.15em] text-white shadow-lg">
      Location selected
    </div>
  )}
</div>


);
}
