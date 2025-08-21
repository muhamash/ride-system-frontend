/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import LocationInput from './LocationInput';
import RideDetailsCard from './RideDetailsCard';
import RideMap from './RideMap';

// Types
interface Location {
  name: string;
  lat: number;
  lng: number;
}
interface RideDetails {
  distance: number;
  duration: number;
  price: number;
}

const DHAKA_AREAS: Location[] = [
  { name: "Gulshan 1", lat: 23.7806, lng: 90.4142 },
  { name: "Banani", lat: 23.7940, lng: 90.4053 },
  { name: "Dhanmondi", lat: 23.7465, lng: 90.3760 },
  { name: "Uttara", lat: 23.8759, lng: 90.3795 },
  { name: "Mirpur", lat: 23.8055, lng: 90.3683 },
  { name: "Motijheel", lat: 23.7341, lng: 90.4129 },
  { name: "Farmgate", lat: 23.7557, lng: 90.3841 },
  { name: "Mohammadpur", lat: 23.7643, lng: 90.3560 },
  { name: "Old Dhaka", lat: 23.7104, lng: 90.4074 },
  { name: "Bashundhara", lat: 23.8153, lng: 90.4254 }
];

const RequestRide: React.FC = () => {
  const [pickupLocation, setPickupLocation] = useState<Location>(DHAKA_AREAS[0]);
  const [dropoffLocation, setDropoffLocation] = useState<Location>(DHAKA_AREAS[1]);
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropoffSearch, setDropoffSearch] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState<Location[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<Location[]>([]);
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);

  const pickupIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const dropoffIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Calculate Distance
  useEffect(() => {
    const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const distance = calcDistance(
      pickupLocation.lat,
      pickupLocation.lng,
      dropoffLocation.lat,
      dropoffLocation.lng
    );

    const duration = distance * 3;
    const price = Math.max(60, distance * 35);

    setRideDetails({
      distance: parseFloat(distance.toFixed(1)),
      duration: Math.round(duration),
      price: Math.round(price)
    });
  }, [pickupLocation, dropoffLocation]);

  // Handle Search Suggestions
  useEffect(() => {
    setPickupSuggestions(
      pickupSearch
        ? DHAKA_AREAS.filter(area =>
            area.name.toLowerCase().includes(pickupSearch.toLowerCase()))
        : []
    );
  }, [pickupSearch]);

  useEffect(() => {
    setDropoffSuggestions(
      dropoffSearch
        ? DHAKA_AREAS.filter(area =>
            area.name.toLowerCase().includes(dropoffSearch.toLowerCase()))
        : []
    );
  }, [dropoffSearch]);

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    const newLocation = { name: "Dropped Pin", lat, lng };
    if (document.activeElement?.id === 'pickup-search') {
      setPickupLocation(newLocation);
      setPickupSearch('Dropped Pin');
    } else if (document.activeElement?.id === 'dropoff-search') {
      setDropoffLocation(newLocation);
      setDropoffSearch('Dropped Pin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Book Your Ride</h1>
              <p className="text-gray-600 mt-2">Quick, convenient, and affordable transportation across Dhaka</p>
            </div>

            <LocationInput
              text={"Pickup"}
              value={pickupSearch}
              suggestions={pickupSuggestions}
              onChange={setPickupSearch}
              onSelect={(loc) => { setPickupLocation(loc); setPickupSearch(loc.name); }}
            />

            <LocationInput
              text={"Drop off"}
              value={dropoffSearch}
              suggestions={dropoffSuggestions}
              onChange={setDropoffSearch}
              onSelect={(loc) => { setDropoffLocation(loc); setDropoffSearch(loc.name); }}
            />

            {rideDetails && <RideDetailsCard rideDetails={rideDetails} />}

            <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              Request Ride
            </button>
          </div>

          {/* Right Column */}
          <RideMap
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            pickupIcon={pickupIcon}
            dropoffIcon={dropoffIcon}
            onMapClick={handleMapClick}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestRide;
