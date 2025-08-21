import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export const useContinuousLocation = ( userId: string ) =>
{
    const [ coords, setCoords ] = useState<LocationData | null>( null );
    const [ error, setError ] = useState<string | null>( null );
    const watchIdRef = useRef<number | null>( null );
    const socketRef = useRef<Socket | null>( null );

    // Start tracking only when userId is present
    useEffect( () =>
    {

        socketRef.current = io( "http://localhost:3000" );
        startTracking();

        return () =>
        {
            if ( watchIdRef.current !== null )
                navigator.geolocation.clearWatch( watchIdRef.current );
            socketRef.current?.disconnect();
        };
    }, [ userId ] );

    const fetchAddress = async ( lat: number, lng: number ) =>
    {
        try
        {
            const res = await axios.get(
                "https://nominatim.openstreetmap.org/reverse",
                { params: { format: "json", lat, lon: lng } }
            );
            return res.data.display_name;
        } catch ( err )
        {
            console.error( "Reverse geocode error:", err );
            return "";
        }
    };

    const startTracking = () =>
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
                    address,
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
    };

    console.log(coords, error)
    return { coords, error, retry: startTracking };
};