import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
function LocationMarker({ setPosisi }) {
    const [position, setPosition] = useState(null);
    
    useMapEvents({
        click(e) {
        setPosition(e.latlng);
        setPosisi(e.latlng); 
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
    }

    const LocationPicker = ({ onLocationSelect }) => {
    const defaultCenter = [-6.879704, 109.037890]; 

    return (
        <div className="flex flex-col gap-2">
        <label className="text-gray-300 text-sm font-semibold">
            Titik Lokasi Kejadian
        </label>
        
        <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-600 relative z-0">
            <MapContainer 
            center={defaultCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker setPosisi={onLocationSelect} />
            </MapContainer>
        </div>
        
        <p className="text-xs text-gray-400">
            *Klik pada peta untuk menandai lokasi spesifik.
        </p>
        </div>
    );
};

export default LocationPicker;