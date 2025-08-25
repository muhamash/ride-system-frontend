import Pagination from '@/components/layouts/Pagination';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAllUserDataQuery } from "@/redux/features/api/admin.api";
import { useState } from 'react';
import ChartShow from './Chart';
import StatCards from './StatCards';
import TableContent from './TableContent';
import UserShowSelector from './UserShowSelector';

export default function ManageAccessUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [onlineOnly, setOnlineOnly] = useState(false);

  const { data: allUser, isLoading, error } = useAllUserDataQuery({
    page: currentPage,
    limit: itemsPerPage,
    search,
    sort,
  }, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading users...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">Error loading users</div>;

  const users = allUser?.data?.data || [];
  const meta = allUser?.data?.meta || {};

  // Apply online filter
  const displayedUsers = onlineOnly ? users.filter(u => u.isOnline) : users;

  // Calculate total pages
  const totalPages = Math.ceil(meta.totalDocuments / itemsPerPage);

  // Count users by role for chart (based on displayed users)
  const roleCounts = { ADMIN: 0, RIDER: 0, DRIVER: 0 };
  displayedUsers.forEach(user => {
    roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
  });

  const chartData = [
    { name: 'Admins', value: roleCounts.ADMIN, color: '#ef4444' },
    { name: 'Riders', value: roleCounts.RIDER, color: '#3b82f6' },
    { name: 'Drivers', value: roleCounts.DRIVER, color: '#10b981' },
  ];

  return (
    <div className="container mx-auto space-y-6 py-30 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="text-sm text-gray-500">
          Total Users: {meta.totalDocuments} | Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Stats Cards */}
      <StatCards users={displayedUsers} meta={meta} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <UserShowSelector itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} setCurrentPage={setCurrentPage} />
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              {/* Search Field */}
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="max-w-sm"
              />

              {/* Sort Dropdown */}
              <Select onValueChange={(value) => setSort(value)} value={sort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                  <SelectItem value="-createdAt">Newest</SelectItem>
                  <SelectItem value="createdAt">Oldest</SelectItem>
                </SelectContent>
              </Select>

              {/* Online Users Toggle */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={onlineOnly}
                  onCheckedChange={(checked) => {
                    setOnlineOnly(checked);
                    setCurrentPage(1);
                  }}
                />
                <Label>Online Users Only</Label>
              </div>
            </div>

            {/* Table */}
            <TableContent users={displayedUsers} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              meta={meta}
              setCurrentPage={setCurrentPage}
            />
          </CardContent>
        </Card>

        {/* Chart */}
        <ChartShow chartData={chartData} />
      </div>
    </div>
  );
}
