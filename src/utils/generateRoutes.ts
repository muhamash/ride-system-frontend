import { withAuth } from "./withAuth";

export const generateRoutes = ( linkItems ) =>
{
    return linkItems?.menu?.flatMap( ( section ) =>
        section.items?.map( ( route ) => ( {
            path: route.url,
            Component : withAuth(route.Component, route.roles)
        } ) ) || []
    );
};