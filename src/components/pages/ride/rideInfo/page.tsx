 
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/constants/userRole";
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import { rideApi, useGetRideByIdQuery } from "@/redux/features/api/ride.api";
import { useAppDispatch } from "@/redux/hooks";
import { useParams } from "react-router";
import FloatEmergencyContact from "./FloatEmergenctContact.tsx";
import RouteFetcher from "./RouteFetcher.tsx";

export default function RideInfoPage() {
  const { data: userData, isLoading: driverLoading } = useUserDataQuery();
  const { id } = useParams();
  const { data: rideData, isLoading: rideDataLoading } = useGetRideByIdQuery({ id });

  const role = userData?.data?.role;
  const userId = role === UserRole.DRIVER ? userData?.data?.driver?._id : userData?.data?._id;
  const dispatch = useAppDispatch();


  const handleRefresh = () =>
  {
    dispatch( rideApi.util.resetApiState() );
  }

  const ride = rideData?.data;



  if (driverLoading || rideDataLoading) {
    return <p className="py-3 text-center">Loading...</p>;
  }

  if (!rideData?.data) {
    return (
      <p className="py-30 flex items-center justify-center text-4xl text-red-600">
        No ride in the database
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-30">
      {/* Ride Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Ride Details
            <Badge
              className={`ml-3 ${
                ride.status === "ACCEPTED"
                  ? "bg-green-500"
                  : ride.status === "PENDING"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              }`}
            >
              {ride.status}
            </Badge>
          </CardTitle>
          <Button onClick={()=> handleRefresh} variant={"secondary"} size={"sm"} className="w-[100px] bg-purple-200">Refresh</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <FloatEmergencyContact/>
          {/* Rider & Driver Info */}
          <div>
            <p className="text-lg font-semibold">Rider</p>
            <p className="text-sm text-gray-600">{ride.rider?.name} ({ride.rider?.email})</p>
          </div>
          <Separator />
          <div>
            <p className="text-lg font-semibold">Driver</p>
            <p className="text-sm text-gray-600">
              {ride.driverUserName || "Not Assigned"}
            </p>
          </div>

          {/* Locations */}
          <Separator />
          <div>
            <p className="text-lg font-semibold">Pickup Location</p>
            <p className="text-sm text-gray-600">{ride.pickUpLocation?.address}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Drop-off Location</p>
            <p className="text-sm text-gray-600">{ride.dropOffLocation?.address}</p>
          </div>

          {/* Ride Stats */}
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-semibold">Distance</p>
              <p className="text-sm text-gray-600">{ride.distanceInKm} km</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Fare</p>
              <p className="text-sm text-gray-600">৳{ride.fare}</p>
            </div>
          </div>

          {/* Timestamps */}
          <Separator />
          <div>
            <p className="text-lg font-semibold">Requested At</p>
            <p className="text-sm text-gray-600">{new Date(ride.requestedAt).toLocaleString()}</p>
          </div>
          {ride.acceptedAt && (
            <div>
              <p className="text-lg font-semibold">Accepted At</p>
              <p className="text-sm text-gray-600">{new Date(ride.acceptedAt).toLocaleString()}</p>
            </div>
          )}

          <Separator />
          
          {
            ride && (
              <RouteFetcher ride={ride}/>
            )
          }
        </CardContent>
      </Card>
    </div>
  );
}