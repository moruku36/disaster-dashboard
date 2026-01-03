"use client";

import React from 'react';
import DeckGL from '@deck.gl/react';
import { Map as ReactMap } from 'react-map-gl/maplibre';
import { GeoJsonLayer } from '@deck.gl/layers';
import type { MapViewState, PickingInfo } from '@deck.gl/core';

// Initial view state centered on Tokyo
const INITIAL_VIEW_STATE: MapViewState = {
    longitude: 139.767125,
    latitude: 35.681236,
    zoom: 12,
    pitch: 0,
    bearing: 0
};

// GSI Maps Style for MapLibre
const mapStyle = {
    version: 8,
    sources: {
        'gsi-std': {
            type: 'raster',
            tiles: ['https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution:
                '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
        },
    },
    layers: [
        {
            id: 'gsi-std-layer',
            type: 'raster',
            source: 'gsi-std',
            minzoom: 0,
            maxzoom: 18,
        },
    ],
};

// Sample Hazard Data (GeoJSON) - A dummy flood risk area
const SAMPLE_HAZARD_DATA: any = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {
                riskLevel: 3,
                description: 'High Flood Risk Zone'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [139.75, 35.68],
                        [139.77, 35.68],
                        [139.77, 35.70],
                        [139.75, 35.70],
                        [139.75, 35.68]
                    ]
                ]
            }
        },
        {
            type: 'Feature',
            properties: {
                riskLevel: 1,
                description: 'Low Flood Risk Zone'
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                        [139.72, 35.66],
                        [139.74, 35.66],
                        [139.74, 35.68],
                        [139.72, 35.68],
                        [139.72, 35.66]
                    ]
                ]
            }
        }
    ]
};

export default function MapComponent() {
    const layers = [
        new GeoJsonLayer({
            id: 'hazard-layer',
            data: SAMPLE_HAZARD_DATA,
            filled: true,
            stroked: true,
            lineWidthMinPixels: 2,
            getFillColor: (d: any) => {
                const risk = d.properties.riskLevel;
                return risk >= 3 ? [255, 0, 0, 100] : [0, 0, 255, 100];
            },
            getLineColor: [255, 255, 255],
            getLineWidth: 20,
            pickable: true,
            onHover: ({ object, x, y }: PickingInfo) => {
                // Simple console log or tooltip logic could go here
                if (object) {
                    console.log(object.properties.description);
                }
            }
        })
    ];

    return (
        <div className="relative w-full h-screen">
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
                style={{ width: '100%', height: '100%' }}
            >
                <ReactMap
                    mapStyle={mapStyle as any}
                    style={{ width: '100%', height: '100%' }}
                />
            </DeckGL>

            {/* Overlay UI for Title/Legend could go here */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 p-4 rounded-lg shadow-lg dark:bg-black/90 dark:text-white">
                <h1 className="text-xl font-bold mb-2">Disaster Risk Visualization PoC</h1>
                <div className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-4 h-4 bg-red-500/50 border border-white block"></span>
                        <span>High Risk Area</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-blue-500/50 border border-white block"></span>
                        <span>Low Risk Area</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
