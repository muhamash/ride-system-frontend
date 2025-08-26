/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetDirectionMutation } from "@/redux/features/api/locationService.api";
import { useEffect, useRef, useState } from "react";
import RideMap from "../requestRide/RideMap";

export default function RouteFetcher({ ride }) {
  const [getDirection, {isLoading: directionLoading}] = useGetDirectionMutation();
  const [location, setLocation] = useState({ driveToPickUp: null, drivePickUpToDrop: null });
  const mapRef = useRef<any>( null );
  
  // console.log(location)

  useEffect(() => {
    const fetchRoute = async () => {
      if (!ride) return;

      const driverCoords = ride.driverLocation.coordinates;
      const pickupCoords = ride.pickUpLocation.coordinates;
      const dropOffCoords = ride.dropOffLocation.coordinates;

      const payloadTemplate = (start: number[], end: number[]) => ({
        profile: "driving",
        coordinates: `${start[0]},${start[1]};${end[0]},${end[1]}`,
        alternatives: false,
        steps: true,
        overview: "full",
      });

      try {
        const routeToPickup = await getDirection( payloadTemplate( driverCoords, pickupCoords ) ).unwrap();
        // console.log( routeToPickup.data );

        const routeToDropoff = await getDirection( payloadTemplate( pickupCoords, [dropOffCoords[1], dropOffCoords[0]] ) ).unwrap();
        // console.log(routeToDropoff.data)

        setLocation({ driveToPickUp: routeToPickup.data, drivePickUpToDrop: routeToDropoff.data });
      } catch (err) {
        console.error("Error fetching routes:", err);
      }
    };

    fetchRoute();
  }, [ ride, getDirection ] );
  
  if ( directionLoading )
  {
    return <p>Loading....</p>
  }

  return location.driveToPickUp && location.drivePickUpToDrop ? (
    <RideMap
      pickupLocation={ride.pickUpLocation.address}
      destination={ride.dropOffLocation.address}
      pickupCoords={[ride.pickUpLocation.coordinates[1], ride.pickUpLocation.coordinates[0]]}
      destinationCoords={[ride.dropOffLocation.coordinates[0], ride.dropOffLocation.coordinates[1]]}
      mapRef={mapRef}
      routeData={[ location.driveToPickUp, location.drivePickUpToDrop ]} 
      acceptDriverCords={[ride.driverLocation.coordinates[1], ride.driverLocation.coordinates[0], ride.driverLocation.address]}
    />
  ) : null;
}
