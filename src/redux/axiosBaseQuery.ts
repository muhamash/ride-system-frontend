import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from '../lib/axios';

export const axiosBaseQuery =
    (
        // { baseUrl }: { baseUrl: string } = { baseUrl: '' },
    ): BaseQueryFn<
        {
            url: string
            method?: AxiosRequestConfig[ 'method' ]
            data?: AxiosRequestConfig[ 'data' ]
            params?: AxiosRequestConfig[ 'params' ]
            headers?: AxiosRequestConfig[ 'headers' ]
        },
        unknown,
        unknown
    > =>
        async ( { url, method, data, params, headers } ) =>
        {
            console.log( url, method )
            try
            {
                const result = await axiosInstance( {
                    url,
                    method,
                    data,
                    params,
                    headers,
                } );
                
                return { data: result.data }
            }
            catch ( axiosError )
            {
                const err = axiosError as AxiosError
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    },
                }
            }
        };