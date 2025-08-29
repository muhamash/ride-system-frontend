/* eslint-disable @typescript-eslint/no-explicit-any */
import type { approvalParam, blockParam, suspendParam } from "@/components/pages/user/manageAccessUser/type";
import { baseApi } from "@/redux/baseApi";

export interface Ride {
  _id: string;
  pickUpLocation: { address: string };
  dropOffLocation: { address: string };
  driverUserName: string;
  riderUserName: string;
  status: string;
}

export interface Meta {
  limit: number;
  page: number;
  totalDocuments: number;
  totalPage: number;
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  data: {
    data: T;
    meta: Meta;
  };
}
export const adminApi = baseApi.injectEndpoints( {
    endpoints: ( builder ) => ( {
        allUserData: builder.query<ApiResponse<User[]>, { page?: number; limit?: number; search?: string; sort?: string }>(
            {
                query: ( params ) =>
                {
                    const urlParams = new URLSearchParams();
                    if ( params.page ) urlParams.append( "page", params.page.toString() );
                    if ( params.limit ) urlParams.append( "limit", params.limit.toString() );
                    if ( params.search ) urlParams.append( "search", params.search );
                    if ( params.sort ) urlParams.append( "sort", params.sort );

                    return {
                        url: `/admin/user/all?${ urlParams.toString() }`,
                        method: "GET",
                    };
                },
                serializeQueryArgs: ( { endpointName, queryArgs } ) =>
                {
                    return `${ endpointName }-${ queryArgs.page }-${ queryArgs.limit }-${ queryArgs.search }-${ queryArgs.sort }`;
                },
            }
        ),

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

        getUserById: builder.query( {
            query: ( id: string ) =>
            ( {
                url: `/admin/user/${ id }`,
                method: "GET",
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),

        deleteBlockedUserById: builder.mutation( {
            query: ( id: string ) =>
            ( {
                url: `/admin/delete-blocked-user/${ id }`,
                method: "DELETE",
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),

        blockUserById: builder.mutation( {
            query: ( { id, blockParam }: { id: string; blockParam: blockParam } ) =>
            ( {
                
                url: `/admin/block-user/${ id }/${ blockParam }`,
                method: "PATCH",
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),

        suspendDriverById: builder.mutation( {
            query: ( { id, suspendParam }: { id: string; suspendParam: suspendParam } ) =>
            ( {
                url: `admin/suspend-driver/${ id }/${ suspendParam }`,
                method: "PATCH",
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),

        approveDriverById: builder.mutation( {
            query: ( { id, approveParam }: { id: string; approveParam: approvalParam } ) =>
            ( {
                url: `admin/approve-driver/${ id }/${ approveParam }`,
                method: "PATCH",
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),

        // update
        editDriverById: builder.mutation( {
            query: ( {id, payload}: {id: string, payload: any} ) =>
            ( {
                url: `/driver/driver-update-vehicle/${ id }`,
                method: "PATCH",
                data: payload
                        
            } ),
            revalidateTags: [ "USER", "DRIVER" ]
        } ),
        
        editUserById: builder.mutation( {
            query: ( { id, payload }: { id: string, payload: any } ) =>
            ( {
                url: `/user/update-user/${ id }`,
                method: "PATCH",
                data: payload
                        
            } ),
            revalidateTags: [ "USER" ]
        } ),
        
    } )
} );

export const { useAllDriverDataQuery, useAllRideDataQuery, useAllUserDataQuery, useLazyGetUserByIdQuery, useEditDriverByIdMutation, useEditUserByIdMutation, useBlockUserByIdMutation, useSuspendDriverByIdMutation, useApproveDriverByIdMutation, useDeleteBlockedUserByIdMutation, useGetUserByIdQuery} = adminApi;