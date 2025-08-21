import React from 'react';
import { Navigate } from 'react-router';
import { withAuth } from './withAuth';

export const generateRoutes = ( linkItems ) =>
{
    return linkItems?.menu?.flatMap( ( section ) =>
    {
        const routes =
            section.items?.map( ( route ) => ( {
                path: route.url,
                Component: withAuth( route.Component, route.roles ),
            } ) ) || [];

        if ( section.items?.length )
        {
            routes.unshift( {
                path: section.url,
                Component: () =>
                    React.createElement( Navigate, {
                        to: section.items[ 0 ].url,
                        replace: true,
                    } ),
            } );
        }

        return routes;
    } );
};