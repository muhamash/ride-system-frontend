/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import
    {
        Card,
        CardContent,
        CardHeader,
        CardTitle
    } from "@/components/ui/card";
import
    {
        BanIcon,
        CheckCircle,
        User
    } from "lucide-react";

interface IStateCards
{
    users: any;
    meta: any;
}    

export default function StatCards({users, meta}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
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
  )
}
