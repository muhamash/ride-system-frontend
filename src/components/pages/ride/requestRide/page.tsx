/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import axios from "axios";
import { Icon } from "leaflet";
import React, { useEffect, useState } from "react";
import LocationInput from "./LocationInput";
import RideDetailsCard from "./RideDetailsCard";
import RideMap from "./RideMap";
import type { Location, RideDetails } from "./types";

const RequestRide: React.FC = () => {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [pickupSearch, setPickupSearch] = useState("");
  const [dropoffSearch, setDropoffSearch] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<Location[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<Location[]>([]);
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [routeData, setRouteData] = useState<any>(null);

  const { data } = useUserDataQuery();
  const userCoords = data?.data?.location?.coordinates || [23.8103, 90.4125];

  // Icons
  const pickupIcon = new Icon( {
    iconUrl: "/icons/pickup.png",
    iconSize: [ 32, 32 ],
  } );

  const dropoffIcon = new Icon( {
    iconUrl: "/icons/dropoff.png",
    iconSize: [ 32, 32 ],
  } );

  // Fetch autocomplete suggestions from Pathao
  const fetchAutocomplete = async (query: string, setSuggestions: React.Dispatch<React.SetStateAction<Location[]>>) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://maps-api.pathao.io/v1/location/autocomplete/${userCoords[0]}/${userCoords[1]}/${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${import.meta.env.PATHAO_API_KEY}` } }
      );

      console.log(res)
      const locations = res.data.results.map((item: never) => ({
        name: item.address,
        lat: item.lat,
        lng: item.lon,
      }));

      setSuggestions(locations);
    } catch (err) {
      console.error("Failed to fetch autocomplete:", err);
      setSuggestions([]);
    }
  };

  // Watch search input changes
  useEffect(() => { fetchAutocomplete(pickupSearch, setPickupSuggestions); }, [pickupSearch]);
  useEffect(() => { fetchAutocomplete(dropoffSearch, setDropoffSuggestions); }, [dropoffSearch]);

  // Map click handler
  const handleMapClick = (e: never) => {
    const { lat, lng } = e.latlng;
    const newLocation = { name: "Dropped Pin", lat, lng };
    if (document.activeElement?.id === "pickup-search") {
      setPickupLocation(newLocation);
      setPickupSearch("Dropped Pin");
    } else if (document.activeElement?.id === "dropoff-search") {
      setDropoffLocation(newLocation);
      setDropoffSearch("Dropped Pin");
    }
  };

  // Fetch route logic remains the same as before...
  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickupLocation || !dropoffLocation) return;
      try {
        const res = await fetch(
          `https://maps-api.pathao.io/v1/maps/route/${pickupLocation.lat},${pickupLocation.lng};${dropoffLocation.lat},${dropoffLocation.lng}/driving`,
          { method: "GET", headers: { Authorization: import.meta.env.PATHAO_API_KEY } }
        );
        const text = await res.text();
        if (!text) throw new Error("Empty response from API");
        const json = JSON.parse(text);
        setRouteData(json);

        if (json?.routes?.[0]?.legs?.[0]) {
          const leg = json.routes[0].legs[0];
          const distanceKm = leg.distance.value / 1000;
          const durationMin = leg.duration.value / 60;
          const price = Math.max(60, distanceKm * 35);

          setRideDetails({
            distance: parseFloat(distanceKm.toFixed(1)),
            duration: Math.round(durationMin),
            price: Math.round(price),
          });
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    fetchRoute();
  }, [pickupLocation, dropoffLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-30 px-4 md:px-8">
      <div className="w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="w-full flex flex-wrap gap-8 p-6 md:p-8">
          {/* Left Column */}
          <div className="w-full md:w-1/3 space-y-8">
            <LocationInput
              text="Pickup"
              value={pickupSearch}
              suggestions={pickupSuggestions}
              onChange={setPickupSearch}
              onSelect={(loc) => { setPickupLocation(loc); setPickupSearch(loc.name); }}
            />
            <LocationInput
              text="Drop off"
              value={dropoffSearch}
              suggestions={dropoffSuggestions}
              onChange={setDropoffSearch}
              onSelect={(loc) => { setDropoffLocation(loc); setDropoffSearch(loc.name); }}
            />
            {rideDetails && <RideDetailsCard rideDetails={rideDetails} />}
          </div>

          {/* Right Column */}
          <div className="w-full">
            <RideMap
            pickupLocation={pickupLocation || { lat: userCoords[0], lng: userCoords[1], name: "Start" }}
            dropoffLocation={dropoffLocation || { lat: userCoords[0], lng: userCoords[1], name: "End" }}
            pickupIcon={pickupIcon}
            dropoffIcon={dropoffIcon}
            onMapClick={handleMapClick}
            routeData={routeData}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestRide;