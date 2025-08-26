/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import { Car, MapPin } from "lucide-react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

// Fix for default markers in react-leaflet
import L, { Icon, LatLngExpression } from 'leaflet';
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
} );


const bicycleIcon = new L.Icon({
  iconUrl: "/bicycle.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

interface RideMapProps {
  pickupLocation: string;
  destination: string;
  pickupCoords: any;
  destinationCoords: any;
  mapRef: React.RefObject<any>;
  routeData: any;
  onlineDrivers?: any;
}

interface OnlineDrivers
{
  id: string,
  lat: number,
  lng: number
}

export default function RideMap({
  pickupLocation,
  onlineDrivers,
  destination,
  pickupCoords,
  destinationCoords,
  mapRef,
  routeData,
}: RideMapProps) {
  const DEFAULT_CENTER: LatLngExpression = [22.7643863, 90.34924975706107];

  // Decode polyline
  let routePositions: LatLngExpression[] = [];
  if (routeData?.data?.routes?.length) {
    const encoded = routeData.data.routes[0].geometry;
    routePositions = polyline.decode(encoded).map(([lat, lng]) => [lat, lng] as LatLngExpression);
  }

  const onlineDriverData: OnlineDrivers[] = onlineDrivers
    ? onlineDrivers.map( driver => ( {
      id: driver.email,
      lat: driver.location.coordinates[ 1 ], 
      lng: driver.location.coordinates[ 0 ],
    } ) )
    : [];


  return (
    <Card className="shadow-lg z-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex gap-2 justify-between items-center">
          <div className="flex items-end gap-2">
            <MapPin className="h-5 w-5 text-pink-600" />
            <p>Your Route</p>
          </div>

          {
            onlineDrivers && (
               <span className="flex items-center ">Online <Car className="text-purple-500 text-sm ml-1 mr-2" /> : {onlineDrivers?.length}</span>
            )
         }
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 rounded-b-lg overflow-hidden z-10">
          <MapContainer
            center={pickupCoords || DEFAULT_CENTER}
            zoom={13}
            style={{ height: '100%', width: '100%' , zIndex: "10"}}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
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

            {onlineDriverData || onlineDrivers && onlineDriverData?.map( ( driver: any ) => (
              <Marker
                key={driver.id}
                position={[ driver.lat, driver.lng ]}
                icon={bicycleIcon}
              >
                <Popup>Driver ID: {driver.id}</Popup>
              </Marker>
            ) )}

            {routePositions.length > 0 && (
              <Polyline positions={routePositions} color="red" weight={4} />
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}