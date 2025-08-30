/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import
  {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { useLazyGetUserByIdQuery } from "@/redux/features/api/admin.api";
import
  {
    Award,
    BarChart3,
    Calendar,
    Car,
    Clock,
    CreditCard,
    Mail,
    MapPin,
    Navigation,
    Shield,
    Star,
    TrendingUp,
    UserCheck,
    UserX
  } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface UserViewDialogProps {
  userId?: string;
}

export function UserViewDialog({ userId }: UserViewDialogProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [triggerGetUser, { data, isFetching, isLoading }] = useLazyGetUserByIdQuery();

  useEffect(() => {
    if (editOpen) {
      triggerGetUser(userId);
    }
  }, [editOpen, triggerGetUser, userId]);

  const user = data?.data?.user;
  const stats = data?.data?.stats;

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-6">
      <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
    </div>
  );

  const getRatingDistribution = (ratings: any[]) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    ratings?.forEach(rating => {
      const stars = Math.round(rating.value);
      if (stars >= 1 && stars <= 5) {
        distribution[stars as keyof typeof distribution]++;
      }
    });
    
    return Object.entries(distribution).map(([name, value]) => ({
      name: `${name} star${value !== 1 ? 's' : ''}`,
      value
    }));
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOnlineStatus = (lastOnline: string) => {
    const lastOnlineDate = new Date(lastOnline);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastOnlineDate.getTime()) / (1000 * 60));
    
    if (diffMinutes < 5) return { status: "Online", variant: "default" as const };
    if (diffMinutes < 60) return { status: `Last online ${diffMinutes} min ago`, variant: "secondary" as const };
    if (diffMinutes < 1440) return { status: `Last online ${Math.floor(diffMinutes/60)} hours ago`, variant: "outline" as const };
    return { status: `Last online ${Math.floor(diffMinutes/1440)} days ago`, variant: "outline" as const };
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      AVAILABLE: { variant: "default", label: "Available" },
      ON_RIDE: { variant: "secondary", label: "On Ride" },
      OFFLINE: { variant: "outline", label: "Offline" },
      BLOCKED: { variant: "destructive", label: "Blocked" }
    };
    
    const config = statusConfig[status] || { variant: "outline", label: status };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const onlineStatus = user ? getOnlineStatus(user.lastOnlineAt) : { status: "Unknown", variant: "outline" as const };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="bg-teal-100">View user</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Comprehensive information for {user?.name}
          </DialogDescription>
        </DialogHeader>

        {isFetching || isLoading ? (
          <LoadingSpinner />
        ) : !user ? (
          <p className="text-red-500 text-center">No user data found.</p>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-0 shadow-sm">
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-teal-500 text-white text-xl">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold">{user.name}</h3>
                    <Badge variant="secondary" className="gap-1">
                      <Shield className="w-3 h-3" /> {user.role}
                    </Badge>
                    <Badge variant={user.isBlocked ? "destructive" : "default"}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                    <Badge variant={onlineStatus.variant}>
                      {user.isOnline ? "Online" : onlineStatus.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                    
                    {user.driver?.username && (
                      <div className="flex items-center gap-2 text-sm">
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                        <span>Driver ID: {user.driver.username}</span>
                      </div>
                    )}
                    
                    {user.driver?.driverStatus && (
                      <div className="flex items-center gap-2 text-sm">
                        <Navigation className="w-4 h-4 text-muted-foreground" />
                        <StatusBadge status={user.driver.driverStatus} />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Driver Stats */}
                {user.role === "DRIVER" && user.driver && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Driver Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                          <p className="text-2xl font-bold text-teal-600 flex items-center gap-1">
                            {(user.driver.totalEarnings || 0).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2
                            })}
                          </p>
                        </div>
                        
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground">Total Rides</p>
                          <p className="text-2xl font-bold text-blue-600">{user.driver.totalRides || 0}</p>
                        </div>
                        
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < (user.driver.rating?.averageRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                              />
                            ))}
                            <span className="text-lg font-bold ml-1">
                              {user.driver.rating?.averageRating?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ({user.driver.rating?.totalRatings || 0} reviews)
                          </p>
                        </div>
                        
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground">Approval Status</p>
                          <div className="flex items-center gap-1">
                            {user.driver.isApproved ? (
                              <>
                                <UserCheck className="w-4 h-4 text-green-600" />
                                <span className="font-medium">Approved</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-4 h-4 text-amber-600" />
                                <span className="font-medium">Pending Approval</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Rating Distribution Chart */}
                      {user.driver.rating?.ratings && user.driver.rating.ratings.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Rating Distribution</h4>
                          <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={getRatingDistribution(user.driver.rating.ratings)}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={60}
                                  paddingAngle={2}
                                  dataKey="value"
                                  label={({ name, percent }) => 
                                    `${name} (${(percent * 100).toFixed(0)}%)`
                                  }
                                >
                                  {getRatingDistribution(user.driver.rating.ratings).map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={[
                                        '#f87171', // red for 1-star
                                        '#fb923c', // orange for 2-star
                                        '#fbbf24', // amber for 3-star
                                        '#a3e635', // lime for 4-star
                                        '#4ade80'  // green for 5-star
                                      ][index]} 
                                    />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Rider Stats */}
                {(user.role === "RIDER" || user.role === "ADMIN") && stats && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Ride Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground">Total Trips</p>
                          <p className="text-2xl font-bold text-blue-600">{stats.totalTrips || 0}</p>
                        </div>
                        
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                          <p className="text-2xl font-bold text-teal-600 flex items-center gap-1">

                            {(stats.totalSpent || 0).toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {stats.tripHistoryChart && stats.tripHistoryChart.length > 0 && (
                        <>
                          <h4 className="text-sm font-medium mb-2">Spending Trend</h4>
                          <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={stats.tripHistoryChart}>
                                <XAxis 
                                  dataKey="date" 
                                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  fontSize={12}
                                />
                                <YAxis fontSize={12} />
                                <Tooltip 
                                  formatter={(value) => [
                                    Number(value).toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: 'USD'
                                    }),
                                    'Fare'
                                  ]}
                                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                                />
                                <Bar dataKey="fare" fill="#0d9488" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Location Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user?.location ? (
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Navigation className="w-4 h-4 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Coordinates</p>
                            <p className="text-sm">
                              {user.location.coordinates?.[0]?.toFixed(6)}, {user.location.coordinates?.[1]?.toFixed(6)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm">{user.location.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Last Location Update</p>
                            <p className="text-sm">{formatDate(user.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No location data available</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Vehicle Information */}
                {user.role === "DRIVER" && user.driver?.vehicleInfo && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        Vehicle Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">License Plate</p>
                            <p className="text-sm">{user.driver.vehicleInfo.plateNumber}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Model</p>
                            <p className="text-sm">{user.driver.vehicleInfo.model}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">License Number</p>
                            <p className="text-sm">{user.driver.vehicleInfo.license}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Earnings/Rides Chart */}
                {user.role === "DRIVER" && user.driver && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Earnings Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {user.driver.rides && user.driver.rides.length > 0 ? (
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={user.driver.rides
                                .slice()
                                .sort((a: any, b: any) => 
                                  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                                )
                                .map((ride: any) => ({
                                  date: ride.createdAt,
                                  fare: ride.fare,
                                  dateFormatted: new Date(ride.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                }))}
                            >
                              <XAxis 
                                dataKey="dateFormatted"
                                fontSize={12}
                              />
                              <YAxis 
                                fontSize={12}
                                tickFormatter={(value) => `$${value}`}
                              />
                              <Tooltip 
                                formatter={(value) => [
                                  Number(value).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                  }),
                                  'Earnings'
                                ]}
                                labelFormatter={(label, payload) => {
                                  if (payload && payload.length > 0) {
                                    return `Date: ${payload[0].payload.dateFormatted}`;
                                  }
                                  return `Date: ${new Date(label).toLocaleDateString()}`;
                                }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="fare" 
                                stroke="#0d9488" 
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No ride data available</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Account Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Account Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Registration Date</span>
                        <span className="text-sm">{formatDate(user.createdAt)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Last Updated</span>
                        <span className="text-sm">{formatDate(user.updatedAt)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Block Status</span>
                        <Badge variant={user.isBlocked ? "destructive" : "default"}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </div>
                      
                      {user.role === "DRIVER" && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Approval Status</span>
                          <Badge variant={user.driver?.isApproved ? "default" : "secondary"}>
                            {user.driver?.isApproved ? "Approved" : "Pending Approval"}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Online Status</span>
                        <Badge variant={onlineStatus.variant}>
                          {user.isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                      
                      {!user.isOnline && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Last Online</span>
                          <span className="text-sm">{formatDate(user.lastOnlineAt)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}