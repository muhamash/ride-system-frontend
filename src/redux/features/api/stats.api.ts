import { baseApi } from "@/redux/baseApi";

export const statsApi = baseApi.injectEndpoints( {
    endpoints: ( builder ) => ( {
        getDriverStatsByDriver : builder.query( {
            query: ( ) =>
            ( {
                url: `/driver/driver-stats`,
                method: "GET",
            } ),
        } ),
        getUserStatsByUser : builder.query( {
            query: ( ) =>
            ( {
                url: `/user/user-stats`,
                method: "GET",
            } ),
        })
    } )
} );

export const { useGetDriverStatsByDriverQuery, useGetUserStatsByUserQuery } = statsApi;