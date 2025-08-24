/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserViewDialog } from '@/components/dialogs/UsrViewDialaog';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import
  {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import
  {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import
  {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { useAllUserDataQuery } from "@/redux/features/api/admin.api";
import
  {
    BanIcon,
    Bike,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Edit,
    MoreHorizontal,
    Shield,
    Trash2,
    User
  } from "lucide-react";
import { useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";


export default function ManageAccessUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const { data: allUser, isLoading, error } = useAllUserDataQuery( {
    page: currentPage,
    limit: itemsPerPage
  }, {
    refetchOnMountOrArgChange: true,
  } );

    console.log(allUser, error)
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading users...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error loading users</div>;
  }
  
  const users = allUser?.data?.data || [];
  const meta = allUser?.data?.meta || {};
  
  // Calculate total pages
  const totalPages = Math.ceil(meta.totalDocuments / itemsPerPage);
  
  // Count users by role for the chart
  const roleCounts = {
    ADMIN: 0,
    RIDER: 0,
    DRIVER: 0
  };
  
  users.forEach(user => {
    roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
  });
  
  const chartData = [
    { name: 'Admins', value: roleCounts.ADMIN, color: '#ef4444' },
    { name: 'Riders', value: roleCounts.RIDER, color: '#3b82f6' },
    { name: 'Drivers', value: roleCounts.DRIVER, color: '#10b981' },
  ];
  
  const COLORS = ['#ef4444', '#3b82f6', '#10b981'];
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getRoleIcon = (role) => {
    switch(role) {
      case 'ADMIN': return <Shield className="h-4 w-4" />;
      case 'DRIVER': return <Bike className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handleUserClick = ( id: string ) =>
  {
    console.log( "Clicked ID:", id ); 
  };

  return (
    <div className="container mx-auto space-y-6 py-30 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="text-sm text-gray-500">
          Total Users: {meta.totalDocuments} | Page {currentPage} of {totalPages}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Across all roles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter( user => user.isOnline ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
            <BanIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter( user => user.isBlocked ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Restricted access
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage all system users with actions to edit, block, or delete.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <select
                value={itemsPerPage}
                onChange={( e ) =>
                {
                  setItemsPerPage( Number( e.target.value ) );
                  setCurrentPage( 1 );
                }}
                className="h-8 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-muted-foreground">per page</span>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map( ( user ) => (
                  <TableRow key={user._id}>
                    <TableCell >
                      <div className='flex flex-col gap-3'>
                        <div className="flex flex-col">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        
                      </div>
                        <UserViewDialog userId={ user?._id } />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 ${ user.role === 'ADMIN'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : user.role === 'DRIVER'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                      >
                        {getRoleIcon( user.role )}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Badge
                          variant={user.isBlocked ? "destructive" : "outline"}
                          className={`w-fit ${ !user.isBlocked && user.isOnline ? 'bg-green-50 text-green-700 border-green-200' : '' }`}
                        >
                          {user.isBlocked ? 'Blocked' : user.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                        {user.lastOnlineAt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Last online: {formatDate( user.lastOnlineAt )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate( user.createdAt )}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {user.isBlocked ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Unblock User
                              </>
                            ) : (
                              <>
                                <BanIcon className="mr-2 h-4 w-4" />
                                Block User
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ) )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {( ( currentPage - 1 ) * itemsPerPage ) + 1} to {Math.min( currentPage * itemsPerPage, meta.totalDocuments )} of {meta.totalDocuments} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage( 1 )}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage( currentPage - 1 )}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {getPageNumbers().map( page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage( page )}
                  >
                    {page}
                  </Button>
                ) )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage( currentPage + 1 )}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage( totalPages )}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>
              Breakdown of users by role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={( { name, percent } ) => `${ name }: ${ ( percent * 100 ).toFixed( 0 ) }%`}
                  >
                    {chartData.map( ( entry, index ) => (
                      <Cell key={`cell-${ index }`} fill={COLORS[ index % COLORS.length ]} />
                    ) )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              {chartData.map( ( item, index ) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[ index ] }}
                    ></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ) )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}