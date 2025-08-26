/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { useMyToast } from "@/components/layouts/MyToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import { rideApi, useAcceptRideMutation, useCheckRideRequestMutation, useToggleDriverStatusMutation } from "@/redux/features/api/ride.api";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

interface RideRequest {
  id: string;
  passengerName: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: "REQUESTED" | "ACCEPTED" | "RIDING";
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
  const [checkRideRequest] = useCheckRideRequestMutation();
  const [toggleDriverStatus] = useToggleDriverStatusMutation();
  const [acceptRideRequest] = useAcceptRideMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [driverStatus, setDriverStatus] = useState(DRIVER_STATUS.UNAVAILABLE);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useMyToast();

  // Sync driver status from userData
  useEffect(() => {
    if (driverData?.data?.driver?.driverStatus) {
      setDriverStatus(driverData.data.driver.driverStatus);
    }
  }, [driverData]);

  // Fetch ride requests when driver is available
  useEffect(() => {
    const fetchRideRequests = async () => {
      try {
        setErrorMessage(null);
        const response = await checkRideRequest().unwrap();

        // console.log( response, driverData, rideRequests );

        

        if (response?.data?.rides) {
          const formattedRides: RideRequest[] = response.data.rides.map((ride: any) => ({
            id: ride.id,
            passengerName: ride.riderUserName,
            pickup: ride.pickUpLocation.address,
            dropoff: ride.dropOffLocation.address,
            fare: ride.fare,
            status: ride.status,
            distance: ride.distanceInKm,
          }));
          setRideRequests(formattedRides.filter((r) => r.status === "REQUESTED"));
        }

        if ( response?.data )
        {
          console.log(response?.data)
          setRideRequests(response?.data)
        }


      } catch (error: any) {
        if (error?.status === 403) {
          setDriverStatus(DRIVER_STATUS.RIDING);
          setErrorMessage(
            error?.data?.message ||
              "You are currently on an ongoing ride. Complete it before accepting new requests."
          );
          setRideRequests([]);
        } else {
          setErrorMessage(error?.data?.message || "Failed to fetch ride requests.");
        }
      }
    };

    fetchRideRequests();
  }, [driverStatus, checkRideRequest]);

  // Toggle driver availability
  const toggleAvailability = async () => {
    if (driverStatus === DRIVER_STATUS.NOT_APPROVED || driverStatus === DRIVER_STATUS.RIDING) return;

    try {
      await toggleDriverStatus().unwrap();
      showToast({ message: `Driver updated successfully!`, type: "success" });
      setDriverStatus((prev) =>
        prev === DRIVER_STATUS.AVAILABLE ? DRIVER_STATUS.UNAVAILABLE : DRIVER_STATUS.AVAILABLE
      );
    } catch (error: any) {
      showToast({ message: error?.data?.message || error.message, type: "error" });
    } finally {
      dispatch(rideApi.util.resetApiState());
    }
  };

  // Accept ride
  const handleAcceptRide = async (id: string) => {
    try {
      const res = await acceptRideRequest({ id });
      showToast({
        type: "success",
        message: res?.data?.data?.message || "Ride accepted successfully!!",
      });
      setDriverStatus(DRIVER_STATUS.RIDING);
      navigate(`/ride/ride-info/${res?.data?.data?.acceptedRide?._id}`);
    } catch (error: any) {
      showToast({ type: "error", message: error?.data?.message || error.message });
    }
    setRideRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "ACCEPTED" } : r)));
  };

  // Cancel ride request
  const handleCancelRide = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setRideRequests((prev) => prev.filter((r) => r.id !== id));
  };

  console.log(rideRequests)

  return (
    <div className="container mx-auto p-6 py-30">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Driver Dashboard</CardTitle>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
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
                    driverStatus === DRIVER_STATUS.RIDING ||
                    !!errorMessage
                  }
                >
                  {driverStatus === DRIVER_STATUS.AVAILABLE ? "Available" : "Unavailable"}
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {driverStatus === DRIVER_STATUS.AVAILABLE && !errorMessage && rideRequests.length === 0 && (
            <p className="text-gray-500">
              You are online and available. Please wait until a rider sends a request...
            </p>
          )}

          {driverStatus === DRIVER_STATUS.AVAILABLE &&
            !errorMessage &&
            rideRequests.map((ride) => (
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

          {
            driverStatus === DRIVER_STATUS.RIDING && (
              <>
                 <p className="text-red-500">You are already riding!!</p>
                <Link className="bg-pink-200 px-4 py-3 rounded-md" to={`/ride/ride-info/${rideRequests?._id}`}>View on going ride</Link>
              </>
            )
          }
          {driverStatus === DRIVER_STATUS.UNAVAILABLE && !errorMessage && (
            <p className="text-red-500">
              You are currently unavailable. Toggle to Available to see ride requests.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
