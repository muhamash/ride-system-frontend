 
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
            query: ( id: string ) =>
            ( {
                url: `/driver/cancel-ride-request/${ id }`,
                method: "POST",
            } ),
            providesTags: [ "RIDES" ]
        } ),
        getRideById: builder.query( {
            query: (  { id }: { id: string } ) =>
            ( {
                url: `/admin/ride/${ id }`,
                method: "GET",
            } ),
            providesTags: [ "RIDES" ]
        } ),

    } )
} );

export const { useCheckRideRequestMutation, useToggleDriverStatusMutation, useAcceptRideMutation, useGetRideByIdQuery } = rideApi;