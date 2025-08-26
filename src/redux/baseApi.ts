import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export const baseApi = createApi( {
    reducerPath: "baseApi",
    baseQuery: axiosBaseQuery(),
    // prepareHeaders: ( headers ) =>
    // {
    //     headers.set( 'Content-Type', 'application/json' );
    //     return headers;
    // },
    tagTypes: [ "USER", "DRIVER", "RIDES", "RIDER", "RIDE" ],
    endpoints: () =>
    ( {
        
    } ),
} );