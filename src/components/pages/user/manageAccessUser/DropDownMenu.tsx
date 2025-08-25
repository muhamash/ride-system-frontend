/* eslint-disable @typescript-eslint/no-explicit-any */

import EditUserDialog from '@/components/dialogs/editUserDialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BanIcon, Car, CheckCircle, Edit, MoreHorizontal, Trash2 } from "lucide-react";

interface IDropDownMenu
{
    user: any
}

export default function DropDownMenu({user}: IDropDownMenu) {
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
                    <div className='flex items-center gap-2'>
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
                            <div className='flex items-center gap-2'>
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
                <DropdownMenuItem className="text-red-600">
                    <Trash2 className=" h-4 w-4" />
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
