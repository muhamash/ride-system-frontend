/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { UserViewDialog } from '@/components/dialogs/UsrViewDialaog';
import { Badge } from '@/components/ui/badge';
import
    {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from "@/components/ui/table";
import { useUserDataQuery } from '@/redux/features/api/auth.api';
import
    {
        Bike,
        Shield,
        User
    } from "lucide-react";
import DropDownMenu from './DropDownMenu';
    
interface ITableContent
{
    users: any;
}

export default function TableContent ( { users }: ITableContent )
{
      
    const getRoleIcon = ( role ) =>
    {
        switch ( role )
        {
            case 'ADMIN': return <Shield className="h-4 w-4" />;
            case 'DRIVER': return <Bike className="h-4 w-4" />;
            default: return <User className="h-4 w-4" />;
        }
    };
    
    const formatDate = ( dateString ) =>
    {
        return new Date( dateString ).toLocaleDateString( 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        } );
    };

    const { data: userData, isLoading } = useUserDataQuery();
    const dataOwn = userData?.data;

    if ( isLoading )
    {
        return <p>Loading..</p>
    }

    // console.log(users)
    
    return (
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
                {users?.map( ( user ) => (
                    <TableRow className={`${ user?.isBlocked && "bg-red-200" } ${ user?._id === dataOwn?._id && "bg-pink-200" }`} key={user?._id}>
                        <TableCell >
                            <div className='flex flex-col gap-3'>
                                <div className="flex flex-col">
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                        
                                </div>
                                <UserViewDialog userId={user?._id} />
                            </div>
                        </TableCell>
                        <TableCell >
                            <div className='grid grid-cols-1 gap-2'>
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
                                {
                                    user?.driver && (
                                        <Badge className='mt-2'>
                                            {user?.driver?.driverStatus}
                                        </Badge>
                                    )
                                }
                                {
                                    user?.driver && (
                                        <Badge className={`${user?.driver?.isApproved ? "bg-green-800" : "bg-rose-800"}`}>
                                        {user?.driver?.isApproved ? "Approved" : "NotApproved"}
                                        </Badge>
                                    )
                                }
                            </div>
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

                        {user._id !== dataOwn._id ? (
                            <DropDownMenu user={user}/>
                        ) : (
                            <div className='text-center flex justify-center items-center'>
                                <Badge>You!</Badge>
                            </div>
                        )}

                        <TableCell className="text-right">
                            
                        </TableCell>
                    </TableRow>
                ) )}
            </TableBody>
        </Table>
    );
}
