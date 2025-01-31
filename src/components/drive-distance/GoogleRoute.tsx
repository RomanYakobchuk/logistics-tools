'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GoogleRouteProps {
    route: {
        distanceMeters: number;
        duration: string;
        polyline: {
            encodedPolyline: string;
        };
        className?: string;
    };
    origin: {
        latitude: number;
        longitude: number;
    };
    destination: {
        latitude: number;
        longitude: number;
    };
}

function decodePolyline(encoded: string): L.LatLngExpression[] {
    const poly: L.LatLngExpression[] = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
        let result = 1;
        let shift = 0;
        let b;
        do {
            b = encoded.charCodeAt(index++) - 63 - 1;
            result += b << shift;
            shift += 5;
        } while (b >= 0x1f);
        lat += (result & 1 ? ~(result >> 1) : (result >> 1));

        result = 1;
        shift = 0;
        do {
            b = encoded.charCodeAt(index++) - 63 - 1;
            result += b << shift;
            shift += 5;
        } while (b >= 0x1f);
        lng += (result & 1 ? ~(result >> 1) : (result >> 1));

        poly.push([lat / 100000, lng / 100000]);
    }
    return poly;
}

const GoogleRoute = ({ route, origin, destination }: GoogleRouteProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const coordinates = decodePolyline(route.polyline.encodedPolyline);

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const uniqueId = `map-${Date.now()}-google`;
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

        L.marker([origin.latitude, origin.longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup(`Start<br>Distance: ${(route.distanceMeters / 1000).toFixed(2)} km<br>Duration: ${route.duration}`)
            .openPopup();

        L.marker([destination.latitude, destination.longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup('End')
            .openPopup();

        map.fitBounds(polyline.getBounds());

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [route, origin, destination]);

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div ref={mapRef} className="h-96 bg-gray-100 rounded-lg" />
        </div>
    );
};

export default GoogleRoute;