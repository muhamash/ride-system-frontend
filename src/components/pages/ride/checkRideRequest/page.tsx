/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMyToast } from "@/components/layouts/MyToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import
  {
    rideApi,
    useAcceptRideMutation,
    useCancelRideMutation,
    useCheckRideRequestMutation,
    useToggleDriverStatusMutation,
  } from "@/redux/features/api/ride.api";
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
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
  SUSPENDED: "SUSPENDED",
  RIDING: "RIDING",
  APPROVED: "APPROVED",
  NOTAPPROVED: "UNDER_REVIEW",
} as const;

export default function CheckRideRequestPage() {
  const { data: driverData, isLoading } = useUserDataQuery();
  const [checkRideRequest] = useCheckRideRequestMutation();
  const [toggleDriverStatus] = useToggleDriverStatusMutation();
  const [acceptRideRequest] = useAcceptRideMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useMyToast();

  const [driverStatus, setDriverStatus] = useState<string | undefined>(
    driverData?.data?.driver?.driverStatus
  );
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ currentRideId, setCurrentRideId ] = useState<string | null>( null );
  const [ cancelRide ] = useCancelRideMutation();

  // Sync driver status from API
  useEffect(() => {
    if (driverData?.data?.driver?.driverStatus) {
      setDriverStatus(driverData.data.driver.driverStatus);
    }
  }, [driverData]);

  // Fetch ride requests if driver is AVAILABLE
  const fetchRideRequests = async () => {
    if (driverStatus !== DRIVER_STATUS.AVAILABLE) {
      setRideRequests([]);
      return;
    }

    try {
      setErrorMessage(null);
      const response = await checkRideRequest().unwrap();

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

      if (response?.data?.currentRide) {
        setCurrentRideId(response.data.currentRide._id);
      }
    } catch (error: any) {
      if (error?.status === 403) {
        setDriverStatus(DRIVER_STATUS.RIDING);
        setErrorMessage(
          error?.data?.message || "You are currently on an ongoing ride."
        );
        setRideRequests([]);
      } else {
        setErrorMessage(error?.data?.message || "Failed to fetch ride requests.");
      }
    }
  };

  useEffect(() => {
    fetchRideRequests();
  }, [driverStatus]);

  // Toggle driver availability
  const toggleAvailability = async () => {
    if (driverStatus === DRIVER_STATUS.NOTAPPROVED || driverStatus === DRIVER_STATUS.RIDING) return;

    try {
      const res = await toggleDriverStatus().unwrap();
      showToast({ message: "Driver status updated successfully!", type: "success" });

      const newStatus =
        res?.data?.driverStatus ??
        (driverStatus === DRIVER_STATUS.AVAILABLE
          ? DRIVER_STATUS.UNAVAILABLE
          : DRIVER_STATUS.AVAILABLE);
      setDriverStatus(newStatus);

      if (newStatus === DRIVER_STATUS.AVAILABLE) {
        fetchRideRequests();
      }
    } catch (error: any) {
      showToast({ message: error?.data?.message || error.message, type: "error" });
    } finally {
      dispatch(rideApi.util.resetApiState());
    }
  };

  // Accept ride
  const handleAcceptRide = async (id: string) => {
    try {
      const res = await acceptRideRequest({ id }).unwrap();
      showToast({
        type: "success",
        message: res?.data?.data?.message || "Ride accepted successfully!",
      });
      setDriverStatus(DRIVER_STATUS.RIDING);
      setCurrentRideId(res?.data?.data?.acceptedRide?._id || null);
      navigate(`/ride/ride-info/${res?.data?.acceptedRide?._id}`);
    } catch (error: any) {
      showToast({ type: "error", message: error?.data?.message || error.message });
    }
  };

  // Cancel ride request (just local)
  const handleCancelRide = async( id: string ) =>
  {
    await cancelRide( { id } )
    dispatch( rideApi.util.resetApiState() );
    showToast({type:"success", message:"Cancelled request!"})
    setRideRequests((prev) => prev.filter((r) => r.id !== id));
  };

  if (isLoading) return <p>Loading...</p>;

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
                    driverStatus === DRIVER_STATUS.NOTAPPROVED ||
                    driverStatus === DRIVER_STATUS.RIDING || driverStatus === DRIVER_STATUS.SUSPENDED
                  }
                >
                  {driverStatus === DRIVER_STATUS.AVAILABLE ? "Available" : "Unavailable"}
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {driverStatus === DRIVER_STATUS.AVAILABLE && rideRequests.length === 0 && !errorMessage && (
            <p className="text-gray-500">
              You are online and available. Please wait until a rider sends a request...
            </p>
          )}

          {driverStatus === DRIVER_STATUS.AVAILABLE &&
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

          {driverStatus === DRIVER_STATUS.RIDING && currentRideId && (
            <>
              <p className="text-red-500">You are currently riding!</p>
              <Link
                className="bg-pink-200 px-4 py-3 rounded-md"
                to={`/ride/ride-info/${currentRideId}`}
              >
                View ongoing ride
              </Link>
            </>
          )}

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