import { baseApi } from "@/redux/baseApi";

export const locationService = baseApi.injectEndpoints( {
    endpoints: ( builder ) => ( {
        searchLocation: builder.mutation( {
            query: ( payload ) => ( {
                url: "/location/search",
                method: "POST",
                data: payload
            } )
        } ),
        getDirection: builder.mutation( {
            query: ( payload ) => ( {
                url: "/location/get-direction",
                method: "POST",
                data: payload
            } )
        } ),
    } )
} );

export const { useSearchLocationMutation, useGetDirectionMutation } = locationService;