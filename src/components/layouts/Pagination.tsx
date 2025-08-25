/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { Button } from "@/components/ui/button";
import
    {
        ChevronLeft,
        ChevronRight,
        ChevronsLeft,
        ChevronsRight
    } from "lucide-react";


interface IPagination
{
    currentPage: any;
    itemsPerPage: never;
    totalPages: number;
    meta: any;
    setCurrentPage: () => void;
}

export default function Pagination ( { currentPage, itemsPerPage, totalPages, meta, setCurrentPage }: IPagination )
{
    // Generate page numbers for pagination
    const getPageNumbers = () =>
    {
        const pages = [];
        const maxVisiblePages = 5;
    
        let startPage = Math.max( 1, currentPage - Math.floor( maxVisiblePages / 2 ) );
        const endPage = Math.min( totalPages, startPage + maxVisiblePages - 1 );
    
        if ( endPage - startPage + 1 < maxVisiblePages )
        {
            startPage = Math.max( 1, endPage - maxVisiblePages + 1 );
        }
    
        for ( let i = startPage; i <= endPage; i++ )
        {
            pages.push( i );
        }
    
        return pages;
    };

    // Pagination handlers
    const goToPage = ( page ) =>
    {
        if ( page >= 1 && page <= totalPages )
        {
            setCurrentPage( page );
        }
    };
    
    return (
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
    );
}
