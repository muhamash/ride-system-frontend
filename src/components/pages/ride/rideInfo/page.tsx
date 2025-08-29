import Loading from "@/components/layouts/Loading.tsx";
import { useMyToast } from "@/components/layouts/MyToast.tsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/constants/userRole";
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import { locationService } from "@/redux/features/api/locationService.api.ts";
import { rideApi, useCancelRideMutation, useGetRideByIdQuery } from "@/redux/features/api/ride.api";
import { useAppDispatch } from "@/redux/hooks";
import { useNavigate, useParams } from "react-router";
import FloatEmergencyContact from "./FloatEmergenctContact.tsx";
import RideActionsWrapper from "./RideActions.tsx";
import RouteFetcher from "./RouteFetcher.tsx";

export default function RideInfoPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useMyToast();

  // Fetch current user
  const { data: userData, isLoading: userLoading } = useUserDataQuery();

  const {
    data: rideData,
    isLoading: rideLoading,
    isError: rideError,
    refetch: refetchRide
  } = useGetRideByIdQuery({ id: id! }, { skip: !id });

  const [cancelRide] = useCancelRideMutation();

  const ride = rideData?.data;

  const role = userData?.data?.role;

  const hasValidCoordinates =
    ride?.pickUpLocation?.coordinates?.length === 2 &&
    ride?.dropOffLocation?.coordinates?.length === 2;

  const handleRefresh = () => {
    dispatch(rideApi.util.resetApiState());
    dispatch(locationService.util.resetApiState());
    window.location.reload();
  };

  const handleUserCancelRide = async () => {
    if (!ride?._id) return;

    try {
      const res = await cancelRide({ id: ride._id });
      if (!res.data) {
        showToast({ type: "info", message: res?.error?.data?.message || "Something went wrong!" });
        return;
      }
      dispatch(rideApi.util.resetApiState());
      showToast({ type: "success", message: res.data?.message });
      navigate("/ride/ride-info");
    } catch (error: unknown) {
      showToast({
        type: "error",
        message: error?.message || error?.error?.message || error?.data?.message || "Something went wrong!"
      });
    }
  };

  // Loading state
  if (userLoading || rideLoading) {
    return (
      <Loading/>
    );
  }

  // Error or missing ride
  if (rideError || !ride) {
    return (
      <p className="py-30 flex items-center justify-center text-4xl text-red-600">
        Ride not found or missing location data
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-30">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            <span>
              Ride Details
              <Badge
                className={`ml-3 ${ ride.status === "ACCEPTED"
                    ? "bg-green-500"
                    : ride.status === "PENDING"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
              >
                {ride.status}
              </Badge>
            </span>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="secondary" size="sm" className="bg-purple-200">
                Refresh
              </Button>
              {role !== UserRole.DRIVER && ride.status === "REQUESTED" && (
                <Button onClick={handleUserCancelRide} variant="destructive" size="sm">
                  Cancel Ride
                </Button>
              )}
            </div>
          </CardTitle>
          <p className="text-sm text-blue-600 font-mono py-3">
            Note: If the map doesn't load immediately, refresh the page. Using free APIs from GeoApify an locationIQ and more other free apis from the internet!!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {
            ride.status !== "COMPLETED" && (
          <FloatEmergencyContact />
          )
              }
          
          <div>
            <p className="text-lg font-semibold">Rider</p>
            <p className="text-sm text-gray-600">{ride.rider?.name} ({ride.rider?.email})</p>
          </div>
          <Separator />
          <div>
            <p className="text-lg font-semibold">Driver</p>
            <p className="text-sm text-gray-600">{ride.driverUserName || "Not Assigned"}</p>
          </div>
          <Separator />
          <div>
            <p className="text-lg font-semibold">Pickup Location</p>
            <p className="text-sm text-gray-600">{ride.pickUpLocation?.address || "N/A"}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Drop-off Location</p>
            <p className="text-sm text-gray-600">{ride.dropOffLocation?.address || "N/A"}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-semibold">Distance</p>
              <p className="text-sm text-gray-600">{ride.distanceInKm ?? "N/A"} km</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Fare</p>
              <p className="text-sm text-gray-600">৳{ride.fare ?? "N/A"}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-lg font-semibold">Requested At</p>
            <p className="text-sm text-gray-600">{ride.requestedAt ? new Date( ride.requestedAt ).toLocaleString() : "N/A"}</p>
          </div>
          {ride.acceptedAt && (
            <div>
              <p className="text-lg font-semibold">Accepted At</p>
              <p className="text-sm text-gray-600">{new Date( ride.acceptedAt ).toLocaleString()}</p>
            </div>
          )}
          <Separator />
          {role === UserRole.DRIVER && <RideActionsWrapper ride={ride} onRideUpdate={refetchRide} />}
          <Separator />
          {hasValidCoordinates && <RouteFetcher ride={ride} />}
        </CardContent>
      </Card>
    </div>
  );
}