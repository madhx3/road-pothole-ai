import { Upload, Image as ImageIcon, AlertCircle, CheckCircle2, MapPin, Loader } from 'lucide-react';
import { useState } from 'react';
import GlassCard from './GlassCard';

interface DemoProps {
  onPotholeDetected: (confidence: number, lat: number, lng: number) => void;
}

export default function Demo({ onPotholeDetected }: DemoProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isDetected, setIsDetected] = useState<boolean | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'getting' | 'granted' | 'denied'>('idle');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      setLocationStatus('getting');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setLocationStatus('granted');
          resolve(loc);
        },
        () => {
          setLocationStatus('denied');
          reject(new Error('Location denied'));
        }
      );
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);
    setIsDetected(null);

    // Get location first
    let location = userLocation;
    if (!location) {
      try {
        location = await getLocation();
      } catch {
        setLocationStatus('denied');
      }
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
     const response = await fetch("https://YOUR_RENDER_BACKEND_URL/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setIsDetected(data.detected);
      setConfidence(data.confidence);

      if (data.detected && location) {
        onPotholeDetected(data.confidence, location.lat, location.lng);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsDetected(false);
    }

    setLoading(false);
  };

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          id="fileInput"
          className="hidden"
        />

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Open Camera and take a picture of pothole</h2>
          <p className="text-gray-400">Upload image for pothole detection</p>
        </div>

        {/* Location status banner */}
        <div className="mb-6">
          {locationStatus === 'idle' && (
            <div className="flex items-center justify-between bg-blue-500/20 border border-blue-400/30 rounded-xl px-5 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-400 w-5 h-5" />
                <span className="text-blue-300 text-sm">Location needed to mark potholes on map</span>
              </div>
              <button
                onClick={getLocation}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
              >
                Enable GPS
              </button>
            </div>
          )}
          {locationStatus === 'getting' && (
            <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 rounded-xl px-5 py-3">
              <Loader className="text-yellow-400 w-5 h-5 animate-spin" />
              <span className="text-yellow-300 text-sm">Getting your location...</span>
            </div>
          )}
          {locationStatus === 'granted' && (
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-xl px-5 py-3">
              <MapPin className="text-green-400 w-5 h-5" />
              <span className="text-green-300 text-sm">
                ✅ Location enabled — Detected potholes will be marked at your exact position
              </span>
            </div>
          )}
          {locationStatus === 'denied' && (
            <div className="flex items-center justify-between bg-red-500/20 border border-red-400/30 rounded-xl px-5 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-red-400 w-5 h-5" />
                <span className="text-red-300 text-sm">Location access denied — please allow in browser settings</span>
              </div>
              <button
                onClick={getLocation}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        <GlassCard className="p-8">
          <div className="space-y-8">
            <div
              onClick={() => document.getElementById('fileInput')?.click()}
              className="border-2 border-dashed border-blue-400/30 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 transition"
            >
              <Upload className="mx-auto mb-4 text-blue-400" size={32} />
              <p className="text-white">Click to upload image</p>
              <p className="text-gray-500 text-sm mt-1">It will auto-request your location on upload</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="p-6 h-48 flex items-center justify-center">
                {image ? (
                  <img src={image} className="h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto text-gray-500" />
                    <p className="text-gray-500">No image</p>
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-6 h-48 flex items-center justify-center">
                {loading ? (
                  <div className="text-center">
                    <Loader className="mx-auto text-blue-400 mb-2 animate-spin" />
                    <p className="text-gray-400">Processing...</p>
                  </div>
                ) : isDetected === null ? (
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto text-gray-500" />
                    <p className="text-gray-500">Awaiting upload</p>
                  </div>
                ) : isDetected ? (
                  <div className="text-center">
                    <AlertCircle className="mx-auto text-red-400 mb-2" size={32} />
                    <p className="text-white font-bold">Pothole Detected</p>
                    <p className="text-gray-400">Confidence: {confidence}%</p>
                    {userLocation && (
                      <p className="text-green-400 text-xs mt-1">📍 Marked on map!</p>
                    )}
                    {!userLocation && (
                      <p className="text-yellow-400 text-xs mt-1">⚠️ Enable location to mark on map</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto text-green-400 mb-2" size={32} />
                    <p className="text-white">No pothole detected</p>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}