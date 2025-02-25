'use client';

import React, {useEffect, useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Coordinate {
    lat: number;
    lng: number;
}

interface RouteAction {
    action: string;
    duration: number;
    length: number;
    instruction: string;
    offset: number;
    direction?: string;
    severity?: string;
    exit?: number;
}

interface RouteSection {
    id: string;
    type: string;
    actions: RouteAction[];
    departure: {
        time: string;
        place: {
            location: Coordinate;
        };
    };
    arrival: {
        time: string;
        place: {
            location: Coordinate;
        };
    };
    summary: {
        duration: number;
        length: number;
        baseDuration: number;
    };
    polyline: string;
    transport: {
        mode: string;
    };
}

interface HereRouteDisplayProps {
    route: {
        sections: RouteSection[];
    };
}

const DECODING_TABLE = [
    62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
];

function decodeChar(char: string): number {
    const charCode = char.charCodeAt(0);
    return DECODING_TABLE[charCode - 45];
}

function decodeUnsignedValues(encoded: string): number[] {
    let result = 0;
    let shift = 0;
    const resList: number[] = [];

    encoded.split('').forEach((char) => {
        const value = decodeChar(char);
        result |= (value & 0x1F) << shift;
        if ((value & 0x20) === 0) {
            resList.push(result);
            result = 0;
            shift = 0;
        } else {
            shift += 5;
        }
    });

    if (shift > 0) {
        throw new Error('Invalid encoding');
    }

    return resList;
}

function decodeHeader(version: number, encodedHeader: number) {
    if (version !== 1) {
        throw new Error('Invalid format version');
    }
    const precision = encodedHeader & 15;
    const thirdDim = (encodedHeader >> 4) & 7;
    const thirdDimPrecision = (encodedHeader >> 7) & 15;
    return {precision, thirdDim, thirdDimPrecision};
}

function toSigned(val: number): number {
    let res = val;
    if (res & 1) {
        res = ~res;
    }
    res >>= 1;
    return res;
}

function decodePolyline(encoded: string) {
    const decoder = decodeUnsignedValues(encoded);
    const header = decodeHeader(decoder[0], decoder[1]);

    const factorDegree = Math.pow(10, header.precision);
    const factorZ = Math.pow(10, header.thirdDimPrecision);
    const thirdDim = header.thirdDim;

    let lastLat = 0;
    let lastLng = 0;
    let lastZ = 0;
    const res = [];

    let i = 2;
    for (; i < decoder.length;) {
        const deltaLat = toSigned(decoder[i]);
        const deltaLng = toSigned(decoder[i + 1]);
        lastLat += deltaLat;
        lastLng += deltaLng;

        if (thirdDim) {
            const deltaZ = toSigned(decoder[i + 2]);
            lastZ += deltaZ;
            res.push([lastLat / factorDegree, lastLng / factorDegree, lastZ / factorZ]);
            i += 3;
        } else {
            res.push([lastLat / factorDegree, lastLng / factorDegree]);
            i += 2;
        }
    }

    return res;
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

const HereRouteDisplay = ({route}: HereRouteDisplayProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const section = route.sections[0];
        const coordinates = decodePolyline(section.polyline).map(coord =>
            [coord[0], coord[1]] as L.LatLngExpression
        );

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const uniqueId = `map-${Date.now()}-here`;
        mapRef.current.id = uniqueId;

        const map = L.map(uniqueId).setView(coordinates[0], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const polyline = L.polyline(coordinates, {
            color: getRouteColor(section.transport.mode),
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

        L.marker(coordinates[0], {icon: customIcon}).addTo(map)
            .bindPopup(`Start<br>Mode: ${section.transport.mode}`).openPopup();

        L.marker(coordinates[coordinates.length - 1], {icon: customIcon}).addTo(map)
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
        <div className="w-full max-w-6xl mx-auto">
            <div ref={mapRef} className="h-96 bg-gray-100 rounded-lg"/>
        </div>
    );
};

export default HereRouteDisplay;