import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints( {
    endpoints: ( builder ) => ( {
        register: builder.mutation( {
            query: ( userInfo ) => ( {
                url: "/user/create",
                method: "POST",
                data: userInfo
            } )
        } ),
        login: builder.mutation( {
            query: ( userInfo ) => ( {
                url: "/auth/login",
                method: "POST",
                data: userInfo
            } ),
        } ),
        logout: builder.mutation( {
            query: () => ( {
                url: "/auth/logout",
                method: "POST",
            } ),
            invalidatesTags: ["USER"]
        } ),
        userData: builder.query( {
            query: () =>
            ( {
                url: "/user/me",
                method: "GET",
                        
            } ),
            providesTags: ["USER"]
        } )
    } )
} );

export const { useRegisterMutation, useLoginMutation, useUserDataQuery, useLogoutMutation } = authApi;