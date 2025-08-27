/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetUserRidesQuery } from "@/redux/features/api/ride.api";
import { CatIcon, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function SeeRidesPage() {
  const { data: userRidesData, isLoading: userRidesLoading } = useGetUserRidesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  if (userRidesLoading) return <p className="text-center mt-10">Loading rides...</p>;


  const filteredRides = userRidesData?.data?.filter( ( ride: any ) =>
  {
    const matchesSearch =
      ride.pickUpLocation?.address.toLowerCase().includes( searchTerm.toLowerCase() ) ||
      ride.dropOffLocation?.address.toLowerCase().includes( searchTerm.toLowerCase() ) ||
      ride.driverUserName.toLowerCase().includes( searchTerm.toLowerCase() ) ||
      ride.riderUserName.toLowerCase().includes( searchTerm.toLowerCase() );

    const matchesStatus = filterStatus === "ALL" || !filterStatus ? true : ride.status === filterStatus;

    return matchesSearch && matchesStatus;
  } );

  return (
    <div className="container mx-auto p-4 py-30  space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Your Rides</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by location or username"
          value={searchTerm}
          onChange={( e ) => setSearchTerm( e.target.value )}
          className="flex-1"
        />
        <Select onValueChange={setFilterStatus} value={filterStatus} className="w-48">
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="REQUESTED">Requested</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* Rides List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRides && filteredRides.length > 0 ? (
          filteredRides.map( ( ride: never ) => (
            <Card key={ride._id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {ride.pickUpLocation?.address}
                </CardTitle>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-red-600" /> {ride.dropOffLocation?.address}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center gap-1">
                    <CatIcon className="h-4 w-4 text-green-600" /> {ride.fare.toFixed( 2 )} tk
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" /> {new Date( ride.requestedAt ).toLocaleString()}
                  </div>
                </div>
                <div className="flex w-full justify-between items-center pt-3">
                  <div
                    className={`text-sm font-semibold px-2 py-1 inline-block rounded ${ ride.status === "REQUESTED"
                      ? "bg-yellow-100 text-yellow-800"
                      : ride.status === "IN_TRANSIT"
                        ? "bg-blue-100 text-blue-800" : ride.status === "ACCEPTED"
                        ? "bg-violet-100 text-sky-800"
                        : "bg-green-100 text-green-800"
                      }`}
                  >
                    {ride.status.replace( "_", " " )}
                  </div>
                  <Link to={`/ride/ride-info/${ride._id}`} className="px-3 py-1 text-sm font-mono bg-sky-200 rounded-md shadow">View</Link>
                </div>
              </CardContent>
            </Card>
          ) )
        ) : (
          <p className="text-gray-500 col-span-full text-center">No rides found.</p>
        )}
      </div>
    </div>
  );
}