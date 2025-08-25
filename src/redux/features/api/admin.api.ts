/* eslint-disable @typescript-eslint/no-explicit-any */
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
        } ),
        getUserById:builder.query( {
            query: (id: string) =>
            ( {
                url: `/admin/user/${id}`,
                method: "GET",
                        
            } ),
            providesTags: [ "USER" ]
        } ),

        deleteBlockedUserById :builder.mutation( {
            query: (id: string) =>
            ( {
                url: `/delete-blocked-user/${id}`,
                method: "DELETE",
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),

        blockUserById :builder.mutation( {
            query: (id: string, blockParam: string) =>
            ( {
                url: `/block-user/${id}/${blockParam}`,
                method: "PATCH",
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),

        suspendDriverById :builder.mutation( {
            query: (id: string, suspendParam: string) =>
            ( {
                url: `/suspend-driver/${id}/${suspendParam}`,
                method: "PATCH",
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),

        approveDriverById :builder.mutation( {
            query: (id: string, approveParam: string) =>
            ( {
                url: `/approve-driver/${id}/${approveParam}`,
                method: "PATCH",
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),

        // update
        editDriverById :builder.mutation( {
            query: (id: string, payload: any) =>
            ( {
                url: `/update-driver/${id}`,
                method: "PATCH",
                data: payload
                        
            } ),
            revalidateTags: [ "USER", "DRIVER" ]
        } ),
        editUserById :builder.mutation( {
            query: (id: string, payload: any) =>
            ( {
                url: `/update-user/${id}`,
                method: "PATCH",
                data: payload
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),
    } )
} );

export const { useAllDriverDataQuery, useAllRideDataQuery, useAllUserDataQuery, useLazyGetUserByIdQuery, useEditDriverByIdMutation, useEditUserByIdMutation,} = adminApi;