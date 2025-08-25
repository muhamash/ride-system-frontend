
/* eslint-disable @typescript-eslint/no-unused-vars */
import
    {
        CardDescription,
        CardHeader,
        CardTitle
    } from "@/components/ui/card";

interface IUserShowSelector
{
    itemsPerPage: number;
    setItemsPerPage: () => void;
    setCurrentPage: () => void;
}

export default function UserShowSelector({itemsPerPage,setItemsPerPage ,setCurrentPage}: IUserShowSelector) {
    return (
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
    );
}
