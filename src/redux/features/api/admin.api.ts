import { baseApi } from "@/redux/baseApi";

export const adminApi = baseApi.injectEndpoints( {
    endpoints: ( builder ) => ( {
        allUserData: builder.query( {
            query: ( params ) =>
            {
                const urlParams = new URLSearchParams();

    
                if ( params.page ) urlParams.append( "page", params.page );
                if ( params.limit ) urlParams.append( "limit", params.limit );

                // console.log( params, `/admin/user/all?${ urlParams.toString() }` );

                // return `/admin/user/all?${ urlParams.toString() }`;
                return {
                    url: `/admin/user/all?${ urlParams.toString() }`,
                    method: "GET",
                };
            },
            providesTags: [ "USER" ],
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs.page}-${queryArgs.limit}`;
            },
        } ),

        allDriverData: builder.query( {
            query: () =>
            ( {
                url: "/admin/driver/all",
                method: "GET",
                        
            } ),
            providesTags: [ "DRIVER" ]
        } ),
        allRideData: builder.query( {
            query: () =>
            ( {
                url: "/admin/all-rides",
                method: "GET",
                        
            } ),
            providesTags: [ "RIDES" ]
        } )
    } )
} );

export const { useAllDriverDataQuery, useAllRideDataQuery, useAllUserDataQuery} = adminApi;