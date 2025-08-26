 
import { baseApi } from "@/redux/baseApi";

// interface ApiResponse<T> {
//   message: string;
//   statusCode: number;
//   data: T;
// }

export const rideApi = baseApi.injectEndpoints( {
    endpoints: ( builder ) => ( {      
        checkRideRequest: builder.query( {
            query: ( ) =>
            ( {
                url: `/driver/check-ride-request`,
                method: "POST",  
            } ),
            providesTags: [ "RIDES" ]
        } ),
        toggleDriverStatus: builder.mutation( {
            query: ( ) =>
            ( {
                url: `/driver/change-driving-status`,
                method: "PATCH",  
            } ),
            providesTags: [ "RIDES" ]
        } ),
    } )
} );

export const { useCheckRideRequestQuery, useToggleDriverStatusMutation } = rideApi;