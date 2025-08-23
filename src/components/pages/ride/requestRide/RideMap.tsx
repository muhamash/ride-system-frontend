/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix for default markers in react-leaflet
import { Icon } from 'leaflet';
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RideMapProps {
  pickupLocation: string;
  destination: string;
  pickupCoords: any;
  destinationCoords: any;
  mapRef: React.RefObject<any>;
}

export default function RideMap({
  pickupLocation,
  destination,
  pickupCoords,
  destinationCoords,
  mapRef
}: RideMapProps) {
  const DEFAULT_CENTER: [number, number] = [40.7128, -74.0060];

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Your Route
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 rounded-b-lg overflow-hidden">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {pickupCoords && (
              <Marker position={pickupCoords}>
                <Popup>Pickup: {pickupLocation}</Popup>
              </Marker>
            )}
            
            {destinationCoords && (
              <Marker position={destinationCoords}>
                <Popup>Destination: {destination}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}