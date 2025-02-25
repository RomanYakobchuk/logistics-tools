'use client';

import React, {useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface HereRouteDisplayProps {
    coordinates: L.LatLngExpression[],
    transportMode: string
}

const getRouteColor = (mode: string) => {
    switch (mode.toLowerCase()) {
        case 'car':
            return '#0077be';
        case 'truck':
            return '#e65100';
        case 'pedestrian':
            return '#2e7d32';
        case 'bicycle':
            return '#6a1b9a';
        default:
            return '#0077be';
    }
};

const HereRouteDisplay = ({coordinates, transportMode}: HereRouteDisplayProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !mapRef.current || !coordinates.length) return;

        try {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }

            const uniqueId = `map-${Date.now()}-here`;
            mapRef.current.id = uniqueId;

            const firstCoord = coordinates[0];
            if (!firstCoord || !Array.isArray(firstCoord) || firstCoord.length < 2) {
                console.error('Invalid coordinates format:', firstCoord);
                return;
            }

            const map = L.map(mapRef.current, {
                maxZoom: 19,
                minZoom: 2
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            const polyline = L.polyline(coordinates, {
                color: getRouteColor(transportMode),
                weight: 5,
                opacity: 0.7
            }).addTo(map);

            const bounds = polyline.getBounds();
            map.fitBounds(bounds, {
                padding: [50, 50]
            });

            const customIcon = L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            });

            L.marker(coordinates[0], {icon: customIcon}).addTo(map)
                .bindPopup(`Start<br>Mode: ${transportMode}`);

            L.marker(coordinates[coordinates.length - 1], {icon: customIcon}).addTo(map)
                .bindPopup('End');

            mapInstanceRef.current = map;

            map.invalidateSize();
        } catch (error) {
            console.error('Error initializing map:', error);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [coordinates, transportMode, isMounted]);

    if (!isMounted) {
        return (
            <div className="w-full max-w-6xl mx-auto">
                <div className="h-96 bg-gray-100 rounded-lg"/>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div ref={mapRef} className="h-96 bg-gray-100 rounded-lg"/>
        </div>
    );
};

export default HereRouteDisplay;