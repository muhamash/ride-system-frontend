/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMyToast } from "@/components/layouts/MyToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import { rideApi, useCheckRideRequestQuery, useToggleDriverStatusMutation } from "@/redux/features/api/ride.api";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface RideRequest {
  id: string;
  passengerName: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: "REQUESTED" | "ACCEPTED" | "CANCEL";
  distance?: number;
}

const DRIVER_STATUS = {
  NOT_APPROVED: "UNDER_REVIEW",
  RIDING: "RIDING",
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export default function CheckRideRequestPage() {
  const { data: driverData } = useUserDataQuery();
  const {
    data: rideRequestData,
    isLoading: checkRequestLoading,
    refetch: refetchRideRequests,
  } = useCheckRideRequestQuery();
  const [ toggleDriverStatus, { isLoading: toggleDriverStatusLoading } ] = useToggleDriverStatusMutation();


  const navigate = useNavigate();

  const [driverStatus, setDriverStatus] = useState(DRIVER_STATUS.UNAVAILABLE);
  const [ rideRequests, setRideRequests ] = useState<RideRequest[]>( [] );
  const { showToast } = useMyToast();

  // Update driver status from API
  useEffect(() => {
    if (driverData?.data?.driver?.driverStatus) {
      setDriverStatus(driverData.data.driver.driverStatus);
    }
  }, [ driverData ] );
  
  

  // Populate ride requests dynamically
  useEffect(() => {
    if (driverStatus === DRIVER_STATUS.AVAILABLE && rideRequestData?.data?.rides) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedRides: RideRequest[] = rideRequestData.data.rides.map((ride: any) => ({
        id: ride.id,
        passengerName: ride.riderUserName,
        pickup: ride.pickUpLocation.address,
        dropoff: ride.dropOffLocation.address,
        fare: ride.fare,
        status: ride.status,
        distance: ride.distanceInKm,
      }));
      setRideRequests(formattedRides.filter(r => r.status === "REQUESTED"));
    } else {
      setRideRequests([]);
    }
  }, [driverStatus, rideRequestData]);

  // Toggle driver availability
  const toggleAvailability = async () =>
  {
    if ( driverStatus === DRIVER_STATUS.NOT_APPROVED || driverStatus === DRIVER_STATUS.RIDING ) return;
    
    try
    {
      const res = await toggleDriverStatus().unwrap();

      console.log(res, driverData)
      showToast( {
        message: `Driver updated successfully!`,
        type: "success",
      } );

      setDriverStatus( prev =>
        prev === DRIVER_STATUS.AVAILABLE ? DRIVER_STATUS.UNAVAILABLE : DRIVER_STATUS.AVAILABLE
      );
    }
    catch ( error )
    {
      showToast( {
        message: error?.message || error?.data?.message,
        type: "error",
      } );
    } finally
    {
      dispatch( rideApi.util.resetApiState() );
    }
  };

  // Accept a ride
  const handleAcceptRide = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setRideRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: "ACCEPTED" } : r))
    );
    setDriverStatus(DRIVER_STATUS.RIDING);
    navigate("/ride/ride-info");
  };

  // Cancel a ride
  const handleCancelRide = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setRideRequests(prev => prev.filter(r => r.id !== id));
  };

  
  const dispatch = useAppDispatch();
  const handleRefresh = async () => {
    await refetchRideRequests();
    dispatch( rideApi.util.resetApiState() );
  };

  return (
    <div className="container mx-auto p-6 py-30">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Driver Dashboard</CardTitle>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            Refresh
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 mt-4">
          {driverData && (
            <div className="flex flex-col gap-2">
              <p>Name: {driverData?.data?.name}</p>
              <p>Email: {driverData?.data?.email}</p>
              <p>Driver Status: {driverStatus}</p>
              <p>User Status: {driverData?.data?.isOnline ? "ONLINE" : "OFFLINE"}</p>

              <div className="flex items-center gap-3 mt-2">
                <span>Status: </span>
                <Button
                  variant={driverStatus === DRIVER_STATUS.AVAILABLE ? "default" : "outline"}
                  onClick={toggleAvailability}
                  disabled={
                    driverStatus === DRIVER_STATUS.NOT_APPROVED ||
                    driverStatus === DRIVER_STATUS.RIDING
                  }
                >
                  {driverStatus === DRIVER_STATUS.AVAILABLE ? "Available" : "Unavailable"}
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {driverStatus === DRIVER_STATUS.NOT_APPROVED && (
            <p className="text-red-500">Your account is under review. You cannot toggle availability.</p>
          )}

          {driverStatus === DRIVER_STATUS.RIDING && (
            <p className="text-yellow-500">You are currently on a ride.</p>
          )}

          {driverStatus === DRIVER_STATUS.AVAILABLE && rideRequests.length === 0 && (
            <p className="text-gray-500">
              You are online and available. Please wait until a rider sends a request...
            </p>
          )}

          {driverStatus === DRIVER_STATUS.AVAILABLE &&
            rideRequests.map(ride => (
              <div
                key={ride.id}
                className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
              >
                <div>
                  <p className="text-lg font-semibold">{ride.passengerName}</p>
                  <p className="text-sm text-gray-600">
                    {ride.pickup} → {ride.dropoff}
                  </p>
                  <p className="text-sm">Fare: ৳{ride.fare}</p>
                  {ride.distance !== undefined && (
                    <p className="text-sm">Distance: {ride.distance.toFixed(2)} km</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{ride.status}</Badge>
                  <Button onClick={() => handleAcceptRide(ride.id)}>Accept</Button>
                  <Button variant="destructive" onClick={() => handleCancelRide(ride.id)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ))}

          {driverStatus === DRIVER_STATUS.UNAVAILABLE && (
            <p className="text-red-500">You are currently unavailable. Toggle to Available to see ride requests.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
