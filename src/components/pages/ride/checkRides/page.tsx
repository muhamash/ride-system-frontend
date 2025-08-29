/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import { useGetAllRidesQuery, useGetUserRidesQuery } from "@/redux/features/api/ride.api";
import { useState } from "react";
import RideList from "./RideList";
import TabsComponent from "./TabsComponent";

export default function SeeRidesPage() {
  const { data: userRidesData, isLoading: userRidesLoading } = useGetUserRidesQuery();
  const { data: getAllRides, isLoading: getAllRidesLoading } = useGetAllRidesQuery();
  const { data: userData, isLoading: userDataLoading } = useUserDataQuery();

  console.log(getAllRides, userRidesData)

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [tab, setTab] = useState<"my" | "all">("my");

  const role = userData?.data?.role;

  const allRidesArray = Array.isArray( getAllRides?.data?.data ) ? getAllRides.data?.data : [];
  const userRidesArray = Array.isArray( userRidesData?.data?.data ) ? userRidesData.data?.data : [];
  const ridesToShow = role === "ADMIN" && tab === "all" ? allRidesArray : userRidesArray;
  
  // console.log(ridesToShow)

  const filteredRides = ridesToShow.filter( ( ride: any ) =>
  {
    const matchesSearch =
      ride.pickUpLocation?.address.toLowerCase().includes( searchTerm.toLowerCase() ) ||
      ride.dropOffLocation?.address.toLowerCase().includes( searchTerm.toLowerCase() ) ||
      ride.driverUserName.toLowerCase().includes( searchTerm.toLowerCase() ) ||
      ride.riderUserName.toLowerCase().includes( searchTerm.toLowerCase() );

    const matchesStatus = filterStatus === "ALL" || !filterStatus ? true : ride.status === filterStatus;

    return matchesSearch && matchesStatus;
  } );

  const handleTabChange = (value: "my" | "all") => {
    setTab(value);
  };

  return (
    <div className="container mx-auto p-4 py-30 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Your Ride History</h1>

      {/* Tabs (Only for Admin) */}
      {role === "ADMIN" && (
        <TabsComponent tab={tab} handleTabChange={handleTabChange} />
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by rides"
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

      {( userRidesLoading || userDataLoading || getAllRidesLoading ) && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-30">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ...</p>
          </div>
        </div>
      )}


      {/* Rides List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRides && filteredRides.length > 0 ? (
          filteredRides.map( ( ride: any ) => (
            <RideList key={ride._id} ride={ride} />
          ) )
        ) : (
          <p className="text-gray-500 col-span-full text-center">No rides found.</p>
        )}
      </div>
    </div>
  );
}
