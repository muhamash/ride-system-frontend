import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import { useEffect, useState } from "react";

interface RideRequest {
  id: string;
  passengerName: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: "REQUESTED" | "ACCEPTED" | "CANCEL";
}

const DRIVER_STATUS = {
  NOT_APPROVED: "UNDER_REVIEW",
  RIDING: "RIDING",
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export default function CheckRideRequestPage() {
  const demoData: RideRequest[] = [
    { id: "1", passengerName: "John Doe", pickup: "Banani", dropoff: "Gulshan", fare: 250, status: "REQUESTED" },
    { id: "2", passengerName: "Sara Ali", pickup: "Dhanmondi", dropoff: "Bashundhara", fare: 400, status: "REQUESTED" },
    { id: "3", passengerName: "Rafiq Ahmed", pickup: "Uttara", dropoff: "Mirpur", fare: 300, status: "REQUESTED" },
  ];

  const { data: driverData } = useUserDataQuery();
  const [driverStatus, setDriverStatus] = useState(DRIVER_STATUS.UNAVAILABLE);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);

  useEffect(() => {
    if (driverData?.data?.driver?.driverStatus) {
      setDriverStatus(driverData.data.driver.driverStatus);
    }
  }, [driverData]);

  useEffect(() => {
    if (driverStatus === DRIVER_STATUS.AVAILABLE) {
      const fetchDemoRides = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        setRideRequests(demoData.filter(r => r.status === "REQUESTED")); // only show REQUESTED
      };
      fetchDemoRides();
    } else {
      setRideRequests([]);
    }
  }, [driverStatus]);

  const toggleAvailability = async () => {
    if (driverStatus === DRIVER_STATUS.NOT_APPROVED || driverStatus === DRIVER_STATUS.RIDING) return;
    await new Promise(resolve => setTimeout(resolve, 300));
    setDriverStatus(prev =>
      prev === DRIVER_STATUS.AVAILABLE ? DRIVER_STATUS.UNAVAILABLE : DRIVER_STATUS.AVAILABLE
    );
  };

  const handleAcceptRide = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setRideRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: "ACCEPTED" } : r))
    );
    setDriverStatus(DRIVER_STATUS.RIDING);
  };

  const handleCancelRide = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setRideRequests(prev => prev.filter(r => r.id !== id)); // remove canceled ride
  };

  return (
    <div className="container mx-auto p-6 py-30">
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Driver Dashboard</CardTitle>
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