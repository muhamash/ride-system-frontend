 
import React from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import type { IProps } from './types';


const RideMap: React.FC<IProps> = ({ pickupLocation, dropoffLocation, pickupIcon, dropoffIcon, onMapClick }) => (
  <div className="h-96 lg:h-full rounded-lg overflow-hidden">
    <MapContainer
      center={[23.8103, 90.4125]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      onClick={onMapClick}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
        <Popup>Pickup Location</Popup>
      </Marker>
      <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon}>
        <Popup>Dropoff Location</Popup>
      </Marker>
      <Polyline
        positions={[
          [pickupLocation.lat, pickupLocation.lng],
          [dropoffLocation.lat, dropoffLocation.lng]
        ]}
        color="#4f46e5"
        weight={4}
        opacity={0.7}
      />
    </MapContainer>
  </div>
);

export default RideMap;