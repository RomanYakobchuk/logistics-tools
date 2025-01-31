'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Instruction {
    distance: number;
    heading?: number;
    sign: number;
    interval: number[];
    text: string;
    time: number;
    street_name: string;
    street_ref?: string;
    street_destination?: string;
    street_destination_ref?: string;
}

interface LineStringCoordinates {
    type: 'LineString';
    coordinates: number[][];
}

interface Path {
    distance: number;
    weight: number;
    time: number;
    transfers: number;
    points_encoded: boolean;
    points: LineStringCoordinates;
    instructions: Instruction[];
    bbox: number[];
    ascend: number;
    descend: number;
}

interface GraphhopperRouteProps {
    route: {
        paths: Path[];
    };
    className?: string;
}

const GraphhopperRoute = ({ route, className }: GraphhopperRouteProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const path = route.paths[0];

        if (!path.points || path.points.type !== 'LineString') return;

        const coordinates = path.points.coordinates.map(coord =>
            [coord[1], coord[0]] as L.LatLngExpression
        );

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const uniqueId = `map-${Date.now()}-graphhopper`;
        mapRef.current.id = uniqueId;

        const map = L.map(uniqueId).setView(coordinates[0], 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const polyline = L.polyline(coordinates, {
            color: '#0077be',
            weight: 5,
            opacity: 0.7
        }).addTo(map);

        const customIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        L.marker(coordinates[0], { icon: customIcon }).addTo(map)
            .bindPopup('Start').openPopup();

        L.marker(coordinates[coordinates.length - 1], { icon: customIcon }).addTo(map)
            .bindPopup('End').openPopup();

        map.fitBounds(polyline.getBounds());

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [route]);

    return (
        <div className={`w-full max-w-6xl mx-auto ${className}`}>
            <div ref={mapRef} className="h-96 bg-gray-100 rounded-lg" />
        </div>
    );
};

export default GraphhopperRoute;