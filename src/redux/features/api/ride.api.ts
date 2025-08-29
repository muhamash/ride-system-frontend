/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { baseApi } from "@/redux/baseApi";

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

        getUserRides: builder.query( {
            query: ( { page = 1, limit = 5, search = "", status = "" } ) => ( {
                url: `/ride/view-user-rides?page=${ page }&limit=${ limit }&search=${ search }&status=${ status }`,
                method: "GET",
            } ),
            providesTags: [ "RIDES" ],
        } ),
        getAllRides: builder.query( {
            query: ( { page = 1, limit = 5, search = "", status = "" } ) => ( {
                url: `/admin/all-rides?page=${ page }&limit=${ limit }&search=${ search }&status=${ status }`,
                method: "GET",
            } ),
            providesTags: [ "RIDES" ],
        } ),


    } )
} );

export const { useCheckRideRequestMutation, useToggleDriverStatusMutation, useAcceptRideMutation, useGetRideByIdQuery, useCancelRideMutation, useCompleteRideMutation, useInTransitRideMutation, usePickUpRideMutation, useRequestRideMutation, useGetUserRidesQuery, useGetAllRidesQuery } = rideApi;