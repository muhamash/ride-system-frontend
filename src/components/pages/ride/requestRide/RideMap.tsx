/* eslint-disable @typescript-eslint/no-unused-vars */
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import type { IProps } from './types';

const RideMap: React.FC<IProps> = ({
  pickupLocation,
  dropoffLocation,
  pickupIcon,
  dropoffIcon,
  onMapClick,
  routeData,
}) => {
  return (
    <div className="h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-2xl shadow-md overflow-hidden">
      <MapContainer
        center={[pickupLocation.lat, pickupLocation.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        onClick={onMapClick}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pickup Marker */}
        {pickupLocation && (
          <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

        {/* Dropoff Marker */}
        {dropoffLocation && (
          <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon}>
            <Popup>Dropoff Location</Popup>
          </Marker>
        )}

        {/* Polyline Route */}
        {pickupLocation && dropoffLocation && (
          <Polyline
            positions={[
              [pickupLocation.lat, pickupLocation.lng],
              [dropoffLocation.lat, dropoffLocation.lng],
            ]}
            color="#4f46e5"
            weight={5}
            opacity={0.8}
            dashArray="5, 10"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default RideMap;