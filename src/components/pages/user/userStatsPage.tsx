/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/layouts/Loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/constants/userRole";
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import { useGetDriverStatsByDriverQuery, useGetUserStatsByUserQuery } from "@/redux/features/api/stats.api";

export const UserStatsPage = () => {
  const { data: userData, isLoading: userLoading } = useUserDataQuery();
  const role = userData?.data?.role;
  const userId = userData?.data?._id;

  // Driver stats query
  const { data: driverStats, isLoading: driverStatsLoading } = useGetDriverStatsByDriverQuery({
    skip: role !== UserRole.DRIVER || !userId,
  } );
  
  // console.log(driverStats, role)

  // User/rider stats query
  const { data: userStats, isLoading: userStatsLoading } = useGetUserStatsByUserQuery({
    skip: role !== UserRole.RIDER,
  });

  if (userLoading) return <Loading />;

  // Show loading for role-specific data
  if ((role === UserRole.DRIVER && driverStatsLoading) || (role === UserRole.RIDER && userStatsLoading)) {
    return <div className="min-h-screen flex items-center justify-center">Loading stats...</div>;
  }

  // Show no stats available if data missing
  if ((role === UserRole.DRIVER && !driverStats) || (role === UserRole.RIDER && !userStats)) {
    return <div className="min-h-screen flex items-center justify-center">No stats available.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-30 px-4">
      <h1 className="text-3xl font-bold mb-6">{role === UserRole.DRIVER ? "Driver Stats Dashboard" : "User Stats Dashboard"}</h1>

      {role === UserRole.DRIVER ? (
        <>
          {/* Driver Info */}
          <Card>
            <CardHeader>
              <CardTitle>{driverStats.data.driver?.name}</CardTitle>
              <CardDescription>{driverStats.data.driver?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Status: {driverStats.data.driver?.isOnline ? "Online" : "Offline"}</p>
              <p>Driver ID: {driverStats.data.driver?.id}</p>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle>Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">৳ {driverStats.data.totalEarnings?.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle>Total Rides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{driverStats.data.totalRides}</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50">
              <CardHeader>
                <CardTitle>Total Travelled (km)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{driverStats.data.totalTravelledInKm?.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Rides */}
          <h2 className="text-2xl font-semibold mt-6 mb-4">Recent three Rides</h2>
          <div className="space-y-4">
            {driverStats.data.rides.slice(-3).reverse().map((ride: any) => (
              <Card key={ride._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle>
                    Ride ID: {ride.id} - Status: {ride.status}
                  </CardTitle>
                  <CardDescription>
                    Rider: {ride.riderUserName} | Fare: ৳ {ride.fare.toFixed(2)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      Pickup: <span className="font-semibold">{ride.pickUpLocation.address}</span>
                    </p>
                    <p>
                      Drop-off: <span className="font-semibold">{ride.dropOffLocation.address}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Requested At: <span className="font-semibold">{new Date(ride.requestedAt).toLocaleString()}</span>
                    </p>
                    <p>
                      Completed At: <span className="font-semibold">{ride.completedAt ? new Date(ride.completedAt).toLocaleString() : "N/A"}</span>
                    </p>
                    <p>Distance: {ride.distanceInKm} km</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* User/Rider Info */}
          <Card>
            <CardHeader>
              <CardTitle>{userStats?.data?.user?.name}</CardTitle>
              <CardDescription>{userStats?.data?.user?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Status: {userStats?.data?.user?.isOnline ? "Online" : "Offline"}</p>
              <p>User ID: {userStats?.data?.user?.id}</p>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle>Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">৳ {userStats?.data?.totalSpent?.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle>Total Rides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{userStats?.data?.totalRides}</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50">
              <CardHeader>
                <CardTitle>Total Travelled (km)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{userStats?.data?.totalTravelledInKm?.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Rides */}
          <h2 className="text-2xl font-semibold mt-6 mb-4">Recent three Rides</h2>
          <div className="space-y-4">
            {userStats?.data?.rides?.slice(-3).reverse().map((ride: any) => (
              <Card key={ride._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle>
                    Ride ID: {ride.id} - Status: {ride.status}
                  </CardTitle>
                  <CardDescription>
                    Driver: {ride.driverUserName} | Fare: ৳ {ride.fare.toFixed(2)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      Pickup: <span className="font-semibold">{ride.pickUpLocation?.address}</span>
                    </p>
                    <p>
                      Drop-off: <span className="font-semibold">{ride.dropOffLocation?.address}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Requested At: <span className="font-semibold">{new Date(ride.requestedAt).toLocaleString()}</span>
                    </p>
                    <p>
                      Completed At: <span className="font-semibold">{ride.completedAt ? new Date(ride.completedAt).toLocaleString() : "N/A"}</span>
                    </p>
                    <p>Distance: {ride.distanceInKm} km</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};