import axios from "axios";
import { envString } from "./envString";

export const axiosInstance = axios.create( {
    baseURL: envString.baseUrl || "http://localhost:3000/api",
    timeout: 10000,
    headers: { "X-Custom-Header": "test" , "Authorization": "eikhane token er kono kaj nai!!"},
    withCredentials: true
} );

// Add a request interceptor
axiosInstance.interceptors.request.use( function ( config )
{
    // Do something before request is sent
    // console.log(config)
    return config;
}, function ( error )
{
    // Do something with request error
    return Promise.reject( error );
},
    // { synchronous: true, runWhen: () => /* This function returns true */}
);

// Add a response interceptor
axiosInstance.interceptors.response.use( function onFulfilled ( response )
{
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log( response )
    return response;
}, function onRejected ( error )
{
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject( error );
} );