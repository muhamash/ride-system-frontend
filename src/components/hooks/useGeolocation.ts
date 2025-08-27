/* eslint-disable @typescript-eslint/no-unused-vars */
import { envString } from "@/lib/envString";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

const API_KEY = envString.locationIQToken;

export const useContinuousLocation = ( userId: string ) =>
{
    const [ coords, setCoords ] = useState<LocationData | null>( null );
    const [ error, setError ] = useState<string | null>( null );
    const watchIdRef = useRef<number | null>( null );
    const socketRef = useRef<Socket | null>( null );
    const lastCallTimeRef = useRef<number>( 0 );

    const fetchAddress = useCallback( async ( lat: number, lng: number ) =>
    {
        const now = Date.now();
        if ( now - lastCallTimeRef.current < 2000 )
        {
            // Skip if less than 2 sec
            return coords?.address || "Default location!";
        }
        lastCallTimeRef.current = now;

        try
        {
            // console.log( API_KEY )
            const res = await axios.get(
                `https://us1.locationiq.com/v1/reverse?key=pk.ec2814e98c3e1916390f6dd2a3dda00d&lat=${ lat }&lon=${ lng }&format=json&_gl=1*1jxiud2*_ga*MTkxNDUwNTc4Ny4xNzU1OTY2MjIx*_ga_TRV5GF9KFC*czE3NTU5NjYyMjEkbzEkZzEkdDE3NTU5NjY4MTMkajYwJGwwJGgw`,
            );
            // console.log( res.data )
            return res.data.display_name || "Address not found";
        } catch ( err )
        {
            console.error( "Reverse geocode error:", err );
            return "Unknown location";
        }
    }, [ coords?.address ] );

    const startTracking = useCallback( () =>
    {
        if ( !navigator.geolocation )
        {
            setError( "Geolocation not supported by your browser." );
            return;
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            async ( pos ) =>
            {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const address = await fetchAddress( lat, lng );

                setCoords( { lat, lng, address } );
                setError( null );

                socketRef.current?.emit( "update-location", {
                    userId,
                    coordinates: [ lng, lat ],
                    address: address.length ? address : "Default address",
                } );
            },
            ( err ) =>
            {
                if ( err.code === err.PERMISSION_DENIED )
                {
                    setError(
                        "Location permission denied. Please enable it in your browser settings and retry."
                    );
                } else
                {
                    setError( "Unable to fetch location. Please try again." );
                }
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
    }, [fetchAddress, userId] );
    
    useEffect( () =>
    {
        if ( !userId ) return;

        socketRef.current = io( "http://localhost:3000" );
        startTracking();

        return () =>
        {
            if ( watchIdRef.current !== null ) navigator.geolocation.clearWatch( watchIdRef.current );
            socketRef.current?.disconnect();
        };
    }, [startTracking, userId] );

    

    console.log("location fetching")

    return { coords, error, retry: startTracking };
};