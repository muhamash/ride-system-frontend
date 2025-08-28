import axios, { type AxiosRequestConfig } from "axios";
import { envString } from "./envString";

export const axiosInstance = axios.create({
  baseURL: envString.baseUrl,
  withCredentials: true,
  timeout: 10000,
  headers: { "X-Custom-Header": "test" },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let pendingQueue: {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  pendingQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null);
    }
  });
  pendingQueue = [];
};

axiosInstance.interceptors.response.use(
    ( response ) => response,
    async ( error ) =>
    {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if ( originalRequest.url?.includes( "/auth/refresh-token" ) )
        {
            return Promise.reject( error );
        }

        if (
            error?.response?.status === 403 &&
            error?.response?.data?.message === "No Token Received!" &&
            !originalRequest._retry
        )
        {
            originalRequest._retry = true;

            if ( isRefreshing )
            {
                return new Promise( ( resolve, reject ) =>
                {
                    pendingQueue.push( { resolve, reject } );
                } )
                    .then( () => axiosInstance( originalRequest ) )
                    .catch( ( err ) => Promise.reject( err ) );
            }

            isRefreshing = true;
            try
            {
                await axiosInstance.post( "/auth/refresh-token" );

                console.log( "new tokens!!" );

                processQueue( null );

                // Retry original request
                return axiosInstance( originalRequest );
            } catch ( err )
            {
                processQueue( err );
                return Promise.reject( err );
            } finally
            {
                isRefreshing = false;
            }
        }

        return Promise.reject( error );
    }
);