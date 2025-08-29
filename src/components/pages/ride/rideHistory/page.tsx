/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/layouts/Loading";
import Pagination from "@/components/layouts/Pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import { useGetAllRidesQuery, useGetUserRidesQuery } from "@/redux/features/api/ride.api";
import { useEffect, useState } from "react";
import RideList from "./RideList";
import TabsComponent from "./TabsComponent";

export default function SeeRidesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [tab, setTab] = useState<"my" | "all">("my");
  const itemsPerPage = 3;

  const { data: userData, isLoading: userDataLoading } = useUserDataQuery();
  const role = userData?.data?.role;

  const { data: userRidesData, isLoading: userRidesLoading } = useGetUserRidesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    status: filterStatus !== "ALL" ? filterStatus : undefined,
  });

  const { data: allRidesData, isLoading: allRidesLoading } = useGetAllRidesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    status: filterStatus !== "ALL" ? filterStatus : undefined,
  } );
  
    // console.log(userRidesData)

  const ridesToShow =
    role === "ADMIN" && tab === "all"
      ? allRidesData?.data?.data || []
      : userRidesData?.data?.data || [];

  const meta =
    role === "ADMIN" && tab === "all"
      ? allRidesData?.data?.meta
      : userRidesData?.data?.meta;

  
  useEffect(() => {
    const debounce = setTimeout(() => {
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(debounce);
  }, [searchTerm, filterStatus, tab]);

  const handleTabChange = (value: "my" | "all") => {
    setTab(value);
    setCurrentPage(1); 
  };

  const isLoading = userDataLoading || userRidesLoading || allRidesLoading;

  return (
    <div className="container mx-auto p-4 py-30 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Your Ride History</h1>

      {/* (Admin Only) */}
      {role === "ADMIN" && <TabsComponent tab={tab} handleTabChange={handleTabChange} />}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by rider, driver, name or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {isLoading && (
        <Loading/>
      )}

      {/* Rides List */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ridesToShow.length > 0 ? (
            ridesToShow.map((ride: any) => <RideList key={ride._id} ride={ride} />)
          ) : (
            <p className="text-gray-500 col-span-full text-center">No rides found.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && ridesToShow.length > 0 && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={meta?.totalPage || 1}
          meta={meta}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}