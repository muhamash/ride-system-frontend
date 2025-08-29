/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { baseApi } from "@/redux/baseApi";
import type { Ride } from "./admin.api";

// interface ApiResponse<T> {
//   message: string;
//   statusCode: number;
//   data: T;
// }

export const rideApi = baseApi.injectEndpoints( {
    endpoints: ( builder ) => ( {
        checkRideRequest: builder.mutation( {
            query: () =>
            ( {
                url: `/driver/check-ride-request`,
                method: "POST",
            } ),
            providesTags: [ "RIDES" ]
        } ),
        toggleDriverStatus: builder.mutation( {
            query: () =>
            ( {
                url: `/driver/change-driving-status`,
                method: "PATCH",
            } ),
            revalidateTags: [ "USER" ]
        } ),

        acceptRide: builder.mutation( {
            query: ( { id }: { id: string } ) =>
            ( {
                url: `/driver/accept-ride-request/${ id }`,
                method: "POST",
            } ),
            revalidateTags: [ "RIDES" ]
        } ),
        cancelRide: builder.mutation( {
            query: ( { id }: { id: string } ) =>
            ( {
                url: `/driver/cancel-ride-request/${ id }`,
                method: "POST",
            } ),
            providesTags: [ "RIDES" ]
        } ),
        getRideById: builder.query( {
            query: ( { id }: { id: string } ) =>
            ( {
                url: `/admin/ride/${ id }`,
                method: "GET",
            } ),
            providesTags: [ "RIDES" ]
        } ),

        pickUpRide: builder.mutation( {
            query: ( { id }: { id: string } ) =>
            ( {
                url: `driver/pick-up/${ id }`,
                method: "PATCH",
            } ),
            revalidateTags: [ "RIDES" ]
        } ),
        inTransitRide: builder.mutation( {
            query: ( { id }: { id: string } ) =>
            ( {
                url: `/driver/in-transit/${ id }`,
                method: "PATCH",
            } ),
            revalidateTags: [ "RIDES" ]
        } ),
        completeRide: builder.mutation( {
            query: ( { id }: { id: string } ) =>
            ( {
                url: `/driver/complete-ride/${ id }`,
                method: "PATCH",
            } ),
            revalidateTags: [ "RIDES" ]
        } ),
        requestRide: builder.mutation( {
            query: ( { payload }: { payload: any } ) =>
            ( {
                url: `/ride/request`,
                method: "POST",
                data: payload
            } ),
            revalidateTags: [ "RIDES" ]
        } ),

        getUserRides: builder.query<ApiResponse<Ride[]>,{ page?: number; limit?: number; search?: string; sort?: string; status?: string }>( {
            query: ( params = {} ) =>
            {
                const urlParams = new URLSearchParams();

                if ( params.page !== undefined ) urlParams.append( "page", params.page.toString() );
                if ( params.limit !== undefined ) urlParams.append( "limit", params.limit.toString() );
                if ( params.search ) urlParams.append( "search", params.search );
                if ( params.status ) urlParams.append( "status", params.status );
                if ( params.sort ) urlParams.append( "sort", params.sort );

                return {
                    url: `/ride/view-user-rides${ urlParams.toString() ? `?${ urlParams.toString() }` : "" }`,
                    method: "GET",
                };
            },
            serializeQueryArgs: ( { endpointName, queryArgs } ) =>
            {
                return `${ endpointName }-${ queryArgs.page ?? "" }-${ queryArgs.limit ?? "" }-${ queryArgs.search ?? "" }-${ queryArgs.sort ?? "" }-${ queryArgs.status ?? "" }`;
            },

            providesTags: [ "RIDES" ],
        } ),
        
        getAllRides: builder.query<ApiResponse<Ride[]>, { page?: number; limit?: number; search?: string; sort?: string }>(
            {
                query: ( params = {} ) =>
                {
                    const urlParams = new URLSearchParams();
                    if ( params.page ) urlParams.append( "page", params.page.toString() );
                    if ( params.limit ) urlParams.append( "limit", params.limit.toString() );
                    if ( params.search ) urlParams.append( "search", params.search );
                    if ( params.status ) urlParams.append( "status", params.status );
                    if ( params.sort ) urlParams.append( "sort", params.sort );

                    return {
                        url: `/admin/all-rides?${ urlParams.toString() }`,
                        method: "GET",
                    };
                },
                serializeQueryArgs: ( { endpointName, queryArgs } ) =>
                {
                    return `${ endpointName }-${ queryArgs.page }-${ queryArgs.limit }-${ queryArgs.search }-${ queryArgs.sort }`;
                },
                providesTags: [ "RIDES" ],
            } ),

    } )
} );

export const { useCheckRideRequestMutation, useToggleDriverStatusMutation, useAcceptRideMutation, useGetRideByIdQuery, useCancelRideMutation, useCompleteRideMutation, useInTransitRideMutation, usePickUpRideMutation, useRequestRideMutation, useGetUserRidesQuery, useGetAllRidesQuery } = rideApi;