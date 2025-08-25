 
/* eslint-disable @typescript-eslint/no-explicit-any */

import EditUserDialog from '@/components/dialogs/editUserDialog';
import { useMyToast } from '@/components/layouts/MyToast';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { adminApi, useBlockUserByIdMutation, useDeleteBlockedUserByIdMutation, useSuspendDriverByIdMutation } from '@/redux/features/api/admin.api';
import { useAppDispatch } from '@/redux/hooks';
import { BanIcon, Car, CheckCircle, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import type { blockParam, suspendParam } from './type';

interface IDropDownMenu
{
    user: any
}

export default function DropDownMenu ( { user }: IDropDownMenu )
{

    const [ blockUserById ] = useBlockUserByIdMutation();
    const [ suspendUserById ] = useSuspendDriverByIdMutation();
    const [ deleteBlockUserById ] = useDeleteBlockedUserByIdMutation();

    const { showToast, updateToast } = useMyToast();
    
    const dispatch = useAppDispatch();

    const handleBlockUser = async () =>
    {
     
        const toastId = showToast( {
            message: "Trying to action[Block]..",
            type: "loading",
            autClose: false,
        } );

        const action: blockParam = user?.isBlocked ? "rollback" : "block";

        try
        {
            const res = await blockUserById( { id: user?._id, blockParam: action } ).unwrap();

            console.log(res.data)
            updateToast( toastId, {
                message: res?.message,
                type: "success"
            } );
            
            dispatch( adminApi.util.resetApiState() );

            
        }
        catch ( error )
        {
            updateToast(toastId, {
                    message: error?.message || error?.data?.message,
                    type: "error"
            } );
            
            console.error( "Error updating user:", err );
        }
    };

    const handleDelete = async () =>
    {
        const toastId = showToast( {
            message: "Trying to action[DELETE]..",
            type: "loading",
            autClose: false,
        } );

        try
        {
            const res = await deleteBlockUserById( user?._id ).unwrap();

            updateToast(toastId, {
                    message: res?.message,
                    type: "success"
            } );
            dispatch( adminApi.util.resetApiState() );

        } catch ( error )
        {
            updateToast(toastId, {
                    message: error?.message || error?.data?.message,
                    type: "error"
            } );
            console.error( "Error approving user:", error );
        }
    };

    const handleSuspendUser = async () =>
    {
        const toastId = showToast( {
            message: "Trying to action[SUSPENDED]..",
            type: "loading",
            autClose: false,
        } );

        const action: suspendParam = user?.driver?.driverStatus === "SUSPENDED" ? "rollback" : "suspend";

        try
        {
            const res = await suspendUserById( { id: user?._id, suspendParam: action } ).unwrap();
            updateToast(toastId, {
                    message: res?.message,
                    type: "success"
            } );
            dispatch( adminApi.util.resetApiState() );
        } catch ( error )
        {
            updateToast( toastId, {
                message: error?.message || error?.data?.message,
                type: "error"
            } );
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
    
            <DropdownMenuContent align="end">
                {/* Edit */}
                <DropdownMenuItem>
                    <div className='flex items-center gap-2'>
                        <Edit className="h-4 w-4" />
                        <div onClick={( e ) => e.stopPropagation()}>
                            <EditUserDialog user={user} />
                        </div>
                    </div>
                </DropdownMenuItem>
    
                {/* Block / Unblock */}
                <DropdownMenuItem>
                    <div onClick={handleBlockUser} className='flex items-center gap-2'>
                        {user.isBlocked ? (
                            <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <p>Unblock</p>
                            </>
                        ) : (
                            <>
                                <BanIcon className="h-4 w-4 text-rose-600" />
                                <p>Block</p>
                            </>
                        )}
                    </div>
                </DropdownMenuItem>
    
                {/* Suspend / Unsuspend */}
                {
                    user?.driver && (
                        <DropdownMenuItem>
                            <div onClick={handleSuspendUser} className='flex items-center gap-2'>
                                {user?.driver?.driverStatus === "SUSPENDED" ? (
                                    <>
                                        <Car className='h-4 w-4 text-cyan-600' />
                                        <p>Un-Suspend</p>
                                    </>
                                ) : (
                                    <>
                                        <Car className='h-4 w-4 text-rose-600' />
                                        <p>Suspend</p>
                                    </>
                                )}
                            </div>
                        </DropdownMenuItem>
                    )
                }
    
                {/* Delete */}
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className=" h-4 w-4" />
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
