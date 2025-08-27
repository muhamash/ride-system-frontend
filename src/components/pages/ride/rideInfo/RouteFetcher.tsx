/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetDirectionMutation } from "@/redux/features/api/locationService.api";
import { useEffect, useRef, useState } from "react";
import RideMap from "../requestRide/RideMap";

export default function RouteFetcher({ ride }) {
  const [getDirection, { isLoading: directionLoading }] =
    useGetDirectionMutation();
  const [location, setLocation] = useState({
    driveToPickUp: null,
    drivePickUpToDrop: null,
  });
  const mapRef = useRef<any>(null);

  const normalizeCoords = (coords: number[]) => [coords[1], coords[0]]; 

  useEffect(() => {
    const fetchRoute = async () => {
      if (!ride) return;

      const driverCoords = normalizeCoords(ride.driverLocation.coordinates);
      const pickupCoords = normalizeCoords(ride.pickUpLocation.coordinates);
      const dropOffCoords = normalizeCoords(ride.dropOffLocation.coordinates);

      const payloadTemplate = (start: number[], end: number[]) => ({
        profile: "driving",
        coordinates: `${start[1]},${start[0]};${end[1]},${end[0]}`,
        alternatives: false,
        steps: true,
        overview: "full",
      });

      try {
        const routeToPickup = await getDirection(
          payloadTemplate(driverCoords, pickupCoords)
        ).unwrap();

        const routeToDropoff = await getDirection(
          payloadTemplate(pickupCoords, [dropOffCoords[1], dropOffCoords[0]])
        ).unwrap();

        setLocation({
          driveToPickUp: routeToPickup.data,
          drivePickUpToDrop: routeToDropoff.data,
        });
      } catch (err) {
        console.error("Error fetching routes:", err);
      }
    };

    fetchRoute();
  }, [ ride, getDirection ] );
  

  if (directionLoading) {
    return <p>Loading route...</p>;
  }

  if (!location.driveToPickUp || !location.drivePickUpToDrop) return null;

  const driverCoords = normalizeCoords(ride.driverLocation.coordinates);
  const pickupCoords = normalizeCoords(ride.pickUpLocation.coordinates);
  const dropOffCoords = normalizeCoords( ride.dropOffLocation.coordinates );
  
  // console.log([dropOffCoords[1], dropOffCoords[0]])

  return (
    <RideMap
      pickupLocation={ride.pickUpLocation.address}
      destination={ride.dropOffLocation.address}
      pickupCoords={pickupCoords}
      destinationCoords={[dropOffCoords[1], dropOffCoords[0]]}
      mapRef={mapRef}
      routeData={[location.driveToPickUp, location.drivePickUpToDrop]}
      acceptDriverCords={driverCoords}
    />
  );
}