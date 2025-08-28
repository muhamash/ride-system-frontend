/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMyToast } from "@/components/layouts/MyToast";
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
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DriverInfo } from "./DriverInfo";
import { RideCard } from "./RideCard";

export interface RideRequest {
  id: string;
  passengerName: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: "REQUESTED" | "ACCEPTED" | "RIDING";
  distance?: number;
}

export const DRIVER_STATUS = {
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
  const [cancelRide] = useCancelRideMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useMyToast();

  const [driverStatus, setDriverStatus] = useState<string>();
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);

  // Initialize driver status
  useEffect(() => {
    if (driverData?.data?.driver?.driverStatus) {
      setDriverStatus(driverData.data.driver.driverStatus);
    }
  }, [driverData]);

  const fetchRideRequests = useCallback(async () => {
    if (driverStatus !== DRIVER_STATUS.AVAILABLE) {
      setRideRequests([]);
      return;
    }

    try {
      setErrorMessage(null);
      const response = await checkRideRequest().unwrap();
      const rides = response?.data?.rides || [];
      console.log(rides)

      const formattedRides = rides.map((ride: any) => ({
        id: ride.id,
        passengerName: ride.riderUserName,
        pickup: ride.pickUpLocation.address,
        dropoff: ride.dropOffLocation.address,
        fare: ride.fare,
        status: ride.status,
        distance: ride.distanceInKm,
      }));

      setRideRequests(formattedRides.filter((r) => r.status === "REQUESTED"));
      setCurrentRideId(response?.data?.currentRide?._id || null);
    } catch (error: any) {
      if (error?.status === 403) {
        setDriverStatus(DRIVER_STATUS.RIDING);
        setErrorMessage(error?.data?.message || "You are currently on an ongoing ride.");
      } else {
        setErrorMessage(error?.data?.message || "Failed to fetch ride requests.");
      }
      setRideRequests([]);
    }
  }, [checkRideRequest, driverStatus]);

  useEffect(() => {
    fetchRideRequests();
  }, [driverStatus, fetchRideRequests]);

  // Toggle availability
  const toggleAvailability = async () => {
    if ([DRIVER_STATUS.NOTAPPROVED, DRIVER_STATUS.RIDING, DRIVER_STATUS.SUSPENDED].includes(driverStatus!)) return;

    try {
      const res = await toggleDriverStatus().unwrap();
      showToast({ message: "Driver status updated successfully!", type: "success" });

      const newStatus = res?.data?.driverStatus ?? 
        (driverStatus === DRIVER_STATUS.AVAILABLE ? DRIVER_STATUS.UNAVAILABLE : DRIVER_STATUS.AVAILABLE);
      setDriverStatus(newStatus);

      if (newStatus === DRIVER_STATUS.AVAILABLE) fetchRideRequests();
    } catch (error: any) {
      showToast({ message: error?.data?.message || error.message, type: "error" });
    } finally {
      dispatch(rideApi.util.resetApiState());
    }
  };

  // Ride actions
  const handleAcceptRide = async (id: string) => {
    try {
      const res = await acceptRideRequest({ id }).unwrap();
      showToast({ type: "success", message: res?.data?.data?.message || "Ride accepted successfully!" });
      setDriverStatus(DRIVER_STATUS.RIDING);
      setCurrentRideId(res?.data?.data?.acceptedRide?._id || null);
      navigate(`/ride/ride-info/${res?.data?.acceptedRide?._id}`);
    } catch (error: any) {
      showToast({ type: "error", message: error?.data?.message || error.message });
    }
  };

  const handleCancelRide = async (id: string) => {
    await cancelRide({ id });
    dispatch(rideApi.util.resetApiState());
    showToast({ type: "success", message: "Cancelled request!" });
    setRideRequests((prev) => prev.filter((r) => r.id !== id));
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6 py-30">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Driver Dashboard</CardTitle>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">Refresh</Button>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 mt-4">
          {/* Driver Info */}
          {driverData && (
            <DriverInfo
              driverData={driverData}
              driverStatus={driverStatus}
              toggleAvailability={toggleAvailability}
            />
          )}

          <Separator />

          {/* Error Message */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {/* Ride Requests */}
          {driverStatus === DRIVER_STATUS.AVAILABLE && rideRequests.length === 0 && !errorMessage && (
            <p className="text-gray-500">You are online and available. Please wait for a ride request...</p>
          )}

          {driverStatus === DRIVER_STATUS.AVAILABLE && rideRequests.map((ride) => (
            <RideCard key={ride.id} ride={ride} onAccept={handleAcceptRide} onCancel={handleCancelRide} />
          ))}

          {/* Ongoing Ride */}
          {(driverStatus === DRIVER_STATUS.RIDING || currentRideId) && (
            <p className="text-red-500">You are currently riding!</p>
          )}

          {/* Unavailable Message */}
          {driverStatus === DRIVER_STATUS.UNAVAILABLE && !errorMessage && (
            <p className="text-red-500">You are currently unavailable. Toggle to Available to see ride requests.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
