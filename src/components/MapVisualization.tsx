import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { PotholeMarker } from '../App';
import { MapPin } from 'lucide-react';

const severityIcon = (severity: string) => {
  const color = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f97316' : '#3b82f6';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;">
        <div style="
          width:30px; height:30px; border-radius:50% 50% 50% 0;
          background:${color}; border:3px solid white;
          box-shadow:0 0 10px ${color}, 0 0 20px ${color}88;
          transform: rotate(-45deg);
        "></div>
        <div style="
          position:absolute; top:6px; left:6px;
          width:14px; height:14px; border-radius:50%;
          background:white; opacity:0.8;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -35],
  });
};

function FlyToMarker({ markers }: { markers: PotholeMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const latest = markers[markers.length - 1];
      map.flyTo([latest.lat, latest.lng], 14, { duration: 1.5 });
    }
  }, [markers]);
  return null;
}

interface MapProps {
  markers: PotholeMarker[];
}

const severityColor = (severity: string) => {
  if (severity === 'high') return { text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', dot: 'bg-red-500' };
  if (severity === 'medium') return { text: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', dot: 'bg-orange-400' };
  return { text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', dot: 'bg-blue-500' };
};

export default function MapVisualization({ markers }: MapProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Live Detection Map
          </h2>
          <p className="text-xl text-gray-400">
            Real-time visualization of detected potholes
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 justify-end">
          {['high', 'medium', 'low'].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                s === 'high' ? 'bg-red-500' : s === 'medium' ? 'bg-orange-400' : 'bg-blue-500'
              }`} />
              <span className="text-gray-300 text-sm capitalize">{s}</span>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl" style={{ height: '500px' }}>
          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <FlyToMarker markers={markers} />
            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={severityIcon(marker.severity)}
              >
                <Popup>
                  <div style={{ minWidth: '140px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>🕳️ Pothole #{marker.id}</p>
                    <p>Severity: <strong style={{ color: marker.severity === 'high' ? 'red' : marker.severity === 'medium' ? 'orange' : 'blue' }} className="capitalize">{marker.severity}</strong></p>
                    <p>Confidence: <strong>{marker.confidence}%</strong></p>
                    <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                      📍 {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                    </p>
                    {/* ← ADDED */}
                    <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                      🕐 {marker.timestamp ? new Date(marker.timestamp).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-6 justify-center text-sm">
          <span className="text-gray-400">
            Total Detected: <span className="text-white font-bold">{markers.length}</span>
          </span>
          <span className="text-gray-400">
            High Severity: <span className="text-red-400 font-bold">
              {markers.filter(m => m.severity === 'high').length}
            </span>
          </span>
        </div>

        {/* Coordinates Table */}
        {markers.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-blue-400 w-5 h-5" />
              <h3 className="text-xl font-semibold text-white">Detected Pothole Coordinates</h3>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              {/* Table Header — changed grid-cols-5 to grid-cols-6, added Date & Time ← CHANGED */}
              <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-white/5 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <span>#</span>
                <span>Latitude</span>
                <span>Longitude</span>
                <span>Severity</span>
                <span>Confidence</span>
                <span>Date & Time</span> {/* ← ADDED */}
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-white/5">
                {markers.map((marker) => {
                  const colors = severityColor(marker.severity);
                  return (
                    // changed grid-cols-5 to grid-cols-6 ← CHANGED
                    <div
                      key={marker.id}
                      className="grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors duration-150"
                    >
                      {/* ID */}
                      <span className="text-gray-400 text-sm font-mono">{marker.id}</span>

                      {/* Latitude */}
                      <span className="text-white font-mono text-sm tracking-tight">
                        {marker.lat.toFixed(6)}°
                      </span>

                      {/* Longitude */}
                      <span className="text-white font-mono text-sm tracking-tight">
                        {marker.lng.toFixed(6)}°
                      </span>

                      {/* Severity badge */}
                      <span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          {marker.severity}
                        </span>
                      </span>

                      {/* Confidence bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              marker.severity === 'high' ? 'bg-red-500' :
                              marker.severity === 'medium' ? 'bg-orange-400' : 'bg-blue-500'
                            }`}
                            style={{ width: `${marker.confidence}%` }}
                          />
                        </div>
                        <span className="text-gray-300 text-xs font-mono w-12 text-right">
                          {marker.confidence}%
                        </span>
                      </div>

                      {/* Date & Time ← ADDED */}
                      <span className="text-gray-300 text-xs font-mono">
                        {marker.timestamp ? new Date(marker.timestamp).toLocaleString() : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {markers.length === 0 && (
          <div className="mt-10 text-center py-10 bg-white/5 border border-white/10 rounded-2xl">
            <MapPin className="mx-auto text-gray-600 w-8 h-8 mb-3" />
            <p className="text-gray-500 text-sm">No potholes detected yet — upload an image to get started</p>
          </div>
        )}
      </div>
    </section>
  );
}