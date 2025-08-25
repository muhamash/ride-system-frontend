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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useLazyGetUserByIdQuery } from "@/redux/features/api/admin.api";
import { Car, Mail, MapPin, Navigation, Shield, Star, User } from "lucide-react";
import { useEffect, useState } from "react";

interface UserViewDialogProps {
  userId?: string;
}

export function UserViewDialog ( { userId }: UserViewDialogProps )
{
  
  const [editOpen, setEditOpen] = useState(false);
  const [triggerGetUser, { data, isFetching }] = useLazyGetUserByIdQuery();

  // Trigger fetch only when dialog opens
  useEffect(() => {
    if (editOpen) {
      triggerGetUser(userId);
    }
  }, [editOpen, userId, triggerGetUser]);

  const user = data?.data;
  

  // Mock map component
  const MapPreview = ({ coordinates }: { coordinates?: [number, number] }) => {
    if (!coordinates) {
      return (
        <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
          <p className="text-muted-foreground">No location data available</p>
        </div>
      );
    }

    return (
      <div className="relative h-40 bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-teal-50 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-medium">User Location</p>
            <p className="text-xs text-muted-foreground mt-1">
              Coordinates: {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
            </p>
          </div>
        </div>
        <div className="absolute bottom-2 right-2">
          <Button size="sm" variant="outline" className="text-xs">
            <Navigation className="w-3 h-3 mr-1" />
            View in Maps
          </Button>
        </div>
      </div>
    );
  };

  // Rating stars component
  const RatingStars = ({ rating, totalReviews }: { rating: number; totalReviews: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < fullStars
                  ? "text-yellow-400 fill-yellow-400"
                  : i === fullStars && hasHalfStar
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">({totalReviews} reviews)</span>
      </div>
    );
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-teal-100 cursor-pointer" variant="outline">
          View user
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-1">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5" />
            User Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive information for {user?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isFetching ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : !user &&  (
            <p className="text-red-500">No user data found.</p>
          )}
        </div>

        <div className="space-y-4 py-2">
          {/* User Profile Header */}
          <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-0">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-teal-500 text-white text-lg">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{user?.name ?? "N/A"}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="w-4 h-4" />
                    {user?.email ?? "N/A"}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {user?.role ?? "N/A"}
                    </Badge>
                    <Badge variant={user?.isBlocked ? "destructive" : "default"}>
                      {user?.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Contact Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p className="text-base">{user?.phone ?? "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Joined Date</p>
                      <p className="text-base">{user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Active</p>
                      <p className="text-base">{user?.lastActive ? new Date(user.lastActive).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Specific Info */}
              {user?.role === "DRIVER" && user?.driver && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Driver Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Driver Status</p>
                        <p className="text-base capitalize">{user?.driver.driverStatus?.toLowerCase() ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Rides</p>
                        <p className="text-base">{user.driver.totalRides ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                        <p className="text-base font-semibold">${user.driver.totalEarnings?.toFixed(2) ?? "0.00"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Acceptance Rate</p>
                        <div className="flex items-center gap-2">
                          <Progress value={user.driver.acceptanceRate || 0} className="h-2 w-24" />
                          <span className="text-sm">{user.driver.acceptanceRate || 0}%</span>
                        </div>
                      </div>
                    </div>

                     
                    {user?.driver?.rating && (
                      <>
                        <Separator />
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Ratings</h5>
                          <RatingStars 
                            rating={user.driver.rating.averageRating || 0} 
                            totalReviews={user.driver.rating.totalRating || 0} 
                          />
                          
                          {/* Rating breakdown */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {user.driver.rating.breakdown && Object.entries(user.driver.rating.breakdown).map(([category, score]) => (
                              <div key={category} className="flex items-center justify-between text-sm">
                                <span className="capitalize">{category.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{score}/5</span>
                                  <Progress value={score * 20} className="h-1.5 w-16" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Vehicle Info */}
              {user?.vehicleInfo && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Model</p>
                        <p className="text-base">{user.vehicleInfo.model ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Year</p>
                        <p className="text-base">{user.vehicleInfo.year ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">License Plate</p>
                        <p className="text-base font-mono">{user.vehicleInfo.plateNumber ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Color</p>
                        <p className="text-base">{user.vehicleInfo.color ?? "N/A"}</p>
                      </div>
                    </div>
                    {user.vehicleInfo.verificationStatus && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-muted-foreground">Verification Status</p>
                        <Badge
                          variant={
                            user.vehicleInfo.verificationStatus === "APPROVED" 
                              ? "default"
                              : user.vehicleInfo.verificationStatus === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                          className="mt-1"
                        >
                          {user.vehicleInfo.verificationStatus}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Location & Stats */}
            <div className="space-y-4">
              {/* Location Map */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.location ? (
                    <>
                      <MapPreview coordinates={user.location.coordinates as [number, number]} />
                      <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="text-base mt-1">{user.location.address ?? "N/A"}</p>
                      </div>
                      {user.location.lastUpdated && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Last updated: {new Date(user.location.lastUpdated).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
                      <p className="text-muted-foreground">No location data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Completed Trips</span>
                      <span className="font-medium">{user?.stats?.completedTrips || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cancellation Rate</span>
                      <span className="font-medium">{user?.stats?.cancellationRate || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="font-medium">{user?.stats?.avgResponseTime || 0}s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter className="px-1">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {user?.role === "DRIVER" && (
            <Button className="bg-teal-600 hover:bg-teal-700">
              View Full Profile
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}