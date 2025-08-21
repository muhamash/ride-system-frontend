import type { UserRole } from "@/constants/userRole";
import { useUserDataQuery } from "@/redux/features/api/auth.api";
import type { ComponentType } from "react";
import { Navigate } from "react-router";


export const withAuth = ( Component: ComponentType, allowedRoles?: UserRole[] ) =>
{
    return function AuthWrapper ()
    {
        const { data, isLoading } = useUserDataQuery();
        const userRole = data?.data?.role;

        if ( !data?.data?.username && !isLoading )
        {
            return <Navigate to="/login" />;
        }

        if ( allowedRoles && !isLoading && !allowedRoles.includes( userRole ) )
        {
            return <Navigate to="/unauthorized" />;
        }

        return <Component />;
    };
};